import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { User, MapPin, Package, Settings, LogOut, Shield, ChevronRight } from 'lucide-react'
import React from 'react'

const UserProfileNavbar = () => {
    const { userData } = useSelector((store) => store.auth)
    const location = useLocation()
    const navigate = useNavigate()

    const navItems = [
        {
            id: 'personal',
            label: 'Personal Information',
            icon: <User className="w-5 h-5" />,
            path: '/account'
        },
        {
            id: 'address',
            label: 'Manage Addresses',
            icon: <MapPin className="w-5 h-5" />,
            path: '/account/address'
        },
        {
            id: 'orders',
            label: 'My Orders',
            icon: <Package className="w-5 h-5" />,
            path: '/orders'
        },
        {
            id: 'settings',
            label: 'Account Settings',
            icon: <Settings className="w-5 h-5" />,
            path: '/account/settings'
        }
    ]

    return (
        <Card className="m-0 p-0 border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-amber-50 to-white p-6 border-b border-gray-200">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center border-4 border-white shadow-sm">
                        <User className="w-8 h-8 text-amber-600" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Hello,</p>
                        <h3 className="font-semibold text-gray-900 text-lg">{userData?.username}</h3>
                        <p className="text-sm text-gray-500 mt-1">{userData?.email}</p>
                    </div>
                </div>
            </div>

            {/* Navigation Items */}
            <CardContent className="p-4">
                <div className="space-y-1">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path
                        return (
                            <Button
                                key={item.id}
                                variant="ghost"
                                onClick={() => navigate(item.path)}
                                className={`w-full justify-between p-3 h-auto rounded-lg ${isActive
                                    ? 'bg-amber-50 text-amber-700 hover:bg-amber-100 hover:text-amber-800 border border-amber-200'
                                    : 'hover:bg-gray-50 text-gray-700'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-md ${isActive ? 'bg-amber-100' : 'bg-gray-100'}`}>
                                        {/* {React.cloneElement(item.icon, {
                                            className: isActive ? 'text-amber-600' : 'text-gray-500'
                                        })} */}
                                        {item?.icon}
                                    </div>
                                    <span className="font-medium">{item.label}</span>
                                </div>
                                <ChevronRight className={`w-4 h-4 ${isActive ? 'text-amber-600' : 'text-gray-400'}`} />
                            </Button>
                        )
                    })}
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200">
                    <Button
                        variant="ghost"
                        className="w-full justify-start p-3 h-auto text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => {
                            console.log('Logging out...')
                        }}
                    >
                        <LogOut className="w-5 h-5 mr-3" />
                        Logout
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}

export default UserProfileNavbar