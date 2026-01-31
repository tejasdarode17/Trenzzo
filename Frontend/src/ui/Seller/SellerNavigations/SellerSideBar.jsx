import { useLocation, useNavigate } from "react-router-dom";
import { FaBoxOpen, FaClipboardList } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { toast } from "sonner";
import { clearUser } from "@/redux/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { ChartNoAxesCombined, LayoutDashboard, LogOut, Menu, Settings } from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const SellerSidebar = () => {
    const [openSheet, setOpenSheet] = useState(false);
    const navigate = useNavigate();

    return (
        <>
            {/* Desktop Sidebar */}
            <div className="hidden lg:flex flex-col w-64 min-h-full bg-white text-gray-800 border-r border-gray-200 shrink-0">
                <div
                    onClick={() => navigate("/admin")}
                    className="flex gap-2 items-center px-6 py-5 text-lg font-semibold border-b border-gray-100 cursor-pointer"
                >
                    <ChartNoAxesCombined className="text-blue-600" />
                    Seller Panel
                </div>
                <SideBarMenu />
            </div>

            {/* Mobile Sidebar */}
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
    const { notifications, returnNotification } = useSelector((store) => store.seller);

    const handleLogout = async () => {
        try {
            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/user/logout`, {}, { withCredentials: true });
            dispatch(clearUser());
            navigate("/seller/auth/login");
        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message || "Logout failed");
        }
    };

    const items = [
        { id: 1, name: "Dashboard", icon: <LayoutDashboard />, path: "/seller" },
        { id: 2, name: "Products", icon: <FaBoxOpen />, path: "/seller/products" },
        { id: 3, name: "Orders", icon: <FaClipboardList />, path: "/seller/orders" },
        { id: 5, name: "Return Requests", icon: <FaBoxOpen />, path: "/seller/returns" },
        { id: 4, name: "Account Settings", icon: <Settings />, path: "/seller/settings" },
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
                      ${location.pathname === item.path ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100 text-gray-700"}`}
                >
                    <div className="relative flex items-center gap-3">
                        {item.icon}
                        {item.name}

                        {/* Notification Badges */}
                        {(item.name === "Orders" && notifications?.unreadCount > 0) && (
                            <span className="absolute -top-1 -right-6 w-4 h-4 text-xs font-bold text-white bg-red-500 rounded-full flex items-center justify-center">
                                {notifications.unreadCount}
                            </span>
                        )}
                        {(item.name === "Return Requests" && returnNotification?.unreadCount > 0) && (
                            <span className="absolute -top-1 -right-6 w-4 h-4 text-xs font-bold text-white bg-red-500 rounded-full flex items-center justify-center">
                                {returnNotification.unreadCount}
                            </span>
                        )}
                    </div>
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

export default SellerSidebar;
