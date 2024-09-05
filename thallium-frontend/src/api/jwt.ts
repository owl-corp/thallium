import { jwtDecode } from "jwt-decode";

import store from "../store";
import { setRefreshTask, setVoucherToken } from "../slices/authorization";

import { refreshToken } from "./login";

const EXPIRY_PRE_BUFFER = 120;

enum JWTType {
    VOUCHER,
    USER,
}

interface ThalliumJWT {
    sub: string;
    iss: JWTType;
    exp: number;
    nbf: number;
    iat: number;
}

interface RawJWT {
    sub: string;
    iss: string;
    exp: number;
    nbf: number;
    iat: number;
}

const expectedKeys = ["sub", "iss", "exp", "nbf", "iat"];

const decodeJWT = (jwt: string): ThalliumJWT => {
    const decoded = jwtDecode<RawJWT>(jwt);

    const issType = decoded.iss == "thallium:voucher" ? JWTType.VOUCHER : JWTType.USER;

    if (expectedKeys.every((key) => key in Object.keys(decoded))) {
        throw new Error(`Invalid JWT format, found keys: ${Object.keys(decoded).join(", ")}`);
    }

    return {
        sub: decoded.sub,
        iss: issType,
        exp: decoded.exp,
        nbf: decoded.nbf,
        iat: decoded.iat,
    };
};

const isJWTExpired = (jwt: ThalliumJWT): boolean => {
    return jwt.exp < (Date.now() / 1000);
};

const secondsToExpiry = (jwt: ThalliumJWT): number => {
    return jwt.exp - (Date.now() / 1000);
};

const maybeRefreshTask = () => {
    const state = store.getState().authorization;

    if (state.refreshTask) {
        clearInterval(state.refreshTask);
        console.log("Cleared existing refresh task");
    }

    const foundToken = state.voucherToken;

    if (!foundToken) {
        console.log("No token found, not setting refresh task");
        return;
    }

    const parsed = decodeJWT(foundToken);

    if (isJWTExpired(parsed)) {
        console.log("Token is expired, not setting refresh task");
        return;
    }

    const task = setTimeout(() => {
        console.log("Refreshing token");
        refreshToken(foundToken)
            .then((newToken) => {
                store.dispatch(setVoucherToken(newToken.jwt));

                console.log("Refreshed token");

                maybeRefreshTask();
            })
            .catch((e: unknown) => {
                console.error("Failed to refresh token", e);
            });
    }, (secondsToExpiry(parsed) - EXPIRY_PRE_BUFFER) * 1000);

    store.dispatch(setRefreshTask(task));

    console.log("Set refresh task");
};

export { decodeJWT, isJWTExpired, secondsToExpiry, maybeRefreshTask };
