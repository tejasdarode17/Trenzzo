import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import sellerSlice from "./sellerSlice"
import cartSlice from "./cartSlice"
import deliverySlice from "./deliverySlice"

const store = configureStore({
    reducer: {
        auth: authSlice,
        seller: sellerSlice,
        cart: cartSlice,
        delivery: deliverySlice,
    }
})

export default store