import styled, { keyframes } from "styled-components";

const spanKeyframes = keyframes`
    0% {
        filter: brightness(1);
    }
    50% {
        filter: brightness(0.5);
    }
    100% {
        filter: brightness(1);
    }
`;

const LoadingBarContainer = styled.div`
    span {
        background-color: ${({ theme }) => theme.accent};
        display: inline-block;
        height: 1rem;
        width: 1rem;
        margin: 0.5rem;
        animation: ${spanKeyframes} 1s infinite;
    }

    span:nth-child(1) {
        animation-delay: 0s;
    }

    span:nth-child(2) {
        animation-delay: 0.25s;
    }

    span:nth-child(3) {
        animation-delay: 0.5s;
    }
`;


const LoadingBar = () => {
    return (
        <LoadingBarContainer>
            <span></span>
            <span></span>
            <span></span>
        </LoadingBarContainer>
    );
};

export default LoadingBar;
