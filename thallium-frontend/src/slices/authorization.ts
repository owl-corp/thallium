import { createSlice } from "@reduxjs/toolkit";

const authorizationSlice = createSlice({
    name: "authorization",
    initialState: {
        voucherToken: null as string | null,
        userToken: null as string | null,
    },
    reducers: {
        setVoucherToken(state, action: { payload: string }) {
            state.voucherToken = action.payload;
        },
        setUserToken(state, action: { payload: string }) {
            state.userToken = action.payload;
        },
        clearToken(state) {
            state.voucherToken = null;
            state.userToken = null;
        }
    },
});

export const { setVoucherToken, setUserToken, clearToken } = authorizationSlice.actions;

export default authorizationSlice.reducer;
