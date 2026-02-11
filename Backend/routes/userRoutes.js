import express from "express";
import { addAddress, addCart, addProductReview, addProductToWishlist, decreaseCartQuantity, deleteCart, deleteReview, editAddress, fetchCart, fetchCheckout, fetchProductDetails, fetchReviewsForProduct, fetchSearchProducts, fetchSearchSuggestions, fetchTrendingProducts, fetchWishlist, getAllOrders, getOrderDetail, getUserAddresses, getUserReviews, initCheckout, removeItemFromCart, userChangePassword, userPersonalInfoChange, userReturnRequest } from "../controllers/userControllers.js";
import { verifyUser } from "../middlewares/auth.js"

const route = express.Router()

route.get("/search/suggestions", fetchSearchSuggestions)
route.get("/search", fetchSearchProducts)

route.post("/address", verifyUser, addAddress)
route.post("/address/:id", verifyUser, editAddress)
route.get("/fetch-addresses", verifyUser, getUserAddresses)

route.post("/add-cart", verifyUser, addCart)
route.post("/decrease-quantity", verifyUser, decreaseCartQuantity)
route.post("/remove-cart", verifyUser, removeItemFromCart)
route.delete("/delete-cart", verifyUser, deleteCart)

route.get("/cart", verifyUser, fetchCart)

route.post("/checkout/init", verifyUser, initCheckout)
route.get("/checkout", verifyUser, fetchCheckout)

route.get("/orders", verifyUser, getAllOrders)
route.get("/order/:orderId", verifyUser, getOrderDetail)

route.post("/return-req", verifyUser, userReturnRequest)
route.post("/product/review", verifyUser, addProductReview)
route.delete("/product/delete/review/:id", verifyUser, deleteReview)
route.get("/fetch/user/reviews", verifyUser, getUserReviews)

route.post("/user/change-password", verifyUser, userChangePassword)
route.post("/user/info", verifyUser, userPersonalInfoChange)


route.post("/add-wishlist", verifyUser, addProductToWishlist)
route.get("/wishlist", verifyUser, fetchWishlist)

route.get("/product-details/:slug", fetchProductDetails)


route.get("/products/trending", fetchTrendingProducts);


//below route are access by user as well as seller
route.get("/fetch/reviews", fetchReviewsForProduct)


export default route
