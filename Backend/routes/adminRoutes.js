import express from "express"
import { verifyUser } from "../middlewares/auth.js"
import { changeSellerStatus, createBanner, createCarousel, createCatogery, deleteBanner, deleteCarousel, deleteCatogery, editCarousel, editCategory, fetchBanners, fetchCarousel, getAdminDashboardStats, getAllCategories, getAllSellers, getSelectedSeller } from "../controllers/adminControllers.js"

const route = express.Router()

route.post("/admin/add-category", verifyUser, createCatogery)
route.get("/admin/category", getAllCategories)
route.post("/admin/edit-category/:id", verifyUser, editCategory)
route.delete("/admin/delete-category/:id", verifyUser, deleteCatogery)

route.get("/admin/stats", verifyUser, getAdminDashboardStats)
route.get("/admin/sellers", verifyUser, getAllSellers)
route.get("/admin/seller/:id", verifyUser, getSelectedSeller)
route.post("/admin/status-seller/:id", verifyUser, changeSellerStatus)


route.post("/admin/add-carousel", verifyUser, createCarousel)
route.get("/carousels", fetchCarousel)
route.post("/admin/edit-carousel/:id", verifyUser, editCarousel)
route.delete("/admin/delete-carousel/:id", verifyUser, deleteCarousel)

route.post("/admin/add-banner", verifyUser, createBanner)
route.get("/banners", fetchBanners)
route.delete("/admin/delete-banner/:id", verifyUser, deleteBanner)



export default route