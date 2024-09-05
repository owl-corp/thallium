import { createSlice } from "@reduxjs/toolkit";

const authorizationSlice = createSlice({
    name: "authorization",
    initialState: {
        voucherToken: null as string | null,
        userToken: null as string | null,
        refreshTask: null as NodeJS.Timeout | null,
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
        },
        setRefreshTask(state, action: { payload: NodeJS.Timeout }) {
            state.refreshTask = action.payload;
        }
    },
});

export const { setVoucherToken, setUserToken, clearToken, setRefreshTask } = authorizationSlice.actions;

export default authorizationSlice.reducer;
