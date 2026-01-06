import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { Suspense, lazy, useEffect } from "react"
import { useDispatch } from "react-redux"
import ProtectedRoutes from "./Main Components/Other/ProtectedRoutes"
import { checkAuth } from "./Redux/authSlice"
import { Loader2 } from "lucide-react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

//ALl layouts 
const AuthLayout = lazy(() => import("./Layouts/AuthLayout"))
const ShopersLayout = lazy(() => import("./Layouts/ShopersLayout"))
const SellerAuthLayout = lazy(() => import("./Layouts/SellerAuthLayout"))
const SellerLayout = lazy(() => import("./Layouts/SellerLayout"))
const AdminLayout = lazy(() => import("./Layouts/AdminLayout"))
const DeliveryAuthLayout = lazy(() => import("./Layouts/DeliveryAuthLayout"))
const DeliveryLayout = lazy(() => import("./Layouts/DeliveryLayout"))

//  Shopper Pages
const Login = lazy(() => import("./Main Components/Shopers/User Auth/UserLogin"))
const Register = lazy(() => import("./Main Components/Shopers/User Auth/UserRegister"))
const Home = lazy(() => import("./Main Components/Shopers/Home"))
const ProductsLayout = lazy(() => import("./Main Components/Shopers/Products/ProductsLayout"))
const ProductDetails = lazy(() => import("./Main Components/Shopers/Products/ProductDetails"))
const Cart = lazy(() => import("./Main Components/Shopers/Cart/Cart"))
const CheckOut = lazy(() => import("./Main Components/Shopers/Cart/CheckOut"))
const Orders = lazy(() => import("./Main Components/Shopers/User Orders/Orders"))
const OrderDetails = lazy(() => import("./Main Components/Shopers/User Orders/OrderDetails"))
const Wishlist = lazy(() => import("./Main Components/Shopers/Wishlist/Wishlist"))

//  User Profile
const UserProfileLayout = lazy(() => import("./Main Components/Shopers/User Profile/UserProfileLayout"))
const UserProfilePersonalInformation = lazy(() => import("./Main Components/Shopers/User Profile/UserProfilePersonalInformation"))
const UserAddress = lazy(() => import("./Main Components/Shopers/User Profile/UserAddress"))
const AccountSettings = lazy(() => import("./Main Components/Shopers/User Profile/AccountSetting"))

//  Seller Pages
const SellerRegister = lazy(() => import("./Main Components/Seller/Seller Auth/SellerRegister"))
const SellerLogin = lazy(() => import("./Main Components/Seller/Seller Auth/SellerLogin"))
const SellerDashboard = lazy(() => import("./Main Components/Seller/Seller Dashboard/SellerDashboard"))
const SellerProducts = lazy(() => import("./Main Components/Seller/Seller Products/SellerProducts"))
const AddNewProduct = lazy(() => import("./Main Components/Seller/Seller Products/AddNewProduct"))
const EditProduct = lazy(() => import("./Main Components/Seller/Seller Products/EditProduct"))
const SellerSingleProduct = lazy(() => import("./Main Components/Seller/Seller Products/SellerSingleProduct"))
const SellerOrders = lazy(() => import("./Main Components/Seller/Seller Orders/SellerOrders"))
const SellerOrderDetails = lazy(() => import("./Main Components/Seller/Seller Orders/SellerOrderDetails"))
const SellerReturnRequests = lazy(() => import("./Main Components/Seller/Seller Orders/SellerReturnRequests"))
const SellerAccount = lazy(() => import("./Main Components/Seller/Seller Profile/SellerAccount"))

//  Admin Pages
const AdminDashboard = lazy(() => import("./Main Components/Admin/Admin Dashboard/AdminDashboard"))
const AdminCategory = lazy(() => import("./Main Components/Admin/Admin Categories/AdminCategory"))
const AddCategory = lazy(() => import("./Main Components/Admin/Admin Categories/AddCategory"))
const EditCategory = lazy(() => import("./Main Components/Admin/Admin Categories/EditCategory"))
const AdminSellers = lazy(() => import("./Main Components/Admin/Manage Sellers/AdminSeller"))
const SelectedSeller = lazy(() => import("./Main Components/Admin/Manage Sellers/SelectedSeller"))
const AdminBanners = lazy(() => import("./Main Components/Admin/Banners/AdminBanners"))
const AdminOrders = lazy(() => import("./Main Components/Admin/Admin Orders/AdminOrders"))

//  Delivery Pages
const DeliveryLogin = lazy(() => import("./Main Components/DeliveryPartner/Delivery Auth/DeliveryLogin"))
const DeliveryRegistration = lazy(() => import("./Main Components/DeliveryPartner/Delivery Auth/DeliveryRegistration"))
const DeliveryDashboard = lazy(() => import("./Main Components/DeliveryPartner/DeliveryDashboard"))
const OngoingDeliveryOrders = lazy(() => import("./Main Components/DeliveryPartner/OngoingDeliveryOrders"))
const DeliveryReturnOrders = lazy(() => import("./Main Components/DeliveryPartner/DeliveryReturnOrders"))
const DeliveryAllOrders = lazy(() => import("./Main Components/DeliveryPartner/DeliveryAllOrders"))

const ErrorPage = lazy(() => import("./Main Components/Other/ErrorPage"))


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
      { path: "product/:slug", element: <SellerSingleProduct /> },
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

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(checkAuth())
  }, [dispatch])

  return (
    <QueryClientProvider client={queryClient}>
      <Suspense
        fallback={<div className="w-screen h-screen flex justify-center items-center"><Loader2></Loader2></div>}
      >
        <RouterProvider router={appRouter} />
      </Suspense>
    </QueryClientProvider>
  )
}

export default App


