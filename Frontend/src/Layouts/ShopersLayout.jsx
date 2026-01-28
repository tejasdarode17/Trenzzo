import Navbar from "@/ui/Shopers/Navigations/Navbar";
import Footer from "@/ui/Shopers/Footer";
import MobileBottomNav from "@/ui/Shopers/Navigations/MobileBottomNav";
import { Outlet, useLocation } from "react-router-dom";
import CartFooter from "@/ui/Shopers/Cart/CartFooter";

const ShopersLayout = () => {
    const location = useLocation();
    const path = location.pathname;
    return (
        <div className="min-h-screen flex flex-col bg-[#F1F3F6]">
            <Navbar />

            {/* CONTENT */}
            <div className="flex-1 w-full pb-16 md:pb-0">
                <Outlet />
            </div>

            {/* DESKTOP FOOTER */}
            <div className="hidden md:block">
                {path.startsWith("/cart") ? <CartFooter /> : <Footer />}
            </div>

            {/* MOBILE BOTTOM NAV */}
            <MobileBottomNav />
        </div>
    );
};

export default ShopersLayout;
