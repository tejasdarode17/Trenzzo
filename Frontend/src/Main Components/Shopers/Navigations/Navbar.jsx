import { Link, useNavigate } from "react-router-dom";
import { Heart, ListOrdered, LogOut, ShoppingCart, User, Search, } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { clearUser } from "@/Redux/authSlice";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu";
import { useState } from "react";
import MobileSearchbar from "./MobileSearchbar";
import DesktopSearchbar from "./DesktopSearchbar";
import Logo from "@/Main Components/Other/Logo";
import { useCart } from "@/hooks/shopper/useCart";

function Navbar() {

  const { isAuthenticated } = useSelector((store) => store.auth);
  const [openMobileSearch, setOpenMobileSearch] = useState(false);

  const { data, isLoading } = useCart();
  const cart = data?.cart;


  return (
    <>
      <nav className="bg-white sticky top-0 z-50 border-b md:shadow">
        <div className="w-full md:max-w-7xl md:mx-auto px-4 py-3 md:py-4 flex items-center justify-between">

          {/* LEFT — Brand */}
          <Logo></Logo>

          {/* CENTER — Desktop Search */}
          <div className="hidden md:flex flex-1 px-6">
            <DesktopSearchbar />
          </div>

          <div className="hidden md:flex gap-5 items-center">
            <Link to="/cart" className="relative">
              <ShoppingCart size={22} className="hover:text-amber-500" />
              {cart?.items?.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                  {cart.items.length}
                </span>
              )}
            </Link>

            {/* AUTH */}
            {
              isAuthenticated ? (
                <div className="flex gap-2">
                  <DropDownMenu />
                </div>
              ) : (
                <Link to="/user/auth/login" className="hover:text-amber-500">Login</Link>
              )
            }
          </div>

          {/* RIGHT — Mobile Search Only */}
          <div className="flex items-center gap-4 text-gray-700">
            <button
              className="md:hidden"
              onClick={() => setOpenMobileSearch(true)}
            >
              <Search size={22} />
            </button>
          </div>
        </div>
      </nav>

      {/* MOBILE SEARCH OVERLAY */}
      {openMobileSearch && (
        <MobileSearchbar onClose={() => setOpenMobileSearch(false)} />
      )}
    </>
  );
}




const DropDownMenu = () => {

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { userData } = useSelector((store) => store.auth);

  async function handleLogout() {
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/user/logout`, {}, {
        withCredentials: true
      })
      dispatch(clearUser())
      navigate("/")
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center gap-2 hover:text-indigo-600 cursor-pointer">
          <User size={22} />
          <span >{userData?.username || "User"}</span>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 p-2" align="end">

        <DropdownMenuLabel>
          <div className="flex gap-2">
            <User size={22} />
            <span >{userData?.username || "User"}</span>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuGroup>
          <DropdownMenuItem className="p-2" asChild>
            <Link to="/account" className="flex items-center gap-4">
              <User size={16} /> Account
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="p-2" asChild>
            <Link to="/orders" className="flex items-center gap-4">
              <ListOrdered size={16} /> Orders
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="p-2" asChild>
            <Link to="/wishlist" className="flex items-center gap-4">
              <Heart size={16} className="text-red-700" /> Wishlist
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleLogout}
          className="flex items-center gap-4 text-red-500 p-2"
        >
          <LogOut size={16} /> Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default Navbar;





