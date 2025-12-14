import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSellerReturns, setReturnDeliveryPartner, updateReturnStatus } from "@/Redux/sellerSlice";
import { Card } from "@/components/ui/card";
import { Package, User, MapPin, } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialogHeader } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function SellerReturnRequests() {
    const [page, setPage] = useState(1)
    const [dateFilter, setDateFilter] = useState("today")
    const { returns } = useSelector((store) => store.seller)
    const { data, loading, totalItems, pages } = returns

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(fetchSellerReturns({ filter: dateFilter, page }))
    }, [page, dateFilter])


    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <Package className="w-6 h-6 text-blue-600" />
                        </div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-blue-700 bg-clip-text text-transparent">
                            Return Management
                        </h1>
                    </div>
                    <p className="text-slate-600">Manage customer return requests</p>
                </div>

                {/* Search */}


                <div className="my-5">
                    <Select value={dateFilter} onValueChange={(value) => setDateFilter(value)}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Time" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="all">All</SelectItem>
                                <SelectItem value="today">Today</SelectItem>
                                <SelectItem value="thisMonth">This Month</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

                {
                    loading && <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 p-6">
                        <div className="max-w-6xl mx-auto">
                            <div className="animate-pulse space-y-4">
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                                        <div className="flex justify-between">
                                            <div className="space-y-3">
                                                <div className="h-6 bg-slate-200 rounded w-48"></div>
                                                <div className="h-4 bg-slate-200 rounded w-32"></div>
                                                <div className="h-4 bg-slate-200 rounded w-24"></div>
                                            </div>
                                            <div className="h-12 bg-slate-200 rounded-2xl w-32"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                }


                {/* Returns List */}
                <div className="space-y-4">
                    {data.length === 0 ? (
                        <div className="text-center my-15">
                            <div className="w-20 h-20 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
                                <Package className="w-10 h-10 text-slate-400" />
                            </div>
                            <p className="text-slate-600 text-lg font-medium">No return requests</p>
                            <p className="text-slate-500 text-sm mt-1">Return requests will appear here</p>
                        </div>
                    ) : (
                        data.map((R) => (
                            <ReturnRequestCard key={R.returnRequest._id} returnData={R} />
                        ))
                    )}
                </div>


                {
                    pages > 1 && (
                        <div className="flex justify-center mt-8 gap-3">
                            <Button
                                className="w-24"
                                variant="outline"
                                disabled={page === 1}
                                onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                            >
                                Previous
                            </Button>

                            <div className="px-5 py-2 rounded-xl bg-white shadow-sm border border-slate-300 font-semibold text-slate-700">
                                Page {page}
                            </div>

                            <Button
                                className="w-24"
                                variant="outline"
                                disabled={page === pages}
                                onClick={() => setPage(prev => prev + 1)}
                            >
                                Next
                            </Button>
                        </div>
                    )
                }
            </div>
        </div>
    )
}


