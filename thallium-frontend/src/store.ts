import { combineReducers, configureStore } from "@reduxjs/toolkit";

import authorizationReducer from "./slices/authorization.ts";
import cartReducer from "./slices/cart.ts";

const rootReducer = combineReducers({
    authorization: authorizationReducer,
    cart: cartReducer,
});

export const setupStore = (preloadedState?: Partial<RootState>) => {
    return configureStore({
        reducer: rootReducer,
        preloadedState,
    });
};

const found = localStorage.getItem("authorizationState");

let persistedState: RootState["authorization"] = {
    voucherToken: null,
    userToken: null,
    refreshTask: null,
};

if (found) {
    persistedState = localStorage.getItem("authorizationState") ? (JSON.parse(found) as RootState["authorization"]) : persistedState;
}

const store = setupStore({
    authorization: persistedState,
});

export default store;

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;

store.subscribe(() => {
    console.log("Serializing state to localStorage");
    const authState = store.getState().authorization;
    localStorage.setItem("authorizationState", JSON.stringify({
        voucherToken: authState.voucherToken,
        userToken: authState.userToken,
    }));
});
