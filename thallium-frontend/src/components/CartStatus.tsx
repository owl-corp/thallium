import { useSelector } from "react-redux";
import { RootState } from "../store";
import styled from "styled-components";
import Button from "./forms/Button";
import { useNavigate } from "react-router-dom";

const StatusHolder = styled.span`
    margin-top: 1rem;
    margin-bottom: 1rem;

`;

const CartStatus = () => {
    const cart = useSelector((state: RootState) => state.cart);
    const total = cart.cart.reduce((acc, item) => acc + item.quantity, 0);
    const price = cart.cart.reduce((acc, item) => acc + (parseFloat(item.estPrice) * item.quantity), 0);

    const navigate = useNavigate();

    return <>
        <StatusHolder>You currently have {total} item{total !== 1 ? "s" : null} in your cart, totalling ${price.toFixed(2)} USD</StatusHolder>
        {total > 0 ? <Button onClick={() => {
            navigate("/checkout");
        }}>
            Checkout &gt;
        </Button> : null}
    </>;
};

export default CartStatus;
