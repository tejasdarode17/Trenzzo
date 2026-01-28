import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Navigate, useNavigate, } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { ArrowLeft, CheckCircle } from "lucide-react"
import { Separator } from "@/components/ui/separator";
import axios from 'axios'
import { toast } from 'sonner'
import AddAddress from '../Address/AddAddress'
import EditAddress from '../Address/EditAddress'
import { useAddresses } from '@/hooks/shopper/useAddresses'
import { useCheckout } from '@/hooks/shopper/useCheckOut'

const CheckOut = () => {
    const { isAuthenticated } = useSelector((store) => store.auth)
    const { data } = useAddresses()
    const userAddresses = data?.addresses || []
    const [selectedAddress, setSelectedAddress] = useState((userAddresses || []).find((a) => a.isDefault === true) ?? null)
    const [visibleSection, setVisibleSection] = useState(selectedAddress ? "summary" : "address")

    const navigate = useNavigate()

    useEffect(() => {
        const def = userAddresses?.find(a => a?.isDefault);
        if (def) setSelectedAddress(def);
    }, [userAddresses]);


    useEffect(() => {
        if (window.Razorpay) return;
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        script.onerror = () => toast.error("Failed to load Razorpay SDK");
        document.body.appendChild(script);
    }, []);

    async function handlePayment() {
        if (!window.Razorpay) {
            toast.error("Payment system is still loading. Please wait...");
            return;
        }

        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/create-order`, {}, {
                withCredentials: true,
            });
            const data = response.data
            const { amount, order } = data;

            const options = {
                key: import.meta.env.VITE_RAZORPAY_API_KEY_ID,
                amount: amount,
                currency: "INR",
                name: "Trenzzo",
                description: "Payment",
                order_id: order.id,
                handler: async function (response) {
                    await axios.post(`${import.meta.env.VITE_BACKEND_URL}/verify-payment`,
                        {
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_signature: response.razorpay_signature,
                            address: selectedAddress
                        },
                        { withCredentials: true }
                    );

                    toast.success("Payment success ✅");
                    navigate("/")
                },
                theme: { color: "#3399cc" },
            };

            const razor = new window.Razorpay(options);
            razor.open();
        } catch (error) {
            console.log(error);
            toast.error("Payment Failed due to Server Error")
        }
    }

    if (!isAuthenticated) { return <Navigate to="/user/auth/login" replace /> }

    return (
        <div className="min-h-screen w-full px-3 sm:px-4 py-4 sm:py-8 bg-gray-50">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6 sm:mb-8 max-w-6xl mx-auto">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(-1)}
                    className="p-2 sm:p-2"
                >
                    <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="hidden sm:inline ml-2">Back</span>
                </Button>

                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                        Checkout
                    </h1>
                    <p className="text-gray-600 text-xs sm:text-sm">
                        Complete your purchase securely
                    </p>
                </div>
            </div>

            {/* Main Sections */}
            <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-4 lg:gap-6">
                {/* LEFT SECTION */}
                <div className="flex flex-col gap-4 flex-1 w-full">
                    <CheckoutAddressSection
                        visibleSection={visibleSection}
                        setVisibleSection={setVisibleSection}
                        selectedAddress={selectedAddress}
                        setSelectedAddress={setSelectedAddress}
                    />

                    <CheckoutSummarySection
                        visibleSection={visibleSection}
                        setVisibleSection={setVisibleSection}
                        handlePayment={handlePayment}
                    />
                </div>

                {/* RIGHT SECTION - Order Summary */}
                <div className="w-full lg:w-[380px]">
                    <RightOrderSummaryInCheckout
                        handlePayment={handlePayment}
                        selectedAddress={selectedAddress}
                        userAddresses={userAddresses}
                    />
                </div>
            </div>
        </div>
    )
}

const CheckoutAddressSection = ({ visibleSection, setVisibleSection, selectedAddress, setSelectedAddress }) => {
    const [addressFormVisible, setAddressFormVisible] = useState(false);
    const [editAddressFormVisible, setEditAddressFormVisible] = useState(false)

    const { data } = useAddresses()
    const userAddresses = data?.addresses || []
    const hasAddresses = userAddresses?.length > 0;

    return (
        <div className={`bg-white rounded-lg shadow-sm border ${!hasAddresses || !selectedAddress ? "border-red-400" : "border-gray-200"} w-full`}>
            {/* Header */}
            <div className="flex justify-between items-center px-4 sm:px-6 py-3 sm:py-4 bg-amber-500 text-white rounded-t-lg">
                <p className="font-semibold text-sm sm:text-base">1. DELIVERY ADDRESS</p>
                {visibleSection !== "address" && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setVisibleSection("address")}
                        className="border-white text-amber-500 hover:bg-white hover:text-amber-600 text-xs sm:text-sm h-8 sm:h-9 px-2 sm:px-3"
                    >
                        Change
                    </Button>
                )}
            </div>

            {/* Content */}
            {visibleSection === "address" ? (
                <div className="p-4 sm:p-6 space-y-4">
                    {!hasAddresses ? (
                        addressFormVisible ? null :
                            <div className="border border-red-300 bg-red-50 p-3 sm:p-4 rounded-md text-center">
                                <p className="text-red-700 font-medium mb-2 text-sm sm:text-base">
                                    🚨 No address found! Please add a delivery address to continue.
                                </p>
                                <Button
                                    onClick={() => setAddressFormVisible(true)}
                                    className="bg-amber-500 hover:bg-amber-600 text-white text-sm sm:text-base"
                                    size="sm"
                                >
                                    Add New Address
                                </Button>
                            </div>
                    ) : (
                        <>
                            {(userAddresses || [])?.map((a, index) => (
                                <div
                                    key={index}
                                    className={`flex items-start justify-between border rounded-md p-3 cursor-pointer transition ${selectedAddress?._id === a._id
                                        ? "border-amber-500 bg-amber-50"
                                        : "border-gray-200 hover:bg-gray-50"
                                        }`}
                                    onClick={() => { setSelectedAddress(a), setEditAddressFormVisible(false), setAddressFormVisible(false) }}
                                >
                                    <div className='flex gap-2 flex-1 min-w-0'>
                                        {selectedAddress?._id === a._id && (
                                            <CheckCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-gray-900 text-sm sm:text-base truncate">{a?.name}</p>
                                            <p className="text-xs sm:text-sm text-gray-600 leading-tight break-words">
                                                {a?.address}, {a?.locality}, {a?.city}, {a?.state} - {a?.pinCode}
                                            </p>
                                            <p className="text-xs sm:text-sm text-gray-600">{a?.phoneNumber}</p>
                                        </div>
                                    </div>
                                    <div className="flex-shrink-0 ml-2">
                                        {selectedAddress?._id == a?._id && (
                                            <Button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setEditAddressFormVisible(true);
                                                    setSelectedAddress(a)
                                                }}
                                                variant="outline"
                                                size="sm"
                                                className="border-white text-amber-500 hover:bg-white hover:text-amber-600 text-xs"
                                            >
                                                Edit
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ))}

                            {
                                addressFormVisible || editAddressFormVisible ? null :
                                    <div className="flex flex-col sm:flex-row gap-3 pt-3">
                                        {selectedAddress && (
                                            <Button
                                                onClick={() => setVisibleSection("summary")}
                                                className="bg-amber-500 hover:bg-amber-600 text-white font-semibold text-sm sm:text-base"
                                                size="sm"
                                            >
                                                Deliver Here
                                            </Button>
                                        )}
                                        <Button
                                            onClick={() => setAddressFormVisible(true)}
                                            variant="outline"
                                            size="sm"
                                            className="text-sm sm:text-base"
                                        >
                                            Add New Address
                                        </Button>
                                    </div>
                            }
                        </>
                    )}

                    {addressFormVisible && (
                        <AddAddress open={addressFormVisible} setOpen={setAddressFormVisible} />
                    )}
                    {editAddressFormVisible && (
                        <EditAddress
                            open={editAddressFormVisible}
                            setOpen={setEditAddressFormVisible}
                            address={selectedAddress}
                        />
                    )}
                </div>
            ) : (
                <div className="px-4 sm:px-6 py-3 sm:py-4">
                    {selectedAddress ? (
                        <p className="text-gray-700 text-sm sm:text-base break-words">
                            Deliver to: <strong>{selectedAddress?.name}</strong>,{" "}
                            {selectedAddress?.address}, {selectedAddress?.city}
                        </p>
                    ) : (
                        <div className="border border-red-300 bg-red-50 p-3 sm:p-4 rounded-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                            <p className="text-red-700 font-medium text-sm sm:text-base">
                                ⚠️ Please add a delivery address before proceeding.
                            </p>
                            <Button
                                onClick={() => {
                                    setVisibleSection("address");
                                    setAddressFormVisible(true)
                                }}
                                variant="outline"
                                size="sm"
                                className="text-red-700 border-red-300 hover:bg-red-100 text-xs sm:text-sm"
                            >
                                Add Address
                            </Button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

const CheckoutSummarySection = ({ visibleSection, setVisibleSection, handlePayment }) => {
    const { data: checkOut } = useCheckout()
    const { data } = useAddresses()
    const userAddresses = data?.addresses || []

    return (
        <div className="bg-white rounded-lg border shadow-sm w-full">
            <div className="flex justify-between items-center px-4 sm:px-6 py-3 sm:py-4 bg-amber-500 text-white rounded-t-lg">
                <p className="font-semibold text-sm sm:text-base">2. ORDER SUMMARY</p>
                {visibleSection !== "summary" && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setVisibleSection("summary")}
                        className="border-white text-amber-500 hover:bg-white hover:text-amber-600 text-xs sm:text-sm h-8 sm:h-9 px-2 sm:px-3"
                    >
                        Change
                    </Button>
                )}
            </div>

            {visibleSection === "summary" && (
                <div className="p-4 sm:p-6 space-y-4">
                    {
                        checkOut?.items?.map((item) => (
                            <div
                                key={item?.product._id}
                                className="flex gap-3 sm:gap-4 border-b border-gray-100 pb-3"
                            >
                                <img
                                    src={item?.product?.images?.[0]?.url}
                                    alt={item?.product?.name}
                                    className="w-14 h-14 sm:w-16 sm:h-16 object-contain flex-shrink-0"
                                />
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-gray-900 text-xs sm:text-sm line-clamp-2 break-words">
                                        {item?.product?.brand} {item?.product?.name}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {item?.product?.attributes?.storage} • {item?.attributes?.colour} {item?.attributes?.quantity}
                                    </p>
                                    <div className="flex items-center justify-between mt-2">
                                        <p className="font-semibold text-sm sm:text-base">
                                            ₹{item?.lockedPrice?.toLocaleString("en-IN")} x {item.quantity}
                                        </p>
                                        <p className="font-semibold text-sm sm:text-base">
                                            ₹{(item?.lockedPrice * item.quantity)?.toLocaleString("en-IN")}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))
                    }

                    <Button
                        disabled={!userAddresses?.length}
                        onClick={handlePayment}
                        className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold text-sm sm:text-base py-2.5"
                        size="lg"
                    >
                        Continue to Payment
                    </Button>
                </div>
            )}
        </div>
    )
}

const RightOrderSummaryInCheckout = ({ handlePayment, selectedAddress, userAddresses }) => {
    const { data: checkOut } = useCheckout()
    return (
        <div className="bg-white rounded-lg border shadow-md w-full">
            {/* Card Header */}
            <div className="bg-amber-500 text-white rounded-t-lg px-4 sm:px-6 py-3 sm:py-4">
                <h3 className="text-lg font-semibold">PRICE DETAILS</h3>
            </div>

            {/* Card Content */}
            <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                {/* Items total */}
                <div className="flex justify-between text-gray-700 text-sm sm:text-base">
                    <p>Price ({checkOut?.items?.length || 1} items)</p>
                    <p>₹{checkOut?.itemTotal?.toLocaleString("en-IN")}</p>
                </div>

                {/* Platform Fees */}
                <div className="flex justify-between text-gray-700 text-sm sm:text-base">
                    <p>Platform Fees</p>
                    <p>₹{checkOut?.platformFees?.toLocaleString("en-IN")}</p>
                </div>

                <Separator className="my-3 sm:my-4" />

                {/* Total */}
                <div className="flex justify-between text-base sm:text-lg font-semibold text-gray-900">
                    <p>Total Amount</p>
                    <p>₹{checkOut?.finalPayable?.toLocaleString("en-IN")}</p>
                </div>

                {/* Delivery Info */}
                {selectedAddress && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                        <p className="text-sm text-gray-600 mb-1">Delivering to:</p>
                        <p className="text-sm font-medium text-gray-900 truncate">
                            {selectedAddress?.name}, {selectedAddress?.city}
                        </p>
                    </div>
                )}

                <Separator className="my-3 sm:my-4" />

                {/* Button */}
                <Button
                    disabled={!userAddresses?.length}
                    onClick={handlePayment}
                    className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2.5 text-sm sm:text-base"
                    size="lg"
                >
                    {!userAddresses?.length ? "ADD ADDRESS FIRST" : "PLACE ORDER"}
                </Button>

                {!userAddresses?.length && (
                    <p className="text-xs text-red-500 text-center mt-2">
                        Please add a delivery address to continue
                    </p>
                )}
            </div>
        </div>
    );
};

export default CheckOut