import { useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import { clearUser } from "@/redux/authSlice";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { User, MapPin, Settings, LogOut } from "lucide-react";
import MobileUserProfileNavbar from "./MobileUserProfileNavbar";

const UserProfileNavbar = () => {
    const { userData } = useSelector((s) => s.auth);
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    async function handleLogout() {
        try {
            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/user/logout`, {},
                { withCredentials: true }
            );
            dispatch(clearUser());
            navigate("/");
        } catch (error) {
            toast.error(error?.response?.data?.message || "Logout failed");
        }
    }

    return (
        <Card className="border-gray-200 shadow-sm">
            {/* USER INFO (desktop only) */}
            <div className="hidden lg:flex items-center gap-4 p-5 border-b">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-amber-600" />
                </div>

                <div className="min-w-0">
                    <p className="font-semibold text-gray-900 truncate">
                        {userData?.username}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                        {userData?.email}
                    </p>
                </div>
            </div>

            {/* MOBILE NAV */}
            <MobileUserProfileNavbar
                userData={userData}
                currentPath={location.pathname}
                onNavigate={navigate}
                onLogout={handleLogout}
            />

            {/* DESKTOP NAV */}
            <div className="hidden lg:block p-3 space-y-1">
                <NavButton
                    icon={User}
                    label="Profile"
                    path="/account"
                    currentPath={location.pathname}
                    onClick={() => navigate("/account")}
                />

                <NavButton
                    icon={MapPin}
                    label="Address"
                    path="/account/address"
                    currentPath={location.pathname}
                    onClick={() => navigate("/account/address")}
                />

                <NavButton
                    icon={Settings}
                    label="Settings"
                    path="/account/settings"
                    currentPath={location.pathname}
                    onClick={() => navigate("/account/settings")}
                />

                <Button
                    variant="ghost"
                    onClick={handleLogout}
                    className="w-full justify-start gap-3 rounded-lg text-red-600 hover:bg-red-50"
                >
                    <LogOut className="w-5 h-5" />
                    Logout
                </Button>
            </div>
        </Card>
    );
};

export default UserProfileNavbar;

function NavButton({ icon: Icon, label, path, currentPath, onClick }) {
    const active = currentPath === path;
    return (
        <Button
            variant="ghost"
            onClick={onClick}
            className={`w-full justify-start gap-3 rounded-lg ${active ? "bg-amber-50 text-amber-700" : "text-gray-700 hover:bg-gray-50"}`}
        >
            <Icon className="w-5 h-5" />
            {label}
        </Button>
    );
}
