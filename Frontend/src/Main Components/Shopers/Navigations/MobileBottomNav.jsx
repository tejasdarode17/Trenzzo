import { Link, useLocation } from "react-router-dom";
import { Home, ShoppingCart, User, ListOrdered, Heart } from "lucide-react";
import { useCart } from "@/hooks/shopper/useCart";

const tabs = [
    { path: "/", label: "Home", icon: Home },
    { path: "/wishlist", label: "Wishlist", icon: Heart },
    { path: "/cart", label: "Cart", icon: ShoppingCart },
    { path: "/orders", label: "Orders", icon: ListOrdered },
    { path: "/account", label: "Account", icon: User },
]

const MobileBottomNav = () => {
    const location = useLocation();

    const { data, isLoading } = useCart();
    const cart = data?.cart;

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 h-15 bg-white border-t z-40">
            <div className="grid grid-cols-5 h-full">
                {tabs.map(({ path, label, icon: Icon }) => {
                    const active = location.pathname === path;
                    return (
                        <Link
                            key={path}
                            to={path}
                            className={`flex flex-col items-center justify-center text-xs ${active ? "text-indigo-600" : "text-gray-500"}`}
                        >
                            <div className="relative">
                                <Icon size={20} />
                                {path === "/cart" && cart?.items?.length > 0 && (
                                    <span className="absolute -top-1 -right-2 bg-red-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                                        {cart.items.length}
                                    </span>
                                )}
                            </div>
                            <span className="mt-1">{label}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
};

export default MobileBottomNav;
