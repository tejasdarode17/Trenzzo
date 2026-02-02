import SellerSidebar from '@/ui/Seller/SellerNavigations/SellerSideBar'
import { addSellerNotification, addSellerReturnNotification, } from '@/redux/sellerSlice'
import { connectSocket } from '@/utils/socket'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Outlet } from 'react-router-dom'


const SellerLayout = () => {

    const { isAuthenticated, userData } = useSelector((store) => store.auth);
    const dispatch = useDispatch();
    const { role } = userData

    useEffect(() => {
        if (!isAuthenticated || role !== "seller" || !userData?._id) return;

        const socket = connectSocket({ userId: userData._id, role: "seller", })

        socket.on("new-order", (order) => {
            dispatch(addSellerNotification({
                type: "NEW_ORDER",
                order,
                read: false,
            }))
        })

        socket.on("new-return-order", (order) => {
            dispatch(addSellerReturnNotification({
                type: "NEW_RETURN_ORDER",
                order,
                read: false,
            }))
        })

        return () => {
            socket.off("new-order");
            socket.off("new-return-order");
        }

    }, [isAuthenticated, role, userData?._id]);



    return (
        <div className="flex min-h-screen w-full">
            <div >
                <SellerSidebar></SellerSidebar>
            </div>
            <div className="flex-1 pl-6 py-6 lg:p-10 overflow-x-hidden">
                <Outlet></Outlet>
            </div>
        </div>
    )
}

export default SellerLayout
