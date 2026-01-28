import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MapPin, CheckCircle, Plus, Edit } from 'lucide-react'
import { useState } from 'react'
import EditAddress from '../Address/EditAddress'
import AddAddress from '../Address/AddAddress'
import { useAddresses } from '@/hooks/shopper/useAddresses'


const UserAddress = () => {

    const { data } = useAddresses()
    const userAddresses = data?.addresses || []

    const [addressFormVisible, setAddressFormVisible] = useState(false)
    const [editAddressFormVisible, setEditAddressFormVisible] = useState(false)
    const [selectedAddress, setSelectedAddress] = useState(userAddresses?.find((a) => a?.isDefault === true) || null)
    

    return (
        <Card className="border-gray-200 shadow-sm">
            <CardHeader className="pb-4">
                <div className="flex justify-between items-center">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-amber-500" />
                        Manage Addresses
                    </CardTitle>
                    {!addressFormVisible && (
                        <Button
                            variant="outline"
                            onClick={() => setAddressFormVisible(true)}
                            className="border-gray-300 hover:bg-gray-50"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Address
                        </Button>
                    )}
                </div>
            </CardHeader>

            <CardContent>
                {addressFormVisible && (
                    <div className="mb-6">
                        <AddAddress open={addressFormVisible} setOpen={setAddressFormVisible} />
                    </div>
                )}

                <div className="space-y-4">
                    {userAddresses?.map((a, index) => (
                        <div
                            key={index}
                            className={`border rounded-lg p-5 cursor-pointer transition-all duration-200 ${selectedAddress?._id === a?._id
                                ? "border-amber-500 bg-amber-50 shadow-sm"
                                : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                                }`}
                            onClick={() => {
                                setSelectedAddress(a)
                                setEditAddressFormVisible(false)
                                setAddressFormVisible(false)
                            }}
                        >
                            <div className="flex justify-between items-start">
                                <div className="flex gap-4">
                                    <div className="flex-shrink-0">
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${selectedAddress?._id === a._id
                                            ? "bg-amber-100"
                                            : "bg-gray-100"
                                            }`}>
                                            {selectedAddress?._id === a?._id ? (
                                                <CheckCircle className="w-6 h-6 text-amber-500" />
                                            ) : (
                                                <MapPin className="w-6 h-6 text-gray-500" />
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <p className="font-semibold text-gray-900">{a?.name}</p>
                                            {a?.isDefault && (
                                                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                                                    Default
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-600 leading-relaxed">
                                            {a?.address}, {a?.locality}, {a?.city}, {a?.state} - {a?.pinCode}
                                        </p>
                                        <p className="text-sm text-gray-600 mt-2 flex items-center gap-2">
                                            <span className="font-medium">Phone:</span> {a?.phoneNumber}
                                        </p>
                                    </div>
                                </div>

                                {selectedAddress?._id === a._id && (
                                    <Button
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            setEditAddressFormVisible(true)
                                            setSelectedAddress(a)
                                        }}
                                        variant="outline"
                                        size="sm"
                                        className="border-gray-300 hover:bg-gray-100"
                                    >
                                        <Edit className="w-4 h-4 mr-2" />
                                        Edit
                                    </Button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {editAddressFormVisible && (
                    <div className="mt-6">
                        <EditAddress
                            open={editAddressFormVisible}
                            setOpen={setEditAddressFormVisible}
                            address={selectedAddress}
                        />
                    </div>
                )}

                {userAddresses?.length === 0 && !addressFormVisible && (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <MapPin className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No addresses saved</h3>
                        <p className="text-gray-600 mb-6">Add your first address to get started</p>
                        <Button
                            onClick={() => setAddressFormVisible(true)}
                            className="bg-amber-500 hover:bg-amber-600 text-white"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Address
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

export default UserAddress