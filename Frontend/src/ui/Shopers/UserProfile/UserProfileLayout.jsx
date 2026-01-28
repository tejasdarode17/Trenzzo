import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import UserProfileNavbar from "./UserProfileNavbar";
import { useSelector } from "react-redux";

const UserProfileLayout = () => {

    const { isAuthenticated } = useSelector((store) => store.auth)

    if (!isAuthenticated) {
       return <Navigate to="/user/auth/login" replace></Navigate>
    }


    return (
        <div className="py-6 sm:py-8">
            <div className="max-w-6xl mx-auto px-3 sm:px-4">
                <div className="mb-4 sm:mb-8">
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                        My Account
                    </h1>
                </div>

                {/* MOBILE → column | DESKTOP → sidebar */}
                <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
                    {/* NAV */}
                    <div className="lg:w-72 w-full">
                        <UserProfileNavbar />
                    </div>

                    {/* CONTENT */}
                    <div className="flex-1">
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfileLayout;

