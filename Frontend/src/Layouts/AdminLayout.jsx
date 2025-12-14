import AdminSidebar from "@/Main Components/Admin/Admin Navigation/AdminSidebar"
import { getAdminStats } from "@/Redux/adminSlice"
import { fetchAllBanners, fetchAllCarousels } from "@/Redux/bannersSlice"
import { fetchAllCategories } from "@/Redux/categoriesSlice"
import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { Outlet } from "react-router-dom"
const AdminLayout = () => {

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getAdminStats())
        dispatch(fetchAllCategories())
        dispatch(fetchAllCarousels())
        dispatch(fetchAllBanners())
    }, []);

    return (
        <div className="flex min-h-screen w-full">
            <div >
                <AdminSidebar></AdminSidebar>
            </div>
            <div className="flex-1 p-4 lg:p-10 overflow-x-hidden">
                <Outlet></Outlet>
            </div>
        </div>
    )
}

export default AdminLayout
