import { post } from "./client";
import { VoucherClaim } from "./vouchers";

interface RefreshReturn {
    jwt: string;
}

export const voucherLogin = async (voucher_code: string): Promise<VoucherClaim> => {
    return await post("/voucher-login", { voucher_code }) as unknown as VoucherClaim;
};

export const refreshToken = async (voucherJWT: string): Promise<RefreshReturn> => {
    return await post("/refresh-token", {}, {
        headers: {
            Authorization: `Bearer ${voucherJWT}`,
        },
    }) as unknown as RefreshReturn;
};
