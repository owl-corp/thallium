import Card from "./Card";
import TextInput from "./forms/TextInput";
import { useState } from "react";
import styled from "styled-components";
import { validateVoucher, getCurrentVoucher, type Voucher } from "../api/vouchers";
import { APIError } from "../api/client";

const VoucherDetails = styled.div<{ $some: boolean }>`
    transition: max-height 1.5s ease-in-out;
    overflow: hidden;
`;

const VoucherID = styled.span`
background-color: ${({ theme }) => theme.cardShadow};
padding: 4px;
font-weight: bold;
`;

const VoucherValidator = () => {
    const [voucherCode, setVoucherCode] = useState("");
    const [foundVoucher, setFoundVoucher] = useState<Voucher | null>(null);
    const [error, setError] = useState<string | null>(null);

    const validate = async () => {
        try {
            const voucherClaim = await validateVoucher(voucherCode);
            const voucher = await getCurrentVoucher(voucherClaim.jwt);

            setFoundVoucher(voucher);
            setError(null);
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
            setFoundVoucher(null);
        }
    };

    return (
        <Card title="Voucher Validator">
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

            <VoucherDetails $some={foundVoucher !== null} style={{ maxHeight: foundVoucher ? "1000px" : "0px" }}>
                {foundVoucher && (
                    <>
                        <h3>Voucher Information</h3>
                        <p>ID: <VoucherID>{foundVoucher.id}</VoucherID></p>
                        <p>Voucher Code: {foundVoucher.voucher_code}</p>
                        <p>Active: {foundVoucher.active ? "Yes" : "No"}</p>
                        <p>Balance: {foundVoucher.balance}</p>
                        <p>Created At: {foundVoucher.created_at}</p>
                        <p>Updated At: {foundVoucher.updated_at}</p>
                    </>
                )}
            </VoucherDetails>

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
