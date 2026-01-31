import { Outlet } from "react-router-dom"
import AdminSidebar from "@/ui/Admin/AdminNavigation/AdminSidebar"

const AdminLayout = () => {
    return (
        <div className="flex min-h-screen w-full">
            <div >
                <AdminSidebar></AdminSidebar>
            </div>
            <div className="flex-1 pl-6 py-6 lg:p-10 overflow-x-hidden">
                <Outlet></Outlet>
            </div>
        </div>
    )
}

export default AdminLayout
