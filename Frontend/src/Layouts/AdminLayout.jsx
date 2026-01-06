import { Outlet } from "react-router-dom"
import AdminSidebar from "@/Main Components/Admin/Admin Navigation/AdminSidebar"

const AdminLayout = () => {
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
