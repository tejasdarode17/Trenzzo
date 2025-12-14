import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { useEffect } from "react"
import { useDispatch } from "react-redux"
import AuthLayout from "./Layouts/AuthLayout"
import AdminLayout from "./Layouts/AdminLayout"
import ShopersLayout from "./Layouts/ShopersLayout"
import Login from "./Main Components/Shopers/User Auth/UserLogin"
import Register from "./Main Components/Shopers/User Auth/UserRegister"
import Home from "./Main Components/Shopers/Home"
import SellerAuthLayout from "./Layouts/SellerAuthLayout"
import SellerRegister from "./Main Components/Seller/Seller Auth/SellerRegister"
import SellerLogin from "./Main Components/Seller/Seller Auth/SellerLogin"
import SellerDashboard from "./Main Components/Seller/Seller Dashboard/SellerDashboard"
import SellerLayout from "./Layouts/SellerLayout"
import ProtectedRoutes from "./Main Components/Other/ProtectedRoutes"
import { checkAuth } from "./Redux/authSlice"
import ErrorPage from "./Main Components/Other/ErrorPage"
import { AddNewProduct } from "./Main Components/Seller/Seller Products/AddNewProduct"
import EditProduct from "./Main Components/Seller/Seller Products/EditProduct"
import SellerProducts from "./Main Components/Seller/Seller Products/SellerProducts"
import SellerSingleProduct from "./Main Components/Seller/Seller Products/SellerSingleProduct"
import AdminDashboard from "./Main Components/Admin/Admin Dashboard/AdminDashboard"
import AdminCategory from "./Main Components/Admin/Admin Categories/AdminCategory"
import AdminSellers from "./Main Components/Admin/Manage Sellers/AdminSeller"
import SelectedSeller from "./Main Components/Admin/Manage Sellers/SelectedSeller"
import AdminBanners from "./Main Components/Admin/Banners/AdminBanners"
import ProductsLayout from "./Main Components/Shopers/Products/ProductsLayout"
import ProductDetails from "./Main Components/Shopers/Products/ProductDetails"
import AddCategory from "./Main Components/Admin/Admin Categories/AddCategory"
import EditCategory from "./Main Components/Admin/Admin Categories/EditCategory"
import Cart from "./Main Components/Shopers/Cart/Cart"
import CheckOut from "./Main Components/Shopers/Cart/CheckOut"
import SellerOrders from "./Main Components/Seller/Seller Orders/SellerOrders"
import Orders from "./Main Components/Shopers/User Orders/Orders"
import SellerOrderDetails from "./Main Components/Seller/Seller Orders/SellerOrderDetails"
import OrderDetails from "./Main Components/Shopers/User Orders/OrderDetails"
import AdminOrders from "./Main Components/Admin/Admin Orders/AdminOrders"
import DeliveryAuthLayout from "./Layouts/DeliveryAuthLayout"
import DeliveryLogin from "./Main Components/DeliveryPartner/Delivery Auth/DeliveryLogin"
import DeliveryRegistration from "./Main Components/DeliveryPartner/Delivery Auth/DeliveryRegistration"
import DeliveryLayout from "./Layouts/DeliveryLayout"
import DeliveryDashboard from "./Main Components/DeliveryPartner/DeliveryDashboard"
import OngoingDeliveryOrders from "./Main Components/DeliveryPartner/OngoingDeliveryOrders"
import DeliveryAllOrders from "./Main Components/DeliveryPartner/DeliveryAllOrders"
import SellerReturnRequests from "./Main Components/Seller/Seller Orders/SellerReturnRequests"
import DeliveryReturnOrders from "./Main Components/DeliveryPartner/DeliveryReturnOrders"
import UserProfile from "./Main Components/Shopers/User Profile/UserProfileLayout"
import UserProfileLayout from "./Main Components/Shopers/User Profile/UserProfileLayout"
import UserProfilePersonalInformation from "./Main Components/Shopers/User Profile/UserProfilePersonalInformation"
import UserAddress from "./Main Components/Shopers/User Profile/UserAddress"
import AccountSettings from "./Main Components/Shopers/User Profile/AccountSetting"
import SellerAccount from "./Main Components/Seller/Seller Profile/SellerAccount"


