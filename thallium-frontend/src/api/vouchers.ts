import { get, post } from "./client";

export interface Voucher {
    id: string;
    voucher_code: string;
    active: boolean;
    balance: string;
    created_at: string;
    updated_at: string;
}

export interface VoucherClaim {
    voucher_code: string;
    jwt: string;
}

export const validateVoucher = async (voucher_code: string): Promise<VoucherClaim> => {
    return await post("/voucher-login", { voucher_code }) as unknown as VoucherClaim;
};

export const getCurrentVoucher = async (voucherJWT: string): Promise<Voucher> => {
    return await get("/vouchers/me", {
        headers: {
            Authorization: `Bearer ${voucherJWT}`,
        },
    }) as unknown as Voucher;
};
