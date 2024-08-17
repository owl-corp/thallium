import { useRouteError } from 'react-router-dom';

import Card from '../components/Card';

const LandingPage = () => {
    const error: any = useRouteError() || {};

    let title, message, isUnexpected = false;

    if (error.status === 404) {
        title = 'Not Found';
        message = 'The requested page could not be found.';
    } else {
        title = 'Error';
        message = error.message || error.statusText;
        isUnexpected = true;
    }

    return (
        <>
            <div>
                <Card title={title}>
                    {isUnexpected && <strong>An error occurred:</strong>}
                    <p>
                        {message}
                    </p>
                </Card>
            </div>
        </>
    );
};

export default LandingPage;
