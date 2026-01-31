import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Phone, MapPin, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { updateReturnStatus } from "@/redux_temp/deliverySlice";

const DeliveryReturnOrders = () => {
    const { allReturns, returnLoading } = useSelector((store) => store.delivery);
    const [buttonLoading, setButtonLoading] = useState(false);
    const dispatch = useDispatch();

    function handleCall(addr) {
        window.open(`tel:${addr?.phoneNumber}`, "_self");
    }

    function handleOpenMaps(addr) {
        const full = `${addr.address}, ${addr.locality}, ${addr.city}, ${addr.pinCode}`;
        const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(full)}`;
        window.open(mapsUrl, "_blank");
    }

    async function handlePickedUp(R) {
        try {
            setButtonLoading(true);

            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/delivery/return/picked`,
                {
                    returnID: R.returnRequest._id,
                    orderID: R.order._id,
                    itemID: R.returnRequest.itemId
                },
                { withCredentials: true }
            );

            console.log(response.data);

            dispatch(updateReturnStatus({ returnId: R.returnRequest._id }))
            setButtonLoading(false);

        } catch (error) {
            console.log(error);
            setButtonLoading(false);
        }
    }

    if (returnLoading) {
        return (
            <p className="text-center py-10 text-lg font-medium text-gray-600">
                Loading...
            </p>
        );
    }

    if (!allReturns || allReturns.length === 0) {
        return (
            <p className="text-center py-10 text-lg font-medium text-gray-600">
                No Return Orders Assigned :)
            </p>
        );
    }

    return (
        <div className="p-4 space-y-6">
            {allReturns.map((R) => {
                const addr = R?.customer?.addresses?.[0];
                return (
                    <div
                        key={R.returnRequest._id}
                        className="border rounded-xl p-4 shadow-md bg-white space-y-4 hover:shadow-lg transition"
                    >

                        {/* Product Section */}
                        <div className="flex gap-5">
                            <div className="w-28 h-28 flex-shrink-0">
                                <img
                                    src={R?.product?.images?.[0]?.url}
                                    alt=""
                                    className="w-full h-full object-cover rounded-lg"
                                />
                            </div>

                            <div className="flex-1">
                                <h2 className="text-lg font-semibold mb-1">
                                    {R?.product?.name}
                                </h2>

                                <p className="text-gray-600">
                                    Refund Amount: ₹{R?.returnRequest?.refundAmount?.toLocaleString("en-IN")}
                                </p>

                                <p className="text-gray-600">
                                    Reason: {R?.returnRequest?.reason}
                                </p>

                                <p className="mt-2 text-sm text-gray-500 uppercase">
                                    Return ID: {R?.returnRequest?._id}
                                </p>
                            </div>
                        </div>

                        {/* Pickup Address */}
                        {addr && (
                            <div className="bg-gray-50 p-3 rounded-lg">
                                <h3 className="font-semibold mb-1">Pickup Address</h3>

                                <div className="text-gray-700 text-sm space-y-0.5">
                                    <p>{addr.name}</p>
                                    <p>{addr.address}</p>
                                    <p>{addr.locality}</p>
                                    <p>{addr.city} - {addr.pinCode}</p>
                                    <p>Phone: {addr.phoneNumber}</p>
                                    {addr.landmark && <p>Landmark: {addr.landmark}</p>}
                                </div>

                                <div className="flex gap-3 mt-3">
                                    <Button
                                        variant="outline"
                                        className="flex gap-2 items-center"
                                        onClick={() => handleCall(addr)}
                                    >
                                        <Phone size={16} /> Call
                                    </Button>

                                    <Button
                                        variant="outline"
                                        className="flex gap-2 items-center"
                                        onClick={() => handleOpenMaps(addr)}
                                    >
                                        <MapPin size={16} /> Open Maps
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* Mark PickedUp Button */}
                        <Button
                            className={`w-full py-2 flex justify-center items-center gap-2 text-white bg-blue-500 hover:bg-blue-600 
                                ${R.returnRequest.returnStatus === "pickedUp" ? "opacity-60 cursor-not-allowed" : ""}`}
                            onClick={() => handlePickedUp(R)}
                            disabled={R.returnRequest.returnStatus === "pickedUp" || buttonLoading}
                        >
                            <Package size={16} />
                            {buttonLoading ? "Updating..." : "Mark as Picked Up"}
                        </Button>
                    </div>
                );
            })}
        </div>
    );
};

export default DeliveryReturnOrders;
