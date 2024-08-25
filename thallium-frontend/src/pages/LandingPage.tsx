import Card from "../components/Card";
import VoucherValidator from "../components/VoucherValidator";
import MaxWidthContainer from "../components/MaxWidthContainer";

const LandingPage = () => {
    return (
        <MaxWidthContainer>
            <Card title="Welcome to Thallium">
                <p>
                    Thallium is a project being developed by Owl Corp.
                </p>
                <p>
                    LLAP. 🖖
                </p>
            </Card>
            <Card title="What is Thallium?" seamless>
                <p>
                    Thallium is a giveaway claiming tool for communities backed by Printful.
                </p>
            </Card>

            <Card title="More Information">
                <p>
                    You can keep track of the development progress on the <a href="https://github.com/owl-corp/thallium">GitHub repository</a>.
                </p>
            </Card>

            <VoucherValidator />
        </MaxWidthContainer>
    );
};

export default LandingPage;
