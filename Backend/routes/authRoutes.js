import express from "express";


import { loginDeliveryPartner, loginSeller, loginUser, logout, registerDeliveryPartner, registerSeller, registerUser, verifyEmailOtp, checkAuth, getRefreshToken, resendEmailOtp, } from "../controllers/authControllers.js";
import { verifyUser } from "../../middlewares/auth.js";

const route = express.Router()


//this is user routes for login 
route.post("/user/register", registerUser)
route.post("/user/login", loginUser)

//Seller routes for login and registration 
route.post("/seller/register", registerSeller)
route.post("/seller/login", loginSeller)

//delivery partner
route.post("/delivery/register", registerDeliveryPartner)
route.post("/delivery/login", loginDeliveryPartner)

//common routes 
route.post("/verify-otp", verifyEmailOtp)
route.post("/resend-otp", resendEmailOtp)
route.get("/user/check-auth", verifyUser, checkAuth)
route.post("/user/logout", logout)

route.post("/auth/refresh", getRefreshToken)

export default route


