import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import sellerSlice from "./sellerSlice"
import deliverySlice from "./deliverySlice"

const store = configureStore({
    reducer: {
        auth: authSlice,
        seller: sellerSlice,
        delivery: deliverySlice,
    }
})

export default store