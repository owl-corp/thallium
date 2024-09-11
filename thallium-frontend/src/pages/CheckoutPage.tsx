import Card from "../components/Card";
import CartConfirm from "../components/CartConfirm";
import MaxWidthContainer from "../components/MaxWidthContainer";
import Button from "../components/forms/Button";
import { useNavigate } from "react-router-dom";

const CheckoutPage = () => {
    const navigate = useNavigate();

    return <MaxWidthContainer>
        <h1>Checkout</h1>
        <Button onClick={() => {
            navigate("/store");
        }}>&lt; Return to store</Button>
        <Card title="Cart">
            <CartConfirm/>
        </Card>
    </MaxWidthContainer>;
};

export default CheckoutPage;
