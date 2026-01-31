import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { ChartNoAxesCombined, FileText, ImageIcon, LayoutDashboard, LogOut, Menu, Settings2, Tag, Users } from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { clearUser } from "@/redux_temp/authSlice";

const AdminSidebar = () => {

    const [openSheet, setOpenSheet] = useState(false)
    const navigate = useNavigate()

    return (
        <>
            {/* Desktop Sidebar */}
            <div className="hidden lg:flex flex-col w-64 min-h-full bg-white text-gray-800 border-r border-gray-200 shrink-0">
                <div
                    onClick={() => navigate("/admin")}
                    className="flex gap-2 items-center px-6 py-5 text-lg font-semibold border-b border-gray-100 cursor-pointer"
                >
                    <ChartNoAxesCombined className="text-blue-600" />
                    Admin Panel
                </div>
                <SideBarMenu />
            </div>

            {/* Mobile Sidebar Trigger */}
            <div className="lg:hidden fixed top-3 left-1 z-50">
                <Sheet open={openSheet} onOpenChange={setOpenSheet}>

                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <Menu className="w-5 h-5" />
                        </Button>
                    </SheetTrigger>

                    <SheetContent side="left" className="w-64 p-0">
                        <SheetHeader className="border-b p-4">
                            <SheetTitle
                                onClick={() => {
                                    navigate("/admin")
                                    setOpenSheet(false)
                                }}
                                className="flex gap-2 items-center cursor-pointer"
                            >
                                <ChartNoAxesCombined />
                                Admin Panel
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
            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/user/logout`,
                {},
                { withCredentials: true }
            );
            dispatch(clearUser());
            navigate("/")
        } catch (error) {
            toast.error(error?.response?.data?.message || "Logout failed");
        }
    }

    const items = [
        { id: 1, name: "Dashboard", icon: <LayoutDashboard size={18} />, path: "/admin" },
        // { id: 4, name: "Reports", icon: <FileText size={18} />, path: "/admin/reports" },
        { id: 6, name: "Sellers", icon: <Users size={18} />, path: "/admin/sellers" },
        { id: 3, name: "Categories", icon: <Tag size={18} />, path: "/admin/category" },
        { id: 7, name: "Banners", icon: <ImageIcon size={18} />, path: "/admin/banners" },
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
                    className={`
                        flex items-center gap-3 w-full justify-start 
                        px-4 py-2 
                        rounded-md 
                        text-sm font-medium 
                        transition-colors
                        ${location.pathname === item.path
                            ? "bg-blue-100 text-blue-700 hover:bg-blue-100"
                            : "hover:bg-gray-100 text-gray-700"
                        }
                    `}
                >
                    {item.icon}
                    {item.name}
                </Button>
            ))}

            <div className="mt-2 border-t pt-2">
                <Button
                    onClick={handleLogout}
                    variant="ghost"
                    className="flex items-center gap-3 w-full justify-start px-4 py-2 rounded-md text-sm font-medium text-red-500 hover:bg-red-50"
                >
                    <LogOut size={18} />
                    Logout
                </Button>
            </div>
        </div>
    );
};

export default AdminSidebar;
