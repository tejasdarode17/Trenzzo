import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Download, Printer, StepBack, Truck, PackageCheck, MapPin, CreditCard, Package, Box, CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { setOrderDeliveryPartner, updateOrderPacked } from "@/Redux/sellerSlice";
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import axios from "axios";
import { DialogTitle } from "@radix-ui/react-dialog";



const SellerOrderDetails = () => {
    const navigate = useNavigate();
    const { orderDetails } = useSelector((store) => store.seller || {});

    const { order } = orderDetails

    if (!order) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
                        <PackageCheck className="w-10 h-10 text-slate-400" />
                    </div>
                    <p className="text-slate-600 text-lg font-medium">No order selected</p>
                    <Button onClick={() => navigate(-1)} className="mt-4 bg-blue-600 hover:bg-blue-700 text-white">
                        Back to Orders
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-4 bg-gradient-to-br from-slate-50 to-blue-50/30">
            <div className="max-w-6xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-blue-700 bg-clip-text text-transparent">
                            Order Details
                        </h1>
                        <p className="text-slate-600 mt-1">Order #{order._id?.slice(-8).toUpperCase()}</p>
                        <p className="text-sm text-slate-500 mt-1">Placed on: {new Date(order.createdAt).toLocaleString()}</p>
                    </div>

                    <div className="flex gap-3">
                        <Button variant="outline" className="border-slate-300 hover:bg-slate-50">
                            <Download size={16} className="mr-2" /> Invoice
                        </Button>
                        <Button variant="outline" className="border-slate-300 hover:bg-slate-50">
                            <Printer size={16} className="mr-2" /> Print
                        </Button>
                        <Button variant="outline" onClick={() => navigate(-1)} className="border-slate-300 hover:bg-slate-50">
                            <StepBack size={16} className="mr-2" /> Back
                        </Button>
                    </div>
                </div>

                {/* Main Card */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <div className="flex items-start gap-4">
                                <MapPin className="w-6 h-6 text-blue-600 mt-1" />
                                <div>
                                    <h3 className="font-semibold text-lg text-slate-800">{order.address?.name}</h3>
                                    <p className="text-slate-600">{order.address?.address}</p>
                                    <p className="text-slate-600">{order.address?.locality}, {order.address?.city}</p>
                                    <p className="text-slate-600">{order.address?.state} - {order.address?.pinCode}</p>
                                    <p className="text-slate-600 mt-1">Phone: {order.address?.phoneNumber}</p>
                                    <p className="text-slate-600 mt-1">Landmark: {order.address?.landmark}</p>
                                    {order.address?.isDefault && <Badge className="mt-2 bg-green-600 text-white">Default</Badge>}
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div className="flex items-start gap-3">
                                <CreditCard className="w-6 h-6 text-blue-600 mt-1" />
                                <div>
                                    <h4 className="font-semibold">Payment</h4>
                                    <p className="text-sm text-slate-600">Mode: <span className="font-medium">{order.paymentMode}</span></p>
                                    <p className="text-sm">
                                        Status:{" "}
                                        {order.paymentStatus === "paid" ? (
                                            <Badge className="bg-green-600 text-white">Paid</Badge>
                                        ) : (
                                            <Badge className="bg-amber-400 text-white">Pending</Badge>
                                        )}
                                    </p>
                                </div>
                            </div>

                            <div className="text-right">
                                <p className="text-sm text-slate-500">Seller Earnings</p>
                                <p className="text-xl font-bold text-blue-700">₹{order?.sellerTotalAmount?.toLocaleString("en-IN")}</p>
                            </div>
                        </div>

                        {/* Order Items + Status (interactive) */}
                        <OrderItemsWithStatus order={order} />
                    </div>

                    {/* Right: Summary */}
                    <aside className="bg-white rounded-xl shadow-lg p-6 h-fit">
                        <h4 className="font-semibold text-lg mb-3">Order Summary</h4>

                        <div className="space-y-2 text-sm text-slate-700">
                            <div className="flex justify-between">
                                <span>Items</span>
                                <span>{order.items?.length ?? 0}</span>
                            </div>
                            <div className="flex justify-between font-semibold text-slate-900 border-t pt-2">
                                <span>Total</span>
                                <span>₹{(order.sellerTotalAmount ?? 0).toLocaleString("en-IN")}</span>
                            </div>
                        </div>

                        <div className="mt-4">
                            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                                Contact Buyer
                            </Button>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
};


const OrderItemsWithStatus = ({ order }) => {

    return (
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200 p-6 mt-4">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                        <Package className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">Order Items & Status</h2>
                        <p className="text-slate-500 text-sm">Manage item status and track progress</p>
                    </div>
                </div>

                <Badge className="bg-slate-100 text-slate-700">
                    {order?.items?.length} {order.items.length === 1 ? "item" : "items"}
                </Badge>
            </div>

            <div className="space-y-4">
                {order?.items?.map((item) => (
                    <OrderItemCard key={item._id} item={item} order={order} />
                ))}
            </div>

        </div>
    );
};


const OrderItemCard = ({ item, order }) => {
    const [open, setOpen] = useState(false);
    const dispatch = useDispatch();
    const { orderLoading } = useSelector((store) => store.seller)

    const statusConfig = {
        ordered: { label: "Order Confirmed", color: "bg-slate-100 text-slate-700", icon: PackageCheck },
        packed: { label: "Packed", color: "bg-blue-100 text-blue-700", icon: Truck },
        shipped: { label: "Shipped", color: "bg-yellow-100 text-yellow-700", icon: Box },
        "out-for-delivery": { label: "Out for Delivery", color: "bg-orange-100 text-orange-700", icon: Truck },
        delivered: { label: "Delivered", color: "bg-green-100 text-green-700", icon: CheckCircle },
        returned: { label: "returned", color: "bg-red-400 text-red-700", icon: CheckCircle },
    };

    const cfg = statusConfig[item.status] || statusConfig.ordered;
    const Icon = cfg.icon;


    async function handleMarkPacked() {
        try {
            const orderID = order._id
            const itemID = item._id
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/seller/order/status`,
                { orderID, itemID, newStatus: "packed" },
                { withCredentials: true }
            );
            console.log(response.data);
            if (response.data.success) dispatch(updateOrderPacked({ itemID, newStatus: "packed" }))
        } catch (error) {
            console.log(error);

        }
    }

    return (
        <div className="p-4 border rounded-xl bg-white hover:shadow-md transition-all">
            <div className="flex gap-4">
                <img
                    src={item?.product?.images?.[0]?.url || "/placeholder.png"}
                    alt={item?.product?.name || "product"}
                    className="w-20 h-20 rounded-xl object-cover border"
                />
                <div className="flex-1 flex flex-col justify-between">
                    <div className="flex justify-between mb-2">
                        <div>
                            <h3 className="font-semibold">{item?.product?.name}</h3>
                            <p className="text-sm text-slate-600">
                                Qty: {item?.quantity} • ₹{item?.lockedPrice?.toLocaleString("en-IN")} each
                            </p>
                        </div>
                        <p className="font-bold">₹{item?.sellerAmount}</p>
                    </div>

                    <div className="flex justify-between items-center">

                        <Badge className={`${cfg.color} border font-medium capitalize flex items-center gap-2`}>
                            <Icon size={14} />
                            {cfg.label}

                        </Badge>

                        {/* Show "Mark as Packed" button only if item is ordered */}
                        {item.status === "ordered" && (
                            <Button
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                                onClick={handleMarkPacked}
                                disabled={orderLoading}
                            >
                                {orderLoading ? <Loader2 className="animate-spin"></Loader2> : "Mark as Packed"}
                            </Button>
                        )}

                        {/* Show Assign Delivery Partner button only if packed and not assigned */}
                        {item.status === "packed" && !item.deliveryPartner && (
                            <Dialog open={open} onOpenChange={setOpen}>
                                <DialogTrigger asChild>
                                    <Button className="bg-green-600 hover:bg-green-700 text-white">
                                        Assign Delivery Partner
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Select a Delivery Partner</DialogTitle>
                                    </DialogHeader>
                                    <DeliveryPartnerPicker order={order} item={item} onClose={() => setOpen(false)} />
                                </DialogContent>
                            </Dialog>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
};


const DeliveryPartnerPicker = ({ order, item, onClose }) => {
    const [partners, setPartners] = useState([]);
    const [selectedPartner, setSelectedPartner] = useState(null);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        async function fetchPartners() {
            setLoading(true);
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/delivery/all`, { withCredentials: true });
                setPartners(response.data.partners || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        fetchPartners();
    }, []);

    async function handleAssign() {
        if (!selectedPartner) return;
        setLoading(true);
        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/seller/assign/order`,
                { orderID: order._id, itemID: item._id, partnerID: selectedPartner },
                { withCredentials: true }
            );
            if (response.data.success) dispatch(setOrderDeliveryPartner({ itemID: item._id, partnerID: selectedPartner }));
            onClose();
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };


    if (loading) return <p>Loading...</p>;

    return (
        <div className="space-y-2">
            {partners.map((p) => (
                <div
                    key={p._id}
                    className={`border p-2 rounded-lg flex justify-between items-center cursor-pointer ${selectedPartner === p._id ? "border-blue-600 bg-blue-50" : "border-slate-300"}`}
                    onClick={() => setSelectedPartner(p._id)}
                >
                    <div>
                        <p className="font-semibold">{p.username}</p>
                        <p className="text-sm text-slate-600">📞 {p.phone}</p>
                    </div>
                    {selectedPartner === p._id && <span className="text-blue-600 font-bold">Selected</span>}
                </div>
            ))}

            <Button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                disabled={!selectedPartner}
                onClick={handleAssign}
            >
                Assign
            </Button>
        </div>
    );
};


export default SellerOrderDetails;




