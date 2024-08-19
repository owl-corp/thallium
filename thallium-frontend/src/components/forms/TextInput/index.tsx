import styled from "styled-components";
import { InputScale } from "./options";


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


const SubmitButton = styled.button`
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
            {onSubmit && <SubmitButton
                onClick={() => {
                    void onSubmit();
                }}
            >
                {submitLabel ? submitLabel : "Submit"}
            </SubmitButton>}
        </InputContainer>
    );
};

export default TextInput;
