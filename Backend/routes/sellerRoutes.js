import express from "express"
import { addProduct, assignOrderToDeliveryPartner, assignReturnOrderToDeliveryPartner, changeOrderStatus, deleteProduct, editProduct, fetchAllDeliveryPartners, fetchAllReturnRequests, fetchRecetTenOrders, fetchSellerOrders, fetchSellerStats, getAllSellerProducts, getSellerSingleProduct, sellerChangePassword, sellerPersonalInfoChange, toggleProductStatus, updateReturnStatusForSeller } from "../controllers/sellerControllers.js"
import { verifyUser } from "../middlewares/auth.js"

const route = express.Router()


route.post("/seller/add-product", verifyUser, addProduct)
route.get("/seller/products", verifyUser, getAllSellerProducts)
route.get("/seller/product/:id", verifyUser, getSellerSingleProduct)
route.post("/seller/edit/product/:id", verifyUser, editProduct)
route.post("/seller/delete/product/:id", verifyUser, deleteProduct)
route.post("/seller/active/product/:id", verifyUser, toggleProductStatus)

route.get("/seller/all-orders", verifyUser, fetchSellerOrders)
route.get("/seller/recent-orders", verifyUser, fetchRecetTenOrders)
route.get("/seller/stats", verifyUser, fetchSellerStats)
route.post("/seller/order/status", verifyUser, changeOrderStatus)

route.get("/delivery/all", verifyUser, fetchAllDeliveryPartners)
route.post("/seller/assign/order", verifyUser, assignOrderToDeliveryPartner)


route.get("/seller/returns", verifyUser, fetchAllReturnRequests)
route.post("/seller/order/return", verifyUser, assignReturnOrderToDeliveryPartner)

route.post("/seller/return/update-status", verifyUser, updateReturnStatusForSeller)



route.post("/seller/change-password", verifyUser, sellerChangePassword)
route.post("/seller/info", verifyUser, sellerPersonalInfoChange)

export default route