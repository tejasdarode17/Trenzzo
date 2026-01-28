import DeliveryPartnerSidebar from '@/ui/DeliveryPartner/DeliverySidebar'
import { fetchAllDeliveryOrders, fetchOngoingDeliveryOrders, fetchReturnOrders } from '@/redux/deliverySlice'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Outlet } from 'react-router-dom'

const DeliveryLayout = () => {

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(fetchOngoingDeliveryOrders())
        dispatch(fetchAllDeliveryOrders())
        dispatch(fetchReturnOrders())
    }, [])


    return (
        <div className="flex min-h-screen w-full">
            <div className="">
                <DeliveryPartnerSidebar></DeliveryPartnerSidebar>
            </div>
            <div className="flex-1 p-4 lg:p-10 overflow-x-hidden">
                <Outlet />
            </div>
        </div>
    )
}

export default DeliveryLayout