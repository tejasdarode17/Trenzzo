import React from 'react'
import UserProfileNavbar from './UserProfileNavbar'
import { Outlet } from 'react-router-dom'

const UserProfileLayout = () => {
    return (
        <div className="py-8">
            <div className="max-w-6xl mx-auto px-4" >
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">My Account</h1>
                </div>

                <div className="flex gap-6">
                    <div className="max-w-70">
                        <UserProfileNavbar />
                    </div>

                    <div className="flex-1">
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserProfileLayout




