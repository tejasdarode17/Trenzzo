import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { CheckCircle } from "lucide-react"
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import AddAddress from '../User Auth/AddAddress'
import EditAddress from '../User Auth/EditAddress'
import axios from 'axios'
import { toast } from 'sonner'
import { clearCart, clearCheckOut } from '@/Redux/cartSlice'


const CheckOut = () => {

    const { isAuthenticated, userAddresses, } = useSelector((store) => store.auth)
    const { chekOut } = useSelector((store) => store.cart)
    const [selectedAddress, setSelectedAddress] = useState((userAddresses || []).find((a) => a.isDefault === true) || null)
    const [visibleSection, setVisibleSection] = useState(selectedAddress ? "summary" : "address")
    const navigate = useNavigate()
    const dispatch = useDispatch()


    useEffect(() => {
        const def = userAddresses?.find(a => a.isDefault);
        if (def) {
            setSelectedAddress(def);
        }
    }, [userAddresses]);

    //this is razorpay thing i dont know about this will learn later deep in payment intigration
    //this is dynamic loader which i earlier wrote as a cdn in index.html 
    useEffect(() => {
        if (window.Razorpay) return;

        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;

        script.onload = () => console.log("Razorpay SDK loaded");
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

                // prefill: {
                //     name: userData?.name || "",
                //     email: user?.email || "",
                //     contact: user?.phone || ""
                // },

                handler: async function (response) {
                    await axios.post(
                        `${import.meta.env.VITE_BACKEND_URL}/verify-payment`,
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
                    dispatch(clearCart())
                    dispatch(clearCheckOut())

                },

                theme: { color: "#3399cc" },
            };

            const razor = new window.Razorpay(options);

            razor.on("payment.failed", function (response) {
                toast.error("Payment failed:" + response.error.description);
                console.error(response.error);
            });

            razor.open();
        } catch (error) {
            console.log(error);
            toast.error("Payment Failed due to Server Error")
        }
    }


    if (!isAuthenticated) { return <Navigate to="/user/auth/login" replace /> }
    if (!chekOut) return <Navigate to="/cart" replace />

    return (
        <div className="min-h-screen max-w-6xl mx-auto px-4 py-8">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Button variant="ghost" size="sm" onClick={() => window.history.back()}>
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back
                </Button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
                    <p className="text-gray-600 text-sm">Complete your purchase securely</p>
                </div>
            </div>

            {/* Main Sections */}
            <div className="flex justify-between items-start gap-6">
                <div className="flex flex-col gap-4 flex-1">
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

                <RightOrderSummaryInCheckout handlePayment={handlePayment} />
            </div>
        </div>
    )
}


