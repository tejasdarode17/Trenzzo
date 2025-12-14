import express from "express";
import { addAddress, addCart, addProductReview, buyNow, checkOut, decreaseCartQuantity, deleteCart, deleteReview, editAddress, fetchCart, fetchProductDetails, fetchReviewsForProduct, fetchSearchProducts, fetchSearchSuggestions, getAllOrders, getUserReviews, removeItemFromCart, userChangePassword, userPersonalInfoChange, userReturnRequest } from "../controllers/userControllers.js";
import { verifyUser } from "../middlewares/auth.js"

const route = express.Router()

route.get("/search/suggestions", fetchSearchSuggestions)
route.get("/search", fetchSearchProducts)

route.get("/product-details/:slug", verifyUser, fetchProductDetails)

route.post("/address", verifyUser, addAddress)
route.post("/address/:id", verifyUser, editAddress)

route.post("/add-cart", verifyUser, addCart)
route.post("/decrease-quantity", verifyUser, decreaseCartQuantity)
route.post("/remove-cart", verifyUser, removeItemFromCart)
route.delete("/delete-cart", verifyUser, deleteCart)

route.post("/buy-now", verifyUser, buyNow)
route.get("/cart", verifyUser, fetchCart)
route.get("/checkout", verifyUser, checkOut)

route.get("/orders", verifyUser, getAllOrders)

route.post("/return-req", verifyUser, userReturnRequest)
route.post("/product/review", verifyUser, addProductReview)
route.delete("/product/delete/review/:id", verifyUser, deleteReview)
route.get("/fetch/user/reviews", verifyUser, getUserReviews)

//this route is access by seller as well as user
route.get("/fetch/reviews", verifyUser, fetchReviewsForProduct)

route.post("/user/change-password", verifyUser, userChangePassword)
route.post("/user/info", verifyUser, userPersonalInfoChange)

export default route
