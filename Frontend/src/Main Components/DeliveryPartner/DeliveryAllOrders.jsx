import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

const DeliveryAllOrders = () => {
    const { allLoading, allDeliveryOrders } = useSelector((store) => store.delivery);
    const [search, setSearch] = useState("");

    const filteredOrders = allDeliveryOrders.filter((order) => {
        const text = search.toLowerCase().trim();

        const productName = order?.item?.product?.name?.toLowerCase() || "";
        const customerName = order?.address?.name?.toLowerCase() || "";
        const orderId = order?.orderId?.toString().toLowerCase() || "";

        return (
            productName.includes(text) || customerName.includes(text) || orderId.includes(text)
        );
    });




    function handleOpenMaps(order) {
        const address = `${order.address.address}, ${order.address.locality}, ${order.address.city}, ${order.address.pinCode}`;
        const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
        window.open(mapsUrl, "_blank");
    }

    function handleCall(order) {
        window.open(`tel:${order.address.phoneNumber}`, "_self");
    }

    if (allLoading) {
        return (
            <p className="text-center py-10 text-lg font-medium text-gray-600">
                Loading...
            </p>
        );
    }

    if (!allDeliveryOrders.length) {
        return (
            <p className="text-center py-10 text-lg font-medium text-gray-600">
                No orders found
            </p>
        );
    }

    return (
        <div className="p-4 space-y-4">
            {/* Search Bar */}
            <input
                type="text"
                placeholder="Search by product name..."
                className="w-full p-2 border rounded-lg mb-4"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            {!filteredOrders.length && <p className="text-center py-10 text-lg font-medium text-gray-600"> No orders found</p>}

            {/* Orders List */}
            {filteredOrders.map((order) => (
                <div
                    key={order.item._id}
                    className="border rounded-xl p-4 shadow-md bg-white space-y-4 hover:shadow-lg transition"
                >
                    {/* Top Section */}
                    <div className="flex gap-5">
                        <div className="w-28 h-28 flex-shrink-0">
                            <img
                                src={order?.item?.product?.images[0]?.url || "/placeholder.png"}
                                alt={order?.item?.product?.name}
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

                            {order?.paymentMode === "cod" && (
                                <div className="w-50 text-center mt-2 inline-block px-3 py-1 text-white font-bold text-sm rounded-full bg-orange-500 shadow-lg">
                                    Collect ₹{order?.item?.lockedPrice?.toLocaleString("en-IN")}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Address Section */}
                    <div className="bg-gray-50 p-3 rounded-lg">
                        <h3 className="font-semibold mb-1">Delivery Address</h3>
                        <div className="text-gray-700 text-sm space-y-0.5">
                            <p>{order?.address.name}</p>
                            <p>{order?.address.address}</p>
                            <p>{order?.address.locality}</p>
                            <p>
                                {order?.address.city} - {order?.address.pinCode}
                            </p>
                            <p>Phone: {order?.address?.phoneNumber}</p>
                            {order?.address?.landmark && <p>Landmark: {order?.address?.landmark}</p>}
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
                </div>
            ))}
        </div>
    );
};

export default DeliveryAllOrders;


