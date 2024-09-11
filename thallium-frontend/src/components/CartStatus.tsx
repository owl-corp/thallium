import { useSelector } from "react-redux";
import { RootState } from "../store";
import { useRef, useEffect } from "react";
import styled from "styled-components";
import Button from "./forms/Button";
import { useNavigate } from "react-router-dom";
import { useVisible } from "../utils/hooks";

const StatusHolder = styled.span`
    margin-top: 1rem;
    margin-bottom: 1rem;

`;

const FloatingButton = styled(Button)<{ $visible: boolean }>`
position: fixed;
z-index: 10;
opacity: ${(props) => props.$visible ? "1" : "0"};
bottom: 0;
margin-bottom: 30px;
right: 0;
margin-right: 30px;
transition: all 0.25s;
`

const CartStatus = () => {
    const cart = useSelector((state: RootState) => state.cart);
    const total = cart.cart.reduce((acc, item) => acc + item.quantity, 0);
    const price = cart.cart.reduce((acc, item) => acc + (parseFloat(item.estPrice) * item.quantity), 0);

    const staticButtonRef = useRef<Button>(null);
    const buttonVisible = useVisible(staticButtonRef);

    useEffect(() => {
        console.log(buttonVisible)
    }, [buttonVisible])

    const checkoutMsg = total > 0 ? "Checkout >" : "Add some items to proceed to checkout"

    const navigate = useNavigate();

    const buttonCallback = () => {
        navigate("/checkout");
    }

    return <>
        <StatusHolder>You currently have {total} item{total !== 1 ? "s" : null} in your cart, totalling ${price.toFixed(2)} USD</StatusHolder>
        <Button ref={staticButtonRef} disabled={total === 0} onClick={buttonCallback}>
            {checkoutMsg}
        </Button>
        <FloatingButton $visible={!buttonVisible && total > 0} onClick={buttonCallback}>
            {checkoutMsg}
        </FloatingButton>
    </>;
};

export default CartStatus;
