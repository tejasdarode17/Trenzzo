import React from 'react'
import SellersTable from './SellersTable'
import { useSelector } from 'react-redux'

export const PendingSeller = () => {

    const { sellersByStatus } = useSelector((store) => store.admin)
    const pendingSellers = sellersByStatus?.pending?.data

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-800">Sellers</h1>
            </div>

            {/* Sellers Table */}
            <SellersTable sellers={pendingSellers} showActions={true}></SellersTable>
        </div>
    )
}

export default PendingSeller





//this showActions prop is bacically removing the path.includes() check cuz we dont want to show the action buttons in the AdminSeller



