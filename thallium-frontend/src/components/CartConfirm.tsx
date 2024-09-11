import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { useState, useEffect } from "react";
import { getTemplates, Template, Variant } from "../api/templates";
import { APIError, APIMissingTokenError } from "../api/client";
import LoadingBar from "./LoadingBar";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Button from "./forms/Button";
import { removeCartItem, CartItem as CartItemType } from "../slices/cart";

interface CartItemProps {
    product: Template,
    variant: Variant,
    quantity: number,
    cartItem: CartItemType
}

const CartItemHolder = styled.div`
display: flex;
align-items: center;

span {
    flex-grow: 1;
}

div {
    text-align: right;
    margin-right: 20px;
}

h3, p {
    margin: 0;
}

img {
    width: 20%;
    background-color: ${({theme}) => theme.backgroundColor};
}

margin-bottom: 10px;
`;

const CartItem: React.FC<CartItemProps> = ({ product, variant, quantity, cartItem }: CartItemProps) => {
    /* return <div>{product.title} - {variant.size} / {variant.colour} - {quantity} unit{quantity === 1 ? "" : "s"}</div> */
    const dispatch = useDispatch();

    return <CartItemHolder>
        <img src={product.mockup_file_url}/>
        <span></span>
        <div>
            <h3>{product.title}</h3>
            <p><strong>Size:</strong> {variant.size}</p>
            {variant.colour && <p><strong>Colour:</strong> {variant.colour}</p>}
            <p><strong>Quantity:</strong> {quantity}</p>
        </div>
    <Button onClick={() => {
        dispatch(removeCartItem(cartItem));
    }}>
          Remove
        </Button>
    </CartItemHolder>;
};

const CartConfirm = () => {
    const cart = useSelector((state: RootState) => state.cart);
    /* TODO: Refactor to hook */
    const voucherToken = useSelector((state: RootState) => state.authorization.voucherToken);
    const [storeItems, setStoreItems] = useState<Template[] | null>(null);
    const [permissionDenied, setPermissionDenied] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        getTemplates(true).then((items) => {
            setStoreItems(items);
            setLoading(false);
        }).catch((err: unknown) => {
            setStoreItems([]);
            setLoading(false);
            if (err instanceof APIMissingTokenError) {
                setPermissionDenied(true);
            } else if (err instanceof APIError) {
                if ([401, 403].includes(err.status)) {
                    setPermissionDenied(true);
                }
            }
        });
    }, [voucherToken]);

    return <>
        {loading && <LoadingBar/>}
        {permissionDenied && (
            <>
                <p>You need to have a valid voucher code to access the store.</p>
                <Link to="/">Redeem a voucher</Link>
            </>
        )}
        {storeItems && cart.cart.map((cartItem) => {
            const item = storeItems.find((v) => v.template_id === cartItem.product_template_id);
            const variant = item?.variants?.find((variant) => variant.variant_id === cartItem.variant_id);

            if (item && variant) {
                return <CartItem key={cartItem.variant_id} product={item} variant={variant} quantity={cartItem.quantity} cartItem={cartItem} />;
            }
        })}

        {cart.cart.length === 0 && <>
            <strong>You have no items in your cart!</strong>
            <p>Return to the store page to add some items</p>
        </>}
    </>;
};

export default CartConfirm;
