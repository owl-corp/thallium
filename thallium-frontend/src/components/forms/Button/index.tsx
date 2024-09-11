import styled from "styled-components";

const Button = styled.button`
height: 2.5rem;
padding-left: 1rem;
padding-right: 1rem;
font-family: inherit;
border: none;
background-color: ${({ theme }) => theme.accent};
color: white;
font-weight: bold;
outline: 2px solid transparent;
transition: outline 0.2s, filter 0.2s;
filter: none;


&:hover {
    filter: brightness(0.8);
    cursor: pointer;
}

&[disabled] {
    filter: brightness(0.5);
    cursor: not-allowed;
}
`;

export default Button;
