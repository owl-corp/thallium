import { useRouteError, isRouteErrorResponse } from "react-router-dom";

import Card from "../components/Card";

const ErrorPage = () => {
    const error = useRouteError();

    let title = "Unexpected Error", message, isUnexpected = false;

    if (isRouteErrorResponse(error)) {
        if (error.status === 404) {
            title = "Not Found";
            message = "The requested page could not be found.";
        } else {
            message = error.statusText;
        }
    } else if (error instanceof Error) {
        message = error.message;
        isUnexpected = true;
    } else if (typeof error === "string") {
        message = error;
        isUnexpected = true;
    } else {
        console.error(error);
        message = "Unknown error";
        isUnexpected = true;
    }

    return <Card title={title}>
        {isUnexpected && <strong>An error occurred:</strong>}
        <p>
            {message}
        </p>
    </Card>;
};

export default ErrorPage;
