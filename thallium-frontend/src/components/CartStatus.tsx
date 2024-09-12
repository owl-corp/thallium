import { useSelector } from "react-redux";
import { RootState } from "../store";
import { useRef } from "react";
import styled from "styled-components";
import Button from "./forms/Button";
import { useNavigate } from "react-router-dom";
import { useVisible } from "../utils/hooks";
import Card from "./Card";

const StatusHolder = styled.div`
margin-top: 1rem;
margin-bottom: 1rem;
`;

const FloatingStatusHolder = styled(StatusHolder) <{ $visible: boolean }>`
position: fixed;
z-index: 10;
margin-top: 2rem;
opacity: ${(props) => props.$visible ? "1" : "0"};
transition: all 0.25s;

${Card} {
  box-shadow: none;
}
`;

const FloatingButton = styled(Button) <{ $visible: boolean }>`
position: fixed;
z-index: 10;
opacity: ${(props) => props.$visible ? "1" : "0"};
bottom: 0;
margin-bottom: 30px;
right: 0;
margin-right: 30px;
transition: all 0.25s;
font-size: 1.1em;
`;

const DetailsSpan = styled.span`
color: ${(props) => props.theme.accent};
font-weight: bold;
font-size: 1.1em;
`;

const CartStatusContainer = styled.div`
text-align: center;
`;

const CartStatus = () => {
    const cart = useSelector((state: RootState) => state.cart);
    const total = cart.cart.reduce((acc, item) => acc + item.quantity, 0);
    const price = cart.cart.reduce((acc, item) => acc + (parseFloat(item.estPrice) * item.quantity), 0);

    const staticButtonRef = useRef<HTMLButtonElement>(null);
    const buttonVisible = useVisible(staticButtonRef, true);

    const checkoutMsg = total > 0 ? "Confirm & Checkout >" : "Add some items to proceed to checkout";

    const navigate = useNavigate();

    const buttonCallback = () => {
        navigate("/checkout");
    };

    const statusDetails = (
        <>
            You currently have <DetailsSpan>{total}</DetailsSpan> item{ total !== 1 ? "s" : null } in your cart, totalling <DetailsSpan>${ price.toFixed(2) } USD</DetailsSpan>
        </>
    );

    return <>
        <Card title="Your Cart">
            <CartStatusContainer>
                <StatusHolder>{statusDetails}</StatusHolder>
                <Button ref={staticButtonRef} disabled={total === 0} onClick={buttonCallback}>
                    {checkoutMsg}
                </Button>
            </CartStatusContainer>
        </Card>
        <FloatingStatusHolder $visible={!buttonVisible}>
            <Card title="Your Cart">
            {statusDetails}
            </Card>
        </FloatingStatusHolder>
        <FloatingButton $visible={!buttonVisible && total > 0} onClick={buttonCallback}>
            {checkoutMsg}
        </FloatingButton>
    </>;
};

export default CartStatus;
