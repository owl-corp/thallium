import { get } from "./client";

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

export const getCurrentVoucher = async (voucherJWT: string): Promise<Voucher> => {
    return await get("/vouchers/me", {
        headers: {
            Authorization: `Bearer ${voucherJWT}`,
        },
    }) as unknown as Voucher;
};