const CheckoutAddressSection = ({ visibleSection, setVisibleSection, selectedAddress, setSelectedAddress, }) => {

    const [addressFormVisible, setAddressFormVisible] = useState(false);
    const [editAddressFormVisible, setEditAddressFormVisible] = useState(false)
    const { userAddresses } = useSelector((store) => store.auth)
    const hasAddresses = userAddresses?.length > 0;

    return (
        <div className={`w-[90%] bg-white rounded-md shadow-sm border ${!hasAddresses || !selectedAddress ? "border-red-400" : "border-gray-200"}`}>

            {/* The Section Which is always visible no matter what is visibleSection = "" */}
            <div className="flex justify-between items-center px-5 py-3 bg-amber-500 text-white rounded-t-md">
                <p className="font-semibold">1. DELIVERY ADDRESS</p>
                {visibleSection !== "address" && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setVisibleSection("address")}
                        className="border-white text-amber-500 hover:bg-white hover:text-amber-600"
                    >
                        Change
                    </Button>
                )}
            </div>

            {/* Content */}
            {visibleSection === "address" ? (
                <div className="p-5 space-y-4">
                    {!hasAddresses ? (
                        addressFormVisible ? null :
                            <div className="border border-red-300 bg-red-50 p-4 rounded-md text-center">
                                <p className="text-red-700 font-medium mb-2">
                                    🚨 No address found! Please add a delivery address to continue.
                                </p>
                                <Button
                                    onClick={() => setAddressFormVisible(true)}
                                    className="bg-amber-500 hover:bg-amber-600 text-white"
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
                                    <div className='flex gap-2'>
                                        {selectedAddress?._id === a._id && <CheckCircle className="w-5 h-5 text-amber-500" />}
                                        <div>
                                            <p className="font-medium text-gray-900">{a?.name}</p>
                                            <p className="text-sm text-gray-600 leading-tight">
                                                {a?.address}, {a?.locality}, {a?.city}, {a?.state} - {a?.pinCode}
                                            </p>
                                            <p className="text-sm text-gray-600">{a?.phoneNumber}</p>
                                        </div>
                                    </div>
                                    <div>
                                        {selectedAddress?._id == a?._id && <Button onClick={(e) => { e.stopPropagation(), setEditAddressFormVisible(true), setSelectedAddress(a) }} variant="outline" className="border-white text-amber-500 hover:bg-white hover:text-amber-600">Edit</Button>}
                                    </div>
                                </div>
                            ))}

                            {
                                addressFormVisible || editAddressFormVisible ? null :
                                    <div className="flex gap-3 pt-3">
                                        {selectedAddress && (
                                            <Button onClick={() => setVisibleSection("summary")} className="bg-amber-500 hover:bg-amber-600 text-white font-semibold">
                                                Deliver Here
                                            </Button>
                                        )}
                                        <Button onClick={() => setAddressFormVisible(true)} variant="outline"> Add New Address</Button>
                                    </div>
                            }
                        </>
                    )}

                    {addressFormVisible && <AddAddress open={addressFormVisible} setOpen={setAddressFormVisible} />}
                    {editAddressFormVisible && <EditAddress open={editAddressFormVisible} setOpen={setEditAddressFormVisible} address={selectedAddress}></EditAddress>}

                </div>
            ) : (
                <div className="px-5 py-3">
                    {selectedAddress ? (
                        <p className="text-gray-700 text-sm">
                            Deliver to: <strong>{selectedAddress?.name}</strong>,{" "}
                            {selectedAddress?.address}, {selectedAddress?.city}
                        </p>
                    ) : (
                        <div className="border border-red-300 bg-red-50 p-3 rounded-md flex items-center justify-between">
                            <p className="text-red-700 font-medium">
                                ⚠️ Please add a delivery address before proceeding.
                            </p>
                            <Button onClick={() => { setVisibleSection("address"), setAddressFormVisible(true) }} variant="outline" className="text-red-700 border-red-300 hover:bg-red-100">
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

    const { chekOut } = useSelector((store) => store.cart)
    const { userAddresses } = useSelector((store) => store.auth)
    const [searchParams] = useSearchParams()
    const mode = searchParams.get("mode")


    return (
        <div className="w-[90%] bg-white rounded-md border shadow-sm">
            <div className="flex justify-between items-center px-5 py-3 bg-amber-500 text-white rounded-t-md">
                <p className="font-semibold">2. ORDER SUMMARY</p>
                {visibleSection !== "summary" && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setVisibleSection("summary")}
                        className="border-white text-amber-500 hover:bg-white hover:text-amber-600"
                    >
                        Change
                    </Button>
                )}
            </div>

            {visibleSection === "summary" && (
                <div className="p-5 space-y-4">
                    {
                        mode == "buynow" ? (
                            <div className="flex gap-4 border-b border-gray-100 pb-3">
                                <img
                                    src={chekOut?.product?.images?.[0]?.url}
                                    alt={chekOut?.product?.name}
                                    className="w-16 h-16 object-contain"
                                />
                                <div className="flex-1">
                                    <p className="font-medium text-gray-900 text-sm line-clamp-2">
                                        {chekOut?.product?.brand} {chekOut?.product?.name}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {chekOut?.product?.attributes?.storage} • {chekOut.attributes?.colour}
                                    </p>
                                    <p className="font-semibold mt-1">
                                        ₹{chekOut?.itemTotal?.toLocaleString("en-IN")}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            chekOut?.items?.map((item) => (
                                <div
                                    key={item?.product._id}
                                    className="flex gap-4 border-b border-gray-100 pb-3"
                                >
                                    <img
                                        src={item?.product?.images?.[0]?.url}
                                        alt={item?.product?.name}
                                        className="w-16 h-16 object-contain"
                                    />
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-900 text-sm line-clamp-2">
                                            {item?.product?.brand} {item?.product?.name}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {item?.product?.attributes?.storage} • {item?.attributes?.colour} {item?.attributes?.quantity}
                                        </p>
                                        <p className="font-semibold mt-1">
                                            ₹{item?.lockedPrice?.toLocaleString("en-IN")} x {item.quantity} = {chekOut?.itemTotal?.toLocaleString("en-IN")}
                                        </p>
                                    </div>


                                </div>
                            ))
                        )
                    }
                    <Button disabled={!userAddresses?.length} onClick={handlePayment} className="bg-amber-500 hover:bg-amber-600 text-white font-semibold w-full pointer">
                        Continue to Payment
                    </Button>
                </div>
            )}
        </div>
    )
}

const RightOrderSummaryInCheckout = ({ handlePayment }) => {

    const { chekOut } = useSelector((store) => store.cart);
    const { userAddresses } = useSelector((store) => store.auth);


    return (
        <Card className="w-[350px] sticky top-24 border shadow-md">
            <CardHeader className="bg-amber-500 text-white rounded-t-md">
                <CardTitle className="text-lg font-semibold">PRICE DETAILS</CardTitle>
            </CardHeader>

            <CardContent className="space-y-3 py-4">
                {/* Items total */}
                <div className="flex justify-between text-gray-700 text-sm">
                    <p>Price ({chekOut?.items?.length || 1} items)</p>
                    <p>₹{chekOut?.itemTotal?.toLocaleString("en-IN")}</p>
                </div>



                <div className="flex justify-between text-gray-700 text-sm">
                    <p>Platform Fees</p>
                    <p>₹{chekOut?.platformFees?.toLocaleString("en-IN")}</p>
                </div>

                <Separator className="my-3" />

                {/* Total */}
                <div className="flex justify-between text-base font-semibold text-gray-900">
                    <p>Total Amount</p>
                    <p>₹{chekOut?.finalPayable?.toLocaleString("en-IN")}</p>
                </div>

                <Separator className="my-3" />

                {/* Button */}
                <Button disabled={!userAddresses?.length} onClick={handlePayment} className="w-full bg-amber-500 hover:bg-amber-600 text-white mt-3 font-semibold pointer">
                    PLACE ORDER
                </Button>
            </CardContent>
        </Card>
    );
};



export default CheckOut
