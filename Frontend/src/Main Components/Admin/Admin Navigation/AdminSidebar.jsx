import { useLocation, useNavigate } from "react-router-dom";
import { FaBoxOpen, FaClipboardList } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { ChartNoAxesCombined, FileText, ImageIcon, LayoutDashboard, LogOut, Menu, Settings, Settings2, Tag, Users, } from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { clearUser } from "@/Redux/authSlice";


const AdminSidebar = () => {

    const [openSheet, setOpenSheet] = useState(false)
    const navigate = useNavigate()

    return (
        <>
            {/* Desktop Sidebar */}
            <div className="hidden lg:flex flex-col w-64 min-h-screen bg-white text-gray-800 border-r border-gray-200 shadow-none">
                <div
                    onClick={() => navigate("/admin")}
                    className="flex gap-2 items-center px-6 py-5 text-xl font-semibold border-b border-gray-100 cursor-pointer"
                >
                    <ChartNoAxesCombined className="text-blue-600" />
                    Admin Panel
                </div>
                <SideBarMenu />
            </div>

            {/* Mobile Sidebar (optional if used here) */}
            <div className="lg:hidden">
                <Sheet open={openSheet} onOpenChange={setOpenSheet}>
                    <SheetTrigger asChild>
                        <Menu onClick={() => setOpenSheet(true)} />
                    </SheetTrigger>
                    <SheetContent side="left" className="w-64">
                        <SheetHeader>
                            <SheetTitle
                                onClick={() => navigate("/admin")}
                                className="flex gap-2 items-center mt-2"
                            >
                                <ChartNoAxesCombined />
                                Seller Panel
                            </SheetTitle>
                        </SheetHeader>
                        <SideBarMenu setOpenSheet={setOpenSheet} />
                    </SheetContent>
                </Sheet>
            </div>
        </>
    );
};



const SideBarMenu = ({ setOpenSheet }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();

    async function handleLogout() {
        try {
            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/user/logout`, {}, { withCredentials: true });
            dispatch(clearUser());
            navigate("/")
        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message);
        }
    }

    const items = [
        { id: 1, name: "Dashboard", icon: <LayoutDashboard />, path: "/admin" },
        { id: 4, name: "Reports", icon: <FileText />, path: "/admin/reports" },
        { id: 6, name: "Sellers", icon: <Users />, path: "/admin/sellers" },
        { id: 3, name: "Categories", icon: <Tag />, path: "/admin/category" },
        { id: 7, name: "Banners", icon: <ImageIcon />, path: "/admin/banners" },
        { id: 9, name: "Settings", icon: <Settings2 />, path: "/admin/settings" },
    ];
    return (
        <div className="flex flex-col gap-1 px-2 py-4">
            {items.map((item) => (
                <Button
                    key={item.id}
                    onClick={() => {
                        navigate(item.path);
                        if (setOpenSheet) setOpenSheet(false);
                    }}
                    variant="ghost"
                    className={`flex items-center gap-3 w-full justify-start px-4 py-2 rounded-md text-sm font-medium transition-colors
                                ${location.pathname === item.path ? "bg-blue-100 text-blue-700 hover:bg-blue-100" : "hover:bg-gray-100 text-gray-700"}`}
                >
                    {item.icon}
                    {item.name}
                </Button>
            ))}

            <Button
                onClick={handleLogout}
                variant="ghost"
                className="flex items-center gap-3 w-full justify-start px-4 py-2 rounded-md text-sm font-medium text-red-500 hover:bg-red-50"
            >
                <LogOut />
                Logout
            </Button>
        </div>
    );
};


export default AdminSidebar;
