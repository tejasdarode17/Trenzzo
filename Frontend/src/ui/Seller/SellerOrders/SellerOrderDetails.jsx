import { useNavigate, useParams } from "react-router-dom";
import { Download, Printer, StepBack, Truck, PackageCheck, MapPin, CreditCard, Package, Box, CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { DialogTitle } from "@radix-ui/react-dialog";
import { useSellerOrderDetails } from "@/hooks/seller/useSellerOrderDetails";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useSellerDeliveryPartner } from "@/hooks/seller/useSellerDeliveryPartner";
import { sellerAssignDeliveryPartnerAPI, sellerUpdateDeliveryStatusAPI } from "@/api/seller.api";

const SellerOrderDetails = () => {
    const navigate = useNavigate();
    const { id: orderId } = useParams();
    const { data, isLoading: orderLoading, isError } = useSellerOrderDetails(orderId);
    const order = data?.order;


    if (isError) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-red-500">Error While fetching the Order Detail</p>
            </div>
        )
    }


    if (!order) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="text-center max-w-md">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
                        <PackageCheck className="w-8 h-8 sm:w-10 sm:h-10 text-slate-400" />
                    </div>
                    <p className="text-slate-600 text-base sm:text-lg font-medium">No order selected</p>
                    <Button variant="secondary" onClick={() => navigate(-1)} className="mt-4 bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto">
                        Back to Orders
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-4">
            <div className="max-w-6xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex flex-col gap-4">
                    <div className="w-full">
                        <div className="w-full flex justify-between">
                            <h1 className="text-xl font-bold bg-gradient-to-r from-slate-800 to-blue-700 bg-clip-text text-transparent">
                                Order Details
                            </h1>
                            <Button variant="secondary" onClick={() => navigate(-1)} className="border-slate-300 hover:bg-slate-50 text-sm">
                                <StepBack size={16} className="mr-1 sm:mr-2" />
                            </Button>
                        </div>
                        <p className="text-slate-600 mt-1 text-xs">Order #{order._id?.slice(-8).toUpperCase()}</p>
                        <p className="text-slate-500 mt-1 text-xs">Placed on: {new Date(order.createdAt).toLocaleString()}</p>
                    </div>

                    <div className="flex flex-wrap gap-2 sm:gap-3 w-full sm:w-auto">
                        <Button variant="outline" className="border-slate-300 hover:bg-slate-50 flex-1 sm:flex-none text-sm sm:text-base">
                            <Download size={16} className="mr-1 sm:mr-2" /> Invoice
                        </Button>
                        <Button variant="outline" className="border-slate-300 hover:bg-slate-50 flex-1 sm:flex-none text-sm sm:text-base">
                            <Printer size={16} className="mr-1 sm:mr-2" /> Print
                        </Button>
                    </div>
                </div>

                {/* Main Card */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
                            <div className="flex items-start gap-3 sm:gap-4">
                                <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 mt-1 flex-shrink-0" />
                                <div className="min-w-0">
                                    <h3 className="font-semibold text-base sm:text-lg text-slate-800 truncate">{order.address?.name}</h3>
                                    <p className="text-slate-600 text-sm sm:text-base break-words">{order.address?.address}</p>
                                    <p className="text-slate-600 text-sm sm:text-base">{order.address?.locality}, {order.address?.city}</p>
                                    <p className="text-slate-600 text-sm sm:text-base">{order.address?.state} - {order.address?.pinCode}</p>
                                    <p className="text-slate-600 text-sm sm:text-base mt-1">Phone: {order.address?.phoneNumber}</p>
                                    <p className="text-slate-600 text-sm sm:text-base mt-1">Landmark: {order.address?.landmark}</p>
                                    {order.address?.isDefault && <Badge className="mt-2 bg-green-600 text-white text-xs sm:text-sm">Default</Badge>}
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div className="flex items-start gap-3">
                                <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 mt-1 flex-shrink-0" />
                                <div className="min-w-0">
                                    <h4 className="font-semibold text-base sm:text-lg">Payment</h4>
                                    <p className="text-sm text-slate-600">Mode: <span className="font-medium">{order.paymentMode}</span></p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <p className="text-sm text-slate-600">Status:</p>
                                        {order.paymentStatus === "paid" ? (
                                            <Badge className="bg-green-600 text-white text-xs sm:text-sm">Paid</Badge>
                                        ) : (
                                            <Badge className="bg-amber-400 text-white text-xs sm:text-sm">Pending</Badge>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="w-full flex justify-start lg:justify-end">
                                <div className="">
                                    <p className="text-sm text-slate-500">Seller Earnings</p>
                                    <p className="text-lg sm:text-xl font-bold text-blue-700">₹{order?.sellerTotalAmount?.toLocaleString("en-IN")}</p>
                                </div>
                            </div>

                        </div>

                        {/* Order Items + Status (interactive) */}
                        <OrderItemsWithStatus order={order} orderLoading={orderLoading} />
                    </div>

                    {/* Right: Summary */}
                    <aside className="bg-white rounded-xl shadow-lg p-4 sm:p-6 h-fit">
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
                            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base">
                                Contact Buyer
                            </Button>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
};

const OrderItemsWithStatus = ({ order, orderLoading }) => {
    return (
        <div className="bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg border border-slate-200 p-4 sm:p-6 mt-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                        <Package className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                    </div>
                    <div className="min-w-0">
                        <h2 className="text-lg">Order Items & Status</h2>
                        <p className="text-slate-500 text-xs">Manage item status and track progress</p>
                    </div>
                </div>
            </div>

            <div className="w-full flex justify-end">
                <Badge className="bg-slate-100 text-slate-700 text-xs sm:text-sm my-2">
                    {order?.items?.length} {order?.items?.length === 1 ? "item" : "items"}
                </Badge>
            </div>

            <div className="space-y-4">
                {order?.items?.map((item) => (
                    <OrderItemCard key={item?._id} item={item} order={order} orderLoading={orderLoading} />
                ))}
            </div>
        </div>
    );
};

const OrderItemCard = ({ item, order, orderLoading }) => {
    const [open, setOpen] = useState(false);

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

    const queryClient = useQueryClient();
    const { mutate: handleSellerUpdateStatus } = useMutation({
        mutationFn: sellerUpdateDeliveryStatusAPI,
        onSuccess: () => {
            queryClient.invalidateQueries(["sellerOrderDetails"]);
        },
        onError: (err) => {
            toast.error(err?.response?.data?.message || "Something went wrong!");
        }
    });

    function handleMarkPacked() {
        handleSellerUpdateStatus({ orderID: order._id, itemID: item._id });
    }

    return (
        <div className="p-3 sm:p-4 border rounded-xl bg-white hover:shadow-md transition-all">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <img
                    src={item?.product?.images?.[0]?.url || "/placeholder.png"}
                    alt={item?.product?.name || "product"}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover border self-center sm:self-start"
                />
                <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div className="flex flex-col sm:flex-row justify-between mb-2 gap-2">
                        <div className="min-w-0">
                            <h3 className="font-semibold text-sm sm:text-base truncate">{item?.product?.name}</h3>
                            <p className="text-xs sm:text-sm text-slate-600">
                                Qty: {item?.quantity} • ₹{item?.lockedPrice?.toLocaleString("en-IN")} each
                            </p>
                        </div>
                        <p className="font-bold text-sm sm:text-base">₹{item?.sellerAmount}</p>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                        <Badge className={`${cfg.color} border font-medium capitalize flex items-center gap-2 text-xs sm:text-sm w-fit`}>
                            <Icon size={12} className="sm:w-3.5 sm:h-3.5" />
                            {cfg.label}
                        </Badge>

                        <div className="w-full sm:w-auto">
                            {/* Show "Mark as Packed" button only if item is ordered */}
                            {item?.status === "ordered" && (
                                <Button
                                    className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto text-xs sm:text-sm"
                                    onClick={handleMarkPacked}
                                    disabled={orderLoading}
                                    size="sm"
                                >
                                    {orderLoading ? <Loader2 className="animate-spin h-4 w-4" /> : "Mark as Packed"}
                                </Button>
                            )}

                            {/* Show Assign Delivery Partner button only if packed and not assigned */}
                            {item?.status === "packed" && !item?.deliveryPartner && (
                                <Dialog open={open} onOpenChange={setOpen}>
                                    <DialogTrigger asChild>
                                        <Button className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto text-xs sm:text-sm" size="sm">
                                            Assign Delivery Partner
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-md">
                                        <DialogHeader>
                                            <DialogTitle className="text-base sm:text-lg">Select a Delivery Partner</DialogTitle>
                                        </DialogHeader>
                                        <DeliveryPartnerPicker order={order} item={item} onClose={() => setOpen(false)} />
                                    </DialogContent>
                                </Dialog>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const DeliveryPartnerPicker = ({ order, item, onClose }) => {
    const [partners, setPartners] = useState([]);
    const [selectedPartner, setSelectedPartner] = useState(null);
    const queryClient = useQueryClient();

    const { data, isError: deliveryPartnerError, error, isLoading } = useSellerDeliveryPartner();
    useEffect(() => {
        setPartners(data?.partners);
    }, [data]);

    const { mutate: handleAssignDeliveryPartner, isPending: loading } = useMutation({
        mutationFn: sellerAssignDeliveryPartnerAPI,
        onSuccess: () => {
            queryClient.invalidateQueries(["sellerOrderDetails"]);
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Something went Wrong on server");
        }
    });

    function handleAssign() {
        if (!selectedPartner) return;
        handleAssignDeliveryPartner({ orderID: order?._id, itemID: item?._id, partnerID: selectedPartner });
        onClose();
    }

    if (loading) return <p className="text-center py-4">Assigning...</p>;
    if (isLoading) return <p className="text-center py-4">Loading...</p>;

    if (deliveryPartnerError) {
        return (
            <div className="flex flex-col items-center gap-3 p-4 bg-red-50 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-600" />
                <p className="text-sm text-red-700">
                    {error?.response?.data?.message || "Failed to load delivery partners"}
                </p>

                <button
                    onClick={refetch}
                    className="text-sm text-red-600 underline"
                >
                    Try again
                </button>
            </div>
        );
    }


    return (
        <div className="space-y-2 max-h-60 overflow-y-auto">
            {partners?.map((p) => (
                <div
                    key={p._id}
                    className={`border p-2 sm:p-3 rounded-lg flex justify-between items-center cursor-pointer ${selectedPartner === p?._id ? "border-blue-600 bg-blue-50" : "border-slate-300"}`}
                    onClick={() => setSelectedPartner(p?._id)}
                >
                    <div className="min-w-0 flex-1">
                        <p className="font-semibold text-sm sm:text-base truncate">{p?.username}</p>
                        <p className="text-xs sm:text-sm text-slate-600">📞 {p?.phone}</p>
                    </div>
                    {selectedPartner === p._id && <span className="text-blue-600 font-bold text-xs sm:text-sm ml-2 flex-shrink-0">Selected</span>}
                </div>
            ))}

            <Button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-4 text-sm sm:text-base"
                disabled={!selectedPartner}
                onClick={handleAssign}
            >
                Assign
            </Button>
        </div>
    );
};

export default SellerOrderDetails;