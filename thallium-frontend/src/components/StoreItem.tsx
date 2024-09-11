import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { Template, Variant } from "../api/templates";
import Button from "./forms/Button";

import { addCartItem } from "../slices/cart";
import store, { RootState } from "../store";

import { toast } from "react-toastify";
import { useSelector } from "react-redux";

interface StoreItemProps {
    template: Template;
}

const StoreItemContainer = styled.div`
    padding: 1rem;
    box-shadow: 10px 10px 0 ${({ theme }) => theme.cardShadow};

    border: 4px solid ${({ theme }) => theme.borderColor};
    margin: 1rem 0;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;

    h3 {
        margin: 0;
    }

    img {
        width: 75%;
        border-radius: 0.5rem;
        margin-top: 1rem;
        margin-bottom: 1rem;
    }
`;

const ColourSwatch = styled.div<{ $colour: string, $selected: boolean }>`
    width: 1.5rem;
    height: 1.5rem;
    background-color: ${({ $colour }) => $colour};
    border-radius: 1rem;
    display: inline-block;
    margin: 0 0.5rem;
    outline: 2px solid ${({ $selected, theme }) => $selected ? theme.textColor : "transparent"};
    outline-offset: 2px;
    transform: ${({ $selected }) => $selected ? "scale(1.05)" : "scale(1)"};
    transition: transform 0.2s, outline 0.2s;

    &:hover {
        cursor: pointer;
    }
`;

const TwoToneSwatch = styled(ColourSwatch) <{ $colour2: string }>`
    background: linear-gradient(-45deg, ${({ $colour }) => $colour} 50%, ${({ $colour2 }) => $colour2} 50%);
`;

const SizeHolder = styled.div`
margin-top: 1rem;
`;

const SizeButton = styled.button<{ $selected: boolean }>`
border: none;
outline: none;
height: 2rem;
min-width: 40px;
font-family: inherit;
background-color: ${({ theme, $selected }) => $selected ? "white" : theme.accent};
border: 3px solid ${({ theme }) => theme.accent};
${({ theme }) => theme.selectedTheme == "dark" ? "border: none" : ""};
color: ${({ theme, $selected }) => $selected ? theme.accent : "white"};
margin-right: 1px;
margin-left: 1px;
margin-top: 5px;
font-size: 1.1em;
font-weight: 600;
transition: background-color 0.5s, color 0.5s;

&:hover {
    filter: brightness(0.8);
    cursor: pointer;
}

&:first-child {
    margin-left: 0;
}

&:last-child {
    margin-right: 0;
}
`;

const CartButton = styled(Button)`
margin-top: 1rem;
`;


