import Footer from "@/Main Components/Shopers/Footer"
import Navbar from "@/Main Components/Shopers/Navigations/Navbar"
import { fetchCartThunk } from "@/Redux/cartSlice"
import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { Outlet, useLocation } from "react-router-dom"

const ShopersLayout = () => {

    const location = useLocation()
    const path = location.pathname
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(fetchCartThunk())
    }, [])


    return (
        <div className="min-h-screen flex flex-col bg-[#F1F3F6]">
            <Navbar />
            <div className="flex-1">
                <Outlet />
            </div>
            {!path.startsWith("/cart") && <Footer />}
        </div>

    )
}

export default ShopersLayout
