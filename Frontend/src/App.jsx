import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { Suspense, lazy, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { checkAuth } from "./redux/authSlice"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import VerifyOtp from "./ui/Others/VerifyOtp"
import ProtectedRoutes from "./ui/Others/ProtectedRoutes"
import MainLoader from "./ui/Others/MainLoader"


//ALl layouts   
const AuthLayout = lazy(() => import("./ui/Layouts/AuthLayout"))
const ShopersLayout = lazy(() => import("./ui/Layouts/ShopersLayout"))
const SellerAuthLayout = lazy(() => import("./ui/Layouts/SellerAuthLayout"))
const SellerLayout = lazy(() => import("./ui/Layouts/SellerLayout"))
const AdminLayout = lazy(() => import("./ui/Layouts/AdminLayout"))
const DeliveryAuthLayout = lazy(() => import("./ui/Layouts/DeliveryAuthLayout"))
const DeliveryLayout = lazy(() => import("./ui/Layouts/DeliveryLayout"))

//  Shopper Pages
const Login = lazy(() => import("./ui/Shopers/UserAuth/UserLogin"))
const Register = lazy(() => import("./ui/Shopers/UserAuth/UserRegister"))
const Home = lazy(() => import("./ui/Shopers/Home"))
const ProductsLayout = lazy(() => import("./ui/Shopers/Products/ProductsLayout"))
const ProductDetails = lazy(() => import("./ui/Shopers/Products/ProductDetails"))
const Cart = lazy(() => import("./ui/Shopers/Cart/Cart"))
const CheckOut = lazy(() => import("./ui/Shopers/Cart/CheckOut"))
const Orders = lazy(() => import("./ui/Shopers/UserOrders/Orders"))
const OrderDetails = lazy(() => import("./ui/Shopers/UserOrders/OrderDetails"))
const Wishlist = lazy(() => import("./ui/Shopers/Wishlist/Wishlist"))

//  User Profile
const UserProfileLayout = lazy(() => import("./ui/Shopers/UserProfile/UserProfileLayout"))
const UserProfilePersonalInformation = lazy(() => import("./ui/Shopers/UserProfile/UserProfilePersonalInformation"))
const UserAddress = lazy(() => import("./ui/Shopers/UserProfile/UserAddress"))
const AccountSettings = lazy(() => import("./ui/Shopers/UserProfile/AccountSetting"))

//  Seller Pages
const SellerRegister = lazy(() => import("./ui/Seller/SellerAuth/SellerRegister"))
const SellerLogin = lazy(() => import("./ui/Seller/SellerAuth/SellerLogin"))
const SellerDashboard = lazy(() => import("./ui/Seller/SellerDashboard/SellerDashboard"))
const SellerProducts = lazy(() => import("./ui/Seller/SellerProducts/SellerProducts"))
const AddNewProduct = lazy(() => import("./ui/Seller/SellerProducts/AddNewProduct"))
const EditProduct = lazy(() => import("./ui/Seller/SellerProducts/EditProduct"))
const SellerProductDetails = lazy(() => import("./ui/Seller/SellerProducts/SellerProductDetails"))
const SellerOrders = lazy(() => import("./ui/Seller/SellerOrders/SellerOrders"))
const SellerOrderDetails = lazy(() => import("./ui/Seller/SellerOrders/SellerOrderDetails"))
const SellerReturnRequests = lazy(() => import("./ui/Seller/SellerOrders/SellerReturnRequests"))
const SellerAccount = lazy(() => import("./ui/Seller/SellerProfile/SellerAccount"))

//  Admin Pages
const AdminDashboard = lazy(() => import("./ui/Admin/AdminDashboard/AdminDashboard"))
const AdminCategory = lazy(() => import("./ui/Admin/AdminCategories/AdminCategory"))
const AddCategory = lazy(() => import("./ui/Admin/AdminCategories/AddCategory"))
const EditCategory = lazy(() => import("./ui/Admin/AdminCategories/EditCategory"))
const AdminSellers = lazy(() => import("./ui/Admin/ManageSellers/AdminSeller"))
const SelectedSeller = lazy(() => import("./ui/Admin/ManageSellers/SelectedSeller"))
const AdminBanners = lazy(() => import("./ui/Admin/Banners/AdminBanners"))
const AdminOrders = lazy(() => import("./ui/Admin/AdminOrders/AdminOrders"))

//  Delivery Pages
const DeliveryLogin = lazy(() => import("./ui/DeliveryPartner/DeliveryAuth/DeliveryLogin"))
const DeliveryRegistration = lazy(() => import("./ui/DeliveryPartner/DeliveryAuth/DeliveryRegistration"))
const DeliveryDashboard = lazy(() => import("./ui/DeliveryPartner/DeliveryDashboard"))
const OngoingDeliveryOrders = lazy(() => import("./ui/DeliveryPartner/OngoingDeliveryOrders"))
const DeliveryReturnOrders = lazy(() => import("./ui/DeliveryPartner/DeliveryReturnOrders"))
const DeliveryAllOrders = lazy(() => import("./ui/DeliveryPartner/DeliveryAllOrders"))

const ErrorPage = lazy(() => import("./ui/Others/ErrorPage"))


const appRouter = createBrowserRouter([
  {
    path: "/user/auth",
    element: (
      <ProtectedRoutes>
        <AuthLayout />
      </ProtectedRoutes>
    ),
    children: [
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "verify-otp", element: <VerifyOtp /> }
    ],
  },

  {
    path: "/seller/auth",
    element: (
      <ProtectedRoutes>
        <SellerAuthLayout />
      </ProtectedRoutes>
    ),
    children: [
      { path: "login", element: <SellerLogin /> },
      { path: "register", element: <SellerRegister /> },
      { path: "verify-otp", element: <VerifyOtp /> }

    ],
  },

  {
    path: "/delivery/auth",
    element: (
      <ProtectedRoutes>
        <DeliveryAuthLayout />
      </ProtectedRoutes>
    ),
    children: [
      { path: "login", element: <DeliveryLogin /> },
      { path: "register", element: <DeliveryRegistration /> },
      { path: "verify-otp", element: <VerifyOtp /> }
    ],
  },

  {
    path: "/",
    element: (
      <ProtectedRoutes>
        <ShopersLayout />
      </ProtectedRoutes>
    ),
    children: [
      { index: true, element: <Home /> },
      { path: "products", element: <ProductsLayout /> },
      { path: "product/:slug", element: <ProductDetails /> },
      { path: "cart", element: <Cart /> },
      { path: "checkout", element: <CheckOut /> },
      { path: "orders", element: <Orders /> },
      { path: "order/:id", element: <OrderDetails /> },
      { path: "wishlist", element: <Wishlist /> },

      {
        path: "account",
        element: <UserProfileLayout />,
        children: [
          { index: true, element: <UserProfilePersonalInformation /> },
          { path: "address", element: <UserAddress /> },
          { path: "settings", element: <AccountSettings /> },
        ],
      },
    ],
  },

  {
    path: "/seller",
    element: (
      <ProtectedRoutes>
        <SellerLayout />
      </ProtectedRoutes>
    ),
    children: [
      { index: true, element: <SellerDashboard /> },
      { path: "products", element: <SellerProducts /> },
      { path: "add-product", element: <AddNewProduct /> },
      { path: "edit-product/:slug", element: <EditProduct /> },
      { path: "product/:slug", element: <SellerProductDetails /> },
      { path: "orders", element: <SellerOrders /> },
      { path: "order/:id", element: <SellerOrderDetails /> },
      { path: "returns", element: <SellerReturnRequests /> },
      { path: "settings", element: <SellerAccount /> },
    ],
  },

  {
    path: "/admin",
    element: (
      <ProtectedRoutes>
        <AdminLayout />
      </ProtectedRoutes>
    ),
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: "category", element: <AdminCategory /> },
      { path: "add-category", element: <AddCategory /> },
      { path: "edit-category/:id", element: <EditCategory /> },
      { path: "sellers", element: <AdminSellers /> },
      { path: "seller/:id", element: <SelectedSeller /> },
      { path: "banners", element: <AdminBanners /> },
      { path: "reports", element: <AdminOrders /> },
    ],
  },

  {
    path: "/delivery",
    element: (
      <ProtectedRoutes>
        <DeliveryLayout />
      </ProtectedRoutes>
    ),
    children: [
      { index: true, element: <DeliveryDashboard /> },
      { path: "ongoing-orders", element: <OngoingDeliveryOrders /> },
      { path: "return-orders", element: <DeliveryReturnOrders /> },
      { path: "all-orders", element: <DeliveryAllOrders /> },
    ],
  },

  { path: "*", element: <ErrorPage /> },
])


const queryClient = new QueryClient()

function App() {

  const { isAuthenticated } = useSelector((store) => store.auth)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(checkAuth())
  }, [dispatch, isAuthenticated])

  return (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<MainLoader></MainLoader>}>
        <RouterProvider router={appRouter} />
      </Suspense>
    </QueryClientProvider>
  )
}

export default App


