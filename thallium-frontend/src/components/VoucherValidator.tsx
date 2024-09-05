import Card from "./Card";
import TextInput from "./forms/TextInput";
import styled from "styled-components";
import { useState } from "react";
import { voucherLogin } from "../api/login";
import { APIError } from "../api/client";
import { setVoucherToken } from "../slices/authorization";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import { useNavigate } from "react-router-dom";
import Button from "./forms/Button";
import { decodeJWT, isJWTExpired, maybeRefreshTask } from "../api/jwt";


const VoucherValidateContainer = styled.div`
    margin-bottom: 1rem;
`;

const VoucherValidator = () => {
    const [voucherCode, setVoucherCode] = useState("");
    const [error, setError] = useState<string | null>(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const voucherToken = useSelector((state: RootState) => state.authorization.voucherToken);

    let expired = false;

    if (voucherToken) {
        const parsed = decodeJWT(voucherToken);
        expired = isJWTExpired(parsed);
    }


    const validate = async () => {
        try {
            const voucherClaim = await voucherLogin(voucherCode);

            dispatch(setVoucherToken(voucherClaim.jwt));

            setError(null);

            maybeRefreshTask();
        } catch (e) {
            if (e instanceof APIError) {
                if (e.data?.detail) {
                    setError(e.data.detail);
                } else {
                    setError(e.message);
                }
            } else {
                setError("An unknown error occurred.");
            }
        }
    };

    return (
        <Card title="Voucher Validator">
            <VoucherValidateContainer>
                <p>Enter your voucher code to view information.</p>
                <TextInput
                    label="Voucher Code"
                    type="text"
                    value={voucherCode}
                    placeholder="Enter your voucher code"
                    onChange={setVoucherCode}
                    onSubmit={validate}
                    submitLabel="Validate Code"
                />
            </VoucherValidateContainer>

            {(voucherToken && !expired) && (
                <>
                    <h3>Voucher successfully validated!</h3>
                    <Button onClick={() => {
                        navigate("/store");
                    }}>Go to store</Button>
                </>
            )}

            {expired && (
                <div>
                    <h3>Session expired</h3>
                    <p>Your voucher session has expired. Please enter your voucher again.</p>
                </div>
            )}

            {error && (
                <div>
                    <h3>Error</h3>
                    <p>{error}</p>
                </div>
            )}
        </Card>
    );
};

export default VoucherValidator;
