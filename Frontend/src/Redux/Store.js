import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import productsSlice from "./productsSlice"
import sellerSlice from "./sellerSlice"
import categoriesSlice from "./categoriesSlice"
import adminSlice from "./adminSlice"
import bannersSlice from "./bannersSlice"
import cartSlice from "./cartSlice"
import userSlice from "./userSlice"
import deliverySlice from "./deliverySlice"
import reviewSlice from "./reviewSlice"

const store = configureStore({
    reducer: {
        auth: authSlice,
        seller: sellerSlice,
        admin: adminSlice,
        product: productsSlice,
        categories: categoriesSlice,
        banners: bannersSlice,
        cart: cartSlice,
        user: userSlice,
        delivery: deliverySlice,
        review: reviewSlice
    }
})

export default store