import { useSelector } from "react-redux";
import { RootState } from "../store";

const CartStatus = () => {
    const cart = useSelector((state: RootState) => state.cart);
    const total = cart.cart.reduce((acc, item) => acc + item.quantity, 0);
    const price = cart.cart.reduce((acc, item) => acc + (parseFloat(item.estPrice) * item.quantity), 0);

    return <p>You currently have {total} items in your cart, totalling ${price.toFixed(2)} USD</p>;
};

export default CartStatus;
