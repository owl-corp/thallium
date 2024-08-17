import Card from "../components/Card";

const DesignSystem = () => {
    return (
        <>
            <h1>Design System</h1>
            <Card title="Card">
                <p>This is a card component.</p>
            </Card>
            <Card title="Seamless Card" seamless>
                <p>
                    This is a seamless card component.
                </p>
            </Card>

        </>
    );
};

export default DesignSystem;
