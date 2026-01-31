import { Button } from "@/components/ui/button";
import { updateStatusOfOrder } from "@/redux_temp/deliverySlice";
import axios from "axios";
import { Phone, MapPin, CheckCircle, Truck, Package, Box } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const OngoingDeliveryOrders = () => {
    const { ongoingLoading, ongingOrders } = useSelector((store) => store.delivery);
    const [buttonLoading, setButtonLoading] = useState(false);
    const dispatch = useDispatch();

    function getNextButtonLabel(status) {
        switch (status) {
            case "assigned":
                return "Mark as Picked";
            case "picked":
                return "Out for Delivery";
            case "out-for-delivery":
                return "Delivered";
            case "delivered":
                return "Delivered";
            default:
                return "";
        }
    }

    function getButtonStyle(status) {
        switch (status) {
            case "assigned":
                return { bg: "bg-blue-500 hover:bg-blue-600", icon: <Truck size={16} /> };
            case "picked":
                return { bg: "bg-yellow-500 hover:bg-yellow-600", icon: <Package size={16} /> };
            case "out-for-delivery":
                return { bg: "bg-orange-500 hover:bg-orange-600", icon: <Box size={16} /> };
            case "delivered":
                return { bg: "bg-green-500", icon: <CheckCircle size={16} /> };
            default:
                return { bg: "bg-gray-300", icon: null };
        }
    }

    function handleOpenMaps(order) {
        const address = `${order.address.address}, ${order.address.locality}, ${order.address.city}, ${order.address.pinCode}`;
        const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
        window.open(mapsUrl, "_blank");
    }

    function handleCall(order) {
        window.open(`tel:${order.address.phoneNumber}`, "_self");
    }

    async function handleStatusUpdate(order) {
        try {
            setButtonLoading(true);

            const current = order.item.deliveryStatus;
            const orderId = order.orderId;
            const itemId = order.item._id;

            let status = null;
            if (current === "assigned") status = "picked";
            else if (current === "picked") status = "out-for-delivery";
            else if (current === "out-for-delivery") status = "delivered";
            if (!status) return;

            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/delivery/status`,
                { orderId, itemId, status },
                { withCredentials: true }
            );

            dispatch(updateStatusOfOrder(response?.data?.item || {}));
            setButtonLoading(false);
        } catch (error) {
            console.log(error);
            setButtonLoading(false);
        }
    }

    if (ongoingLoading) {
        return (
            <p className="text-center py-10 text-lg font-medium text-gray-600">
                Loading...
            </p>
        );
    }

    if (ongingOrders.length <= 0) {
        return (
            <p className="text-center py-10 text-lg font-medium text-gray-600">
                No Orders Assign to you till now :)
            </p>
        );
    }

    return (
        <div className="p-4 space-y-6">
            {ongingOrders.map((order) => {
                const { bg, icon } = getButtonStyle(order.item.deliveryStatus);
                const nextLabel = getNextButtonLabel(order.item.deliveryStatus);
                const isDelivered = order.item.deliveryStatus === "delivered";

                return (
                    <div
                        key={order.item._id}
                        className="border rounded-xl p-4 shadow-md bg-white space-y-4 hover:shadow-lg transition"
                    >
                        {/* Top Section */}
                        <div className="flex gap-5">
                            <div className="w-28 h-28 flex-shrink-0">
                                <img
                                    src={order?.item?.product?.images[0]?.url}
                                    alt=""
                                    className="w-full h-full object-cover rounded-lg"
                                />
                            </div>
                            <div className="flex-1 flex flex-col justify-between">
                                <div>
                                    <h2 className="text-lg font-semibold mb-1">
                                        {order?.item?.product?.name}
                                    </h2>

                                    <p className="text-gray-600">
                                        Price: ₹{order?.item?.lockedPrice?.toLocaleString("en-IN")}
                                    </p>
                                    <p className="text-gray-600">Qty: {order?.item?.quantity}</p>

                                    <p className="mt-2 text-sm text-gray-500 uppercase">
                                        Order ID: {order?.orderId}
                                    </p>
                                </div>

                                {order.paymentMode === "cod" && (
                                    <div className="w-50 text-center mt-2 inline-block px-3 py-1 text-white font-bold text-sm rounded-full bg-orange-500 shadow-lg">
                                        Collect ₹{order?.item?.lockedPrice?.toLocaleString("en-IN")}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Address */}
                        <div className="bg-gray-50 p-3 rounded-lg">
                            <h3 className="font-semibold mb-1">Delivery Address</h3>
                            <div className="text-gray-700 text-sm space-y-0.5">
                                <p>{order?.address.name}</p>
                                <p>{order?.address.address}</p>
                                <p>{order?.address.locality}</p>
                                <p>{order?.address.city} - {order?.address.pinCode}</p>
                                <p>Phone: {order?.address?.phoneNumber}</p>
                                {order?.address?.landmark && (
                                    <p>Landmark: {order?.address?.landmark}</p>
                                )}
                            </div>

                            <div className="flex gap-3 mt-3">
                                <Button
                                    variant="outline"
                                    className="flex gap-2 items-center"
                                    onClick={() => handleCall(order)}
                                >
                                    <Phone size={16} /> Call
                                </Button>

                                <Button
                                    variant="outline"
                                    className="flex gap-2 items-center"
                                    onClick={() => handleOpenMaps(order)}
                                >
                                    <MapPin size={16} /> Open Maps
                                </Button>
                            </div>
                        </div>

                        {/* Status Button */}
                        <Button
                            onClick={() => handleStatusUpdate(order)}
                            disabled={isDelivered || buttonLoading}
                            className={`w-full py-2 flex justify-center items-center gap-2 text-white ${bg} ${isDelivered ? "opacity-60 cursor-not-allowed" : ""
                                }`}
                        >
                            {icon} {buttonLoading ? "Updating..." : nextLabel}
                        </Button>
                    </div>
                );
            })}
        </div>
    );
};

export default OngoingDeliveryOrders;
