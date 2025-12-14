import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { clearUser } from "@/Redux/authSlice";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Menu, LogOut, LayoutDashboard, Truck, ClipboardList, MapPin } from "lucide-react";

const DeliverySidebar = () => {
    const [openSheet, setOpenSheet] = useState(false);
    const navigate = useNavigate();

    return (
        <>
            {/* Desktop Sidebar */}
            <div className="hidden lg:flex flex-col w-64 min-h-screen bg-white border-r text-gray-800">
                <div
                    onClick={() => navigate("/delivery")}
                    className="flex gap-2 items-center px-6 py-5 text-xl font-semibold border-b cursor-pointer"
                >
                    <Truck className="text-orange-600" />
                    Delivery Panel
                </div>
                <SideBarMenu />
            </div>

            {/* Mobile Sidebar */}
            <div className="lg:hidden">
                <Sheet open={openSheet} onOpenChange={setOpenSheet}>
                    <SheetTrigger asChild>
                        <Menu onClick={() => setOpenSheet(true)} />
                    </SheetTrigger>
                    <SheetContent side="left" className="w-64">
                        <SheetHeader>
                            <SheetTitle
                                onClick={() => navigate("/delivery")}
                                className="flex gap-2 items-center mt-2 cursor-pointer"
                            >
                                <Truck />
                                Delivery Panel
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
    const location = useLocation();
    const dispatch = useDispatch();

    async function handleLogout() {
        try {
            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/user/logout`, {}, { withCredentials: true });

            dispatch(clearUser());
            navigate("/delivery/auth/login");
        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message || "Logout failed");
        }
    }

    const items = [
        { id: 1, name: "Dashboard", icon: <LayoutDashboard />, path: "/delivery" },
        { id: 2, name: "Ongoing Deliveries", icon: <ClipboardList />, path: "/delivery/ongoing-orders" },
        { id: 2, name: "Rerurn Deliveries", icon: <ClipboardList />, path: "/delivery/return-orders" },
        { id: 2, name: "All Orders", icon: <ClipboardList />, path: "/delivery/all-orders" },
    ];

    return (
        <div className="flex flex-col gap-1 px-2 py-4">

            {items.map(item => (
                <Button
                    key={item.id}
                    onClick={() => {
                        navigate(item.path);
                        if (setOpenSheet) setOpenSheet(false);
                    }}
                    variant="ghost"
                    className={`flex items-center gap-3 w-full justify-start px-4 py-2 text-sm font-medium rounded-md
                        ${location.pathname === item.path
                            ? "bg-orange-100 text-orange-700 hover:bg-orange-100"
                            : "hover:bg-gray-100 text-gray-700"}`}
                >
                    {item.icon}
                    {item.name}
                </Button>
            ))}

            <Button
                onClick={handleLogout}
                variant="ghost"
                className="flex items-center gap-3 w-full justify-start px-4 py-2 text-sm font-medium text-red-500 hover:bg-red-50"
            >
                <LogOut />
                Logout
            </Button>
        </div>
    );
};

export default DeliverySidebar;