const appRouter = createBrowserRouter([
  {
    path: "/user/auth",
    element: (
      <ProtectedRoutes>
        <AuthLayout></AuthLayout>
      </ProtectedRoutes>
    ),
    children: [
      {
        path: "login",
        element: <Login></Login>
      },
      {
        path: "register",
        element: <Register></Register>
      }
    ]
  },

  {
    path: "/seller/auth",
    element: (
      <ProtectedRoutes>
        <SellerAuthLayout></SellerAuthLayout>
      </ProtectedRoutes>
    ),
    children: [
      {
        path: "register",
        element: <SellerRegister></SellerRegister>
      },
      {
        path: "login",
        element: <SellerLogin></SellerLogin>
      }
    ]
  },

  {
    path: "/delivery/auth",
    element: (
      <ProtectedRoutes>
        <DeliveryAuthLayout></DeliveryAuthLayout>
      </ProtectedRoutes>
    ),
    children: [
      {
        path: "register",
        element: <DeliveryRegistration></DeliveryRegistration>
      },
      {
        path: "login",
        element: <DeliveryLogin></DeliveryLogin>
      }
    ]
  },

  {
    path: "/",
    element: (
      <ProtectedRoutes>
        <ShopersLayout></ShopersLayout>
      </ProtectedRoutes>
    ),
    children: [
      {
        index: true,
        element: <Home></Home>
      },
      {
        path: "/products",
        element: <ProductsLayout></ProductsLayout>
      },
      {
        path: "/product/:slug",
        element: <ProductDetails></ProductDetails>
      },
      {
        path: "/cart",
        element: <Cart></Cart>
      },
      {
        path: "/checkout",
        element: <CheckOut></CheckOut>
      },
      {
        path: "/orders",
        element: <Orders></Orders>
      },
      {
        path: "/order/:id",
        element: <OrderDetails></OrderDetails>
      },
      {
        path: "/account",
        element: <UserProfileLayout></UserProfileLayout>,
        children: [
          {
            index: true,
            element: <UserProfilePersonalInformation></UserProfilePersonalInformation>
          },
          {
            path: "/account/address",
            element: <UserAddress></UserAddress>
          },
          {
            path: "/account/settings",
            element: <AccountSettings></AccountSettings>
          },
        ]
      },
    ]
  },

  {
    path: "/seller",
    element: (
      <ProtectedRoutes>
        <SellerLayout></SellerLayout>
      </ProtectedRoutes>
    ),
    children: [
      {
        index: true,
        element: <SellerDashboard></SellerDashboard>
      },
      {
        path: "products",
        element: <SellerProducts></SellerProducts>
      },
      {
        path: "add-product",
        element: <AddNewProduct></AddNewProduct>
      },
      {
        path: "edit-product/:slug",
        element: <EditProduct></EditProduct>
      },
      {
        path: "product/:slug",
        element: <SellerSingleProduct></SellerSingleProduct>
      },
      {
        path: "orders",
        element: <SellerOrders></SellerOrders>
      },
      {
        path: "returns",
        element: <SellerReturnRequests></SellerReturnRequests>
      },
      {
        path: "order/:id",
        element: <SellerOrderDetails></SellerOrderDetails>
      },
      {
        path: "settings",
        element: <SellerAccount></SellerAccount>
      }
    ]
  },

  {
    path: "/admin",
    element: (
      <ProtectedRoutes>
        <AdminLayout></AdminLayout>
      </ProtectedRoutes>
    ),
    children: [
      {
        index: true,
        element: <AdminDashboard></AdminDashboard>
      },
      {
        path: "category",
        element: <AdminCategory></AdminCategory>
      },
      {
        path: "add-category",
        element: <AddCategory></AddCategory>
      },
      {
        path: "edit-category/:id",
        element: < EditCategory ></EditCategory >
      },
      {
        path: "sellers",
        element: <AdminSellers></AdminSellers>
      },
      {
        path: "seller/:id",
        element: <SelectedSeller></SelectedSeller>
      },
      {
        path: "banners",
        element: <AdminBanners></AdminBanners>
      },
      {
        path: "reports",
        element: <AdminOrders></AdminOrders>
      }
    ]
  },

  {
    path: "/delivery",
    element: (
      <ProtectedRoutes>
        <DeliveryLayout></DeliveryLayout>
      </ProtectedRoutes>
    ),
    children: [
      {
        index: true,
        element: <DeliveryDashboard></DeliveryDashboard>
      },
      {
        path: "ongoing-orders",
        element: <OngoingDeliveryOrders></OngoingDeliveryOrders>
      },
      {
        path: "return-orders",
        element: <DeliveryReturnOrders></DeliveryReturnOrders>
      },
      {
        path: "all-orders",
        element: <DeliveryAllOrders></DeliveryAllOrders>
      }
    ]
  },
  {
    path: "*",
    element: <ErrorPage />
  }
])


function App() {

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(checkAuth());
  }, []);

  return (
    <>
      <RouterProvider router={appRouter}></RouterProvider>
    </>
  )
}

export default App


//uske bad notifications websocketets banana hai
// uske bad AI
//CANCEL order ki button banegi jab order shipped nahi hua hoga tab visible hogi
//one star wale review product admin dekhega
