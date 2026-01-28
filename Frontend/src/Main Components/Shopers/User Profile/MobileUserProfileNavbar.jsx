import React from "react";
import { User, MapPin, Settings, LogOut } from "lucide-react";

const MobileUserProfileNavbar = ({ userData, currentPath, onNavigate, onLogout, }) => {
    return (
        <div className="lg:hidden">
            {/* USER INFO */}
            <div className="flex items-center gap-3 px-4 pt-4">
                <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-amber-600" />
                </div>

                <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                        {userData?.username}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                        {userData?.email}
                    </p>
                </div>
            </div>

            {/* TAB NAV */}
            <div className="mt-4 border-t">
                <div className="flex justify-around px-2 py-2">
                    <MobileTab
                        icon={User}
                        label="Profile"
                        active={currentPath === "/account"}
                        onClick={() => onNavigate("/account")}
                    />

                    <MobileTab
                        icon={MapPin}
                        label="Address"
                        active={currentPath === "/account/address"}
                        onClick={() => onNavigate("/account/address")}
                    />

                    <MobileTab
                        icon={Settings}
                        label="Settings"
                        active={currentPath === "/account/settings"}
                        onClick={() => onNavigate("/account/settings")}
                    />

                    <MobileTab
                        icon={LogOut}
                        label="Logout"
                        danger
                        onClick={onLogout}
                    />
                </div>
            </div>
        </div>
    );
};

export default MobileUserProfileNavbar;

/* ---------- Helper ---------- */

function MobileTab({ icon: Icon, label, active, danger, onClick }) {
    return (
        <button
            onClick={onClick}
            className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition ${danger ? "text-red-600" : active ? "text-amber-600" : "text-gray-500"}`}
        >
            <Icon className="w-5 h-5" />
            <span className="text-xs font-medium">{label}</span>
            {active && !danger && (
                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-amber-500" />
            )}
        </button>
    );
}
