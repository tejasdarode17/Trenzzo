import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, useLocation } from 'react-router-dom'

const ProtectedRoutes = ({ children }) => {

    const { isAuthenticated, userData } = useSelector((store) => store.auth);

    const { role } = userData || {};

    const location = useLocation()
    const path = location.pathname

    //if not login and try to acces the main pages
    if (!isAuthenticated) {
        if (path.startsWith("/seller") && !path.startsWith("/seller/auth")) {
            return <Navigate to="/seller/auth/login" replace />;
        }
        if (path.startsWith("/delivery") && !path.startsWith("/delivery/auth")) {
            return <Navigate to="/delivery/auth/login" replace />;
        }
        if (path.startsWith("/admin")) {
            return <Navigate to="/" replace />;
        }
    }

    // if seller is login and try to access the any auth or other user pages pages again
    if (role === "seller") {
        if (path.startsWith("/seller/auth") || path.startsWith("/user/auth") || path.startsWith("/delivery/auth") || path.startsWith("/admin") || path === "/" || path.startsWith("/auth-required")) {
            return <Navigate to="/seller" replace />;
        }
    }

    // if deliveryPartner is login and try to access the auth pages again
    if (role === "deliveryPartner") {
        if (path.startsWith("/delivery/auth") || path.startsWith("/user/auth") || path.startsWith("/seller/auth") || path.startsWith("/seller") || path.startsWith("/admin") || path === "/" || path.startsWith("/auth-required") ) {
            return <Navigate to="/delivery" replace />;
        }
    }


    if (role === "user") {
        if (path.startsWith("/seller") || path.startsWith("/user/auth") || path.startsWith("/delivery/auth") || path.startsWith("/admin") || path.startsWith("/delivery") || path.startsWith("/auth-required")) {
            return <Navigate to="/" replace />;
        }
    }

    if (role === "admin") {
        if (path === "/") return <Navigate to="/admin" replace />;
        if (path.startsWith("/seller") || path.startsWith("/user/auth") || path.startsWith("/auth-required") || path.startsWith("/delivery/auth") || path.startsWith("/seller/auth")) {
            return <Navigate to="/admin" replace />;
        }
    }

    return (
        <>
            {children}
        </>
    )
}

export default ProtectedRoutes