const StoreItem: React.FC<StoreItemProps> = ({ template }: StoreItemProps) => {
    let colours = 0;

    template.variants?.forEach((variant) => {
        if (variant.colour_code2) {
            colours = 2;
        } else if (variant.colour_code) {
            colours = 1;
        }
    });

    const { uniqueColours, uniqueSizes, colourToSizes, initialColour } = useMemo(() => {

        const uniqueColours: string[] = [];

        const uniqueSizes: string[] = [];

        const colourToSizes = new Map<string, string[]>();


        let initialColour = null;

        if (colours === 1) {
            template.variants?.forEach((variant) => {
                if (!variant.colour_code) {
                    return;
                }

                if (!uniqueColours.includes(variant.colour_code)) {
                    uniqueColours.push(variant.colour_code);
                }
            });

            if (template.variants?.[0].colour_code) {
                initialColour = template.variants[0].colour_code;
            }
        } else if (colours === 2) {
            template.variants?.forEach((variant) => {
                if (!variant.colour_code || !variant.colour_code2) {
                    return;
                }

                if (!uniqueColours.includes(`${variant.colour_code}-${variant.colour_code2}`)) {
                    uniqueColours.push(`${variant.colour_code}-${variant.colour_code2}`);
                }
            });

            if (template.variants?.[0].colour_code && template.variants[0].colour_code2) {
                initialColour = `${template.variants[0].colour_code}-${template.variants[0].colour_code2}`;
            }
        }

        template.variants?.forEach((variant) => {
            if (!uniqueSizes.includes(variant.size)) {
                uniqueSizes.push(variant.size);
            }

            if (colours === 1) {
                if (!variant.colour_code) {
                    return;
                }

                if (!colourToSizes.has(variant.colour_code)) {
                    colourToSizes.set(variant.colour_code, []);
                }

                colourToSizes.get(variant.colour_code)?.push(variant.size);
            } else if (colours === 2) {
                if (!variant.colour_code || !variant.colour_code2) {
                    return;
                }

                if (!colourToSizes.has(`${variant.colour_code}-${variant.colour_code2}`)) {
                    colourToSizes.set(`${variant.colour_code}-${variant.colour_code2}`, []);
                }

                colourToSizes.get(`${variant.colour_code}-${variant.colour_code2}`)?.push(variant.size);
            }
        });

        return {
            uniqueColours,
            uniqueSizes,
            colourToSizes,
            initialColour,
        };

    }, [template, colours]);


    const [selectedColour, setSelectedColour] = useState<string | null>(initialColour);
    const [selectedSize, setSelectedSize] = useState<string | null>(uniqueSizes.length === 1 ? uniqueSizes[0] : null);
    const [availableSizes, setAvailableSizes] = useState<string[]>(uniqueSizes);

    const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);

    const maxPrice: number | null = useSelector<RootState>((state) => state.cart.maxPrice) as number | null;
    const cartBalance: number = useSelector<RootState>((state) => state.cart.cart.reduce((acc, item) => acc + (parseFloat(item.estPrice) * item.quantity), 0)) as number;


    useEffect(() => {
        if (selectedColour === null) {
            setAvailableSizes(uniqueSizes);
        } else {
            setAvailableSizes(colourToSizes.get(selectedColour) ?? []);
        }
    }, [selectedColour, colourToSizes, uniqueSizes]);

    useEffect(() => {
        if ((selectedColour === null && colours > 0) || selectedSize === null) {
            setSelectedVariant(null);
            return;
        }

        setSelectedVariant(template.variants?.find((variant) => {
            if (colours === 1) {
                return variant.colour_code === selectedColour && variant.size === selectedSize;
            } else if (colours === 2) {
                if (!variant.colour_code || !variant.colour_code2) {
                    return false;
                }

                return `${variant.colour_code}-${variant.colour_code2}` === selectedColour && variant.size === selectedSize;
            } else {
                return variant.size === selectedSize;
            }
        }) ?? null);
    }, [colours, selectedColour, selectedSize, template.variants]);

    return (
        <StoreItemContainer>
            <h3>{template.title}</h3>
            <img src={template.mockup_file_url} alt={template.title} />

            {(colours === 1 && uniqueColours.length > 1) && (
                <div>
                    {uniqueColours.map((colour) => (
                        <ColourSwatch
                            key={colour}
                            $colour={colour}
                            $selected={selectedColour === colour}
                            onClick={() => { setSelectedColour(colour); }}
                        />
                    ))}
                </div>
            )}

            {colours === 2 && (
                <div>
                    {uniqueColours.map((colour) => {
                        const [colour1, colour2] = colour.split("-");

                        return (
                            <TwoToneSwatch
                                key={colour}
                                $colour={colour1}
                                $colour2={colour2}
                                $selected={selectedColour === colour}
                                onClick={() => { setSelectedColour(colour); }}
                            />
                        );
                    })}
                </div>
            )}

            <SizeHolder>
                {availableSizes.map((size) => (
                    <SizeButton
                        key={size}
                        $selected={selectedSize === size}
                        onClick={() => { setSelectedSize(size); }}
                    >{size}</SizeButton>
                ))}
            </SizeHolder>

            {selectedVariant ?
                <p>${selectedVariant.price} USD</p>
                : <p>Select a size to view price</p>
            }

            <CartButton
                disabled={selectedVariant === null}
                onClick={() => {
                    if (selectedVariant) {
                        if (maxPrice !== null) {
                            if (cartBalance + parseFloat(selectedVariant.price) > maxPrice) {
                                toast.error("You do not have enough balance to purchase this item.");
                                return;
                            }
                        }
                        store.dispatch(addCartItem({
                            product_template_id: template.template_id,
                            variant_id: selectedVariant.variant_id,
                            estPrice: selectedVariant.price,
                        }));

                        toast.success("Item added to cart!");
                    }
                }}
            >Add to Cart</CartButton>
        </StoreItemContainer>
    );
};

export default StoreItem;
