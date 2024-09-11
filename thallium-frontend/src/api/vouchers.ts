import { APIMissingTokenError, get } from "./client";
import store from "../store";

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

export const getCurrentVoucher = async (): Promise<Voucher> => {
    const { voucherToken } = store.getState().authorization;

    if (!voucherToken) {
        throw new APIMissingTokenError();
    }

    return await get("/vouchers/me", {
        headers: {
            Authorization: `Bearer ${voucherToken}`,
        },
    }) as unknown as Voucher;
};