const ReturnRequestCard = ({ returnData }) => {
    const getStatusColor = (status) => {
        const colors = {
            pending: "bg-amber-100 text-amber-800 border-amber-200",
            pickedUp: "bg-orange-100 text-orange-800 border-orange-200",
            approved: "bg-blue-100 text-blue-800 border-blue-200",
            rejected: "bg-rose-100 text-rose-800 border-rose-200",
            completed: "bg-emerald-100 text-emerald-800 border-emerald-200"
        };
        return colors[status] || colors.pending;
    };


    return (
        <Card className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200 p-5 hover:shadow-xl transition-all duration-300">
            <div className="flex gap-4">
                {/* Product Image */}
                <div className="flex-shrink-0">
                    <img
                        src={returnData.product?.images?.[0]?.url}
                        alt={returnData.product?.name}
                        className="w-20 h-20 rounded-xl object-cover border border-slate-200"
                    />
                </div>

                {/* Main Content - Compact Layout */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Product & Customer Info */}
                    <div className="space-y-3">
                        <div>
                            <h3 className="font-semibold text-slate-800 text-lg line-clamp-2">
                                {returnData.product?.name}
                            </h3>
                            <div className="flex items-center gap-4 mt-1 text-sm text-slate-600">
                                <span>₹{returnData.product?.price?.toLocaleString("en-IN")}</span>
                                <span>•</span>
                                <span>Qty: {returnData.quantity}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 text-sm">
                            <User size={14} className="text-slate-500" />
                            <span className="font-medium text-slate-700">{returnData.customer?.username}</span>
                        </div>
                    </div>

                    {/* Address Info */}
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <MapPin size={14} className="text-slate-500" />
                            <span className="text-sm font-medium text-slate-700">Delivery Address</span>
                        </div>
                        <div className="text-sm text-slate-600 space-y-1">
                            <p className="font-medium">{returnData.address?.name}</p>
                            <p className="line-clamp-2">{returnData.address?.address}</p>
                            <p>{returnData.address?.city} - {returnData.address?.pinCode}</p>
                        </div>
                    </div>

                    {/* Return Details */}
                    <div className="space-y-3">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-slate-700">Refund Amount</p>
                                <p className="text-lg font-bold text-slate-800">
                                    ₹{returnData.returnRequest?.refundAmount?.toLocaleString("en-IN")}
                                </p>
                            </div>
                            <div className={`px-3 py-1 rounded-full text-xs font-medium border uppercase  ${getStatusColor(returnData?.returnRequest?.returnStatus)}`}>
                                {returnData?.returnRequest?.returnStatus}
                            </div>
                        </div>

                        <div>
                            <p className="text-sm font-medium text-slate-700 mb-1">Reason</p>
                            <p className="text-sm text-slate-600 line-clamp-2">
                                {returnData.returnRequest?.reason}
                            </p>
                        </div>
                    </div>
                </div>
            </div>


            {
                returnData?.returnRequest?.returnStatus == "requested" &&
                <div className="flex gap-3 mt-4 pt-4 border-t border-slate-200">
                    <AssignDeliveryPartnerForReturn returnID={returnData?.returnRequest?._id} orderID={returnData.returnRequest.orderId} itemID={returnData.returnRequest.itemId}></AssignDeliveryPartnerForReturn>
                </div>
            }

            {
                (
                    returnData?.returnRequest?.returnStatus === "pickedUp" ||
                    returnData?.returnRequest?.returnStatus === "received" ||
                    returnData?.returnRequest?.returnStatus === "approved"
                ) && (
                    <div className="flex gap-3 mt-4 pt-4 border-t border-slate-200">
                        <ReturnStatusActions
                            status={returnData.returnRequest.returnStatus}
                            returnID={returnData.returnRequest._id}
                            orderID={returnData.returnRequest.orderId}
                            itemID={returnData.returnRequest.itemId}
                        />
                    </div>
                )
            }

        </Card >
    );
};

const AssignDeliveryPartnerForReturn = ({ returnID, orderID, itemID }) => {
    const [partners, setPartners] = useState([]);
    const [selectedPartner, setSelectedPartner] = useState(null);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        async function fetchPartners() {
            setLoading(true);
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/delivery/all`, { withCredentials: true });
                setPartners(response.data.partners || [])
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
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/seller/order/return`,
                { returnID, orderID, itemID, partnerID: selectedPartner },
                { withCredentials: true }
            );
            console.log(response.data);
            if (response.data.success) dispatch(setReturnDeliveryPartner({ partnerID: selectedPartner, returnID }));
            setOpen(false)
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };


    if (loading) return <p>Loading...</p>;


    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-green-600 hover:bg-green-700 text-white">
                    Assign Delivery Partner
                </Button>
            </DialogTrigger>
            <DialogContent>
                <AlertDialogHeader>
                    <DialogTitle>Select a Delivery Partner</DialogTitle>
                </AlertDialogHeader>
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
            </DialogContent>
        </Dialog>
    )
}

const ReturnStatusActions = ({ status, returnID, orderID, itemID }) => {
    const [loading, setLoading] = useState(false);

    const dispatch = useDispatch()

    async function handleNext(nextStatus) {
        try {
            setLoading(true);

            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/seller/return/update-status`,
                {
                    returnID,
                    orderID,
                    itemID,
                    nextStatus
                },
                { withCredentials: true }
            );

            console.log(response.data);
            if (response?.data?.success) {
                dispatch(updateReturnStatus({ returnID, status: nextStatus }))
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    let action = null;

    if (status === "pickedUp") {
        action = (
            <Button
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                onClick={() => handleNext("received")}
                disabled={loading}
            >
                {loading ? "Updating..." : "Mark as Received"}
            </Button>
        );
    }

    if (status === "received") {
        action = (
            <Button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => handleNext("approved")}
                disabled={loading}
            >
                {loading ? "Updating..." : "Approve Return"}
            </Button>
        );
    }

    if (status === "approved") {
        action = (
            <Button
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                onClick={() => handleNext("refunded")}
                disabled={loading}
            >
                {loading ? "Processing..." : "Request Refund"}
            </Button>
        );
    }

    return <>{action}</>;
};





