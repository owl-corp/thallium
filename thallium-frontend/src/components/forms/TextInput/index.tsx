import styled from "styled-components";
import { InputScale } from "./options";

import Button from "../Button";


interface TextInputProps {
    label: string;
    type: string;
    value: string;
    placeholder?: string;
    scale?: InputScale;
    onChange: (value: string) => void;
    onSubmit?: () => void | Promise<void>;
    submitLabel?: string;
}

const Input = styled.input<{ $scale: InputScale }>`
    padding: 0.5rem;
    margin-top: 0.5rem;
    font-family: inherit;
    border-radius: 0px;
    color: ${({ theme }) => theme.textColor};
    background-color: ${({ theme }) => theme.inputBackgroundColor};
    border: none;
    width: ${(props) => props.$scale};
    height: 1.5rem;
    transition: outline 0.2s;
    outline: 2px solid transparent;

    &::placeholder {
        color: ${({ theme }) => theme.inputPlaceholderColor};
    }

    &:focus {
        outline: 2px solid ${({ theme }) => theme.accent};
        border: none;
    }
`;

const InputContainer = styled.div`
    label {
        display: block;
        font-size: 0.8rem;
        font-weight: bold;
    }

    &:focus-within button {
        outline: 2px solid ${({ theme }) => theme.accent};
    }
`;


const TextInput = ({ label, type, value, placeholder, scale, onChange, onSubmit, submitLabel }: TextInputProps) => {
    if (!scale) {
        scale = InputScale.Medium;
    }

    return (
        <InputContainer>
            <label>{label}</label>
            <Input
                type={type}
                value={value}
                $scale={scale}
                onChange={(e) => { onChange(e.target.value); }}
                placeholder={placeholder}
                onKeyDown={(e) => {
                    if (e.key === "Enter" && onSubmit) {
                        void onSubmit();
                    }
                }}
            />
            {onSubmit && <Button
                onClick={() => {
                    void onSubmit();
                }}
            >
                {submitLabel ? submitLabel : "Submit"}
            </Button>}
        </InputContainer>
    );
};

export default TextInput;
