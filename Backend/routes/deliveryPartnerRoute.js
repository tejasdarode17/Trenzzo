import express from "express"
import { verifyUser } from "../middlewares/auth.js"
import { fetchPartnerAllOrders, fetchPartnerPendingOrders, fetchReturnOrders, pickupReturn, updateDeliveryStatus } from "../controllers/deliveryPartnerController.js"

const route = express.Router()

route.get("/delivery/all-orders", verifyUser, fetchPartnerAllOrders)
route.get("/delivery/pending-orders", verifyUser, fetchPartnerPendingOrders)
route.post("/delivery/status", verifyUser, updateDeliveryStatus)


route.get("/delivery/all-returns", verifyUser, fetchReturnOrders)

route.post("/delivery/return/picked", verifyUser, pickupReturn);


export default route