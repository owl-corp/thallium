import { createSlice } from "@reduxjs/toolkit";

interface CartItem {
    product_template_id: number,
    quantity: number,
    variant_id: number,
    estPrice: string,
}

const cartSlice = createSlice({
    name: "cart",
    initialState: {
        cart: [] as CartItem[],
    },
    reducers: {
        addCartItem(state, action: { payload: { product_template_id: number, variant_id: number, estPrice: string } }) {
            const existingItem = state.cart.find((item) => item.product_template_id === action.payload.product_template_id && item.variant_id === action.payload.variant_id);

            if (existingItem) {
                existingItem.quantity += 1;
                return;
            }

            state.cart.push({
                product_template_id: action.payload.product_template_id,
                quantity: 1,
                variant_id: action.payload.variant_id,
                estPrice: action.payload.estPrice,
            });
        },
        removeCartItem(state, action: { payload: CartItem }) {
            const existingItem = state.cart.find((item) => item.product_template_id === action.payload.product_template_id && item.variant_id === action.payload.variant_id);

            if (existingItem) {
                existingItem.quantity -= 1;
                if (existingItem.quantity === 0) {
                    state.cart = state.cart.filter((item) => item.product_template_id !== action.payload.product_template_id && item.variant_id !== action.payload.variant_id);
                }
            }
        },
    },
});

export const { addCartItem, removeCartItem } = cartSlice.actions;

export default cartSlice.reducer;
