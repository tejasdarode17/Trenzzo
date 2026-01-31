import Logo from "@/ui/Others/Logo";
import { useState } from "react";
import { Outlet } from "react-router-dom";

const AuthLayout = () => {
    const [temp, useTemp] = useState()
    return (
        <div className="min-h-screen bg-white md:bg-gray-50 flex flex-col">

            {/* Main */}
            <main className="flex-1 flex items-center justify-center px-4">
                <div className="w-full max-w-[420px]">

                    {/* Logo */}
                    <div className="flex justify-center mb-2 md:mb-8">
                        <Logo />
                    </div>

                    {/* Content wrapper */}
                    <div className=" w-full bg-white md:rounded-2xl md:shadow px-4 py-6 md:px-8 md:py-10 ">
                        <Outlet />
                    </div>

                </div>
            </main>

            {/* Footer (desktop only) */}
            <footer className="hidden md:block text-xs text-gray-400 text-center py-4">
                © 2024 Trenzzo. All rights reserved.
            </footer>
        </div>
    );
};

export default AuthLayout;
