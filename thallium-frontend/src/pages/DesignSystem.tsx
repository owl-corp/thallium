import Card from "../components/Card";

import MaxWidthContainer from "../components/MaxWidthContainer";

const DesignSystem = () => {
    return (
        <MaxWidthContainer>
            <h1>Design System</h1>
            <Card title="Card">
                <p>This is a card component.</p>
            </Card>
            <Card title="Seamless Card" seamless>
                <p>
                    This is a seamless card component.
                </p>
            </Card>

        </MaxWidthContainer>
    );
};

export default DesignSystem;
