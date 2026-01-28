import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { markSellerReturnNotificationsRead } from "@/Redux/sellerSlice";
import { Card } from "@/components/ui/card";
import { Package, User, MapPin } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialogHeader } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSellerReturn } from "@/hooks/seller/useSellerReturn";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSellerDeliveryPartner } from "@/hooks/seller/useSellerDeliveryPartner";
import { sellerAssingDeliveryPartnerToReturnAPI, sellerUpdateReturnStatusAPI } from "@/api/seller.api";

export default function SellerReturnRequests() {
    const [page, setPage] = useState(1);
    const [dateFilter, setDateFilter] = useState("");
    const { returnNotification } = useSelector((store) => store.seller);

    const dispatch = useDispatch();
    const { data, isLoading: loading } = useSellerReturn({ filter: dateFilter, page });

    const returns = data?.items;
    const pages = data?.pages;

    useEffect(() => {
        dispatch(markSellerReturnNotificationsRead());
    }, [page, dateFilter, returnNotification?.data]);

    return (
        <div className="min-h-screen px-4 py-6 ">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <Package className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                        </div>
                        <h1 className="text-xl font-bold bg-gradient-to-r from-slate-800 to-blue-700 bg-clip-text text-transparent">
                            Return Management
                        </h1>
                    </div>
                    <p className="text-slate-600 text-sm">Manage customer return requests</p>
                </div>

                {/* Filter */}
                <div className="my-5">
                    <Select value={dateFilter} onValueChange={(value) => setDateFilter(value)}>
                        <SelectTrigger className="w-full sm:w-[180px]">
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

                {loading && (
                    <div className="animate-pulse space-y-4">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-slate-200">
                                <div className="flex flex-col sm:flex-row justify-between gap-4">
                                    <div className="space-y-3 flex-1">
                                        <div className="h-6 bg-slate-200 rounded w-32 sm:w-48"></div>
                                        <div className="h-4 bg-slate-200 rounded w-24 sm:w-32"></div>
                                        <div className="h-4 bg-slate-200 rounded w-20 sm:w-24"></div>
                                    </div>
                                    <div className="h-10 sm:h-12 bg-slate-200 rounded-2xl w-full sm:w-32"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Returns List */}
                <div className="space-y-4">
                    {!loading && returns?.length === 0 ? (
                        <div className="text-center my-12 sm:my-15">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
                                <Package className="w-8 h-8 sm:w-10 sm:h-10 text-slate-400" />
                            </div>
                            <p className="text-slate-600 text-base sm:text-lg font-medium">No return requests</p>
                            <p className="text-slate-500 text-xs sm:text-sm mt-1">Return requests will appear here</p>
                        </div>
                    ) : (
                        !loading &&
                        (returns || []).map((R) => (
                            <ReturnRequestCard key={R.returnRequest._id} returnData={R} />
                        ))
                    )}
                </div>

                {pages > 1 && (
                    <div className="flex flex-col sm:flex-row justify-center items-center mt-8 gap-3">
                        <div className="flex gap-3 w-full sm:w-auto">
                            <Button
                                className="flex-1 sm:flex-none sm:w-24 text-sm sm:text-base"
                                variant="outline"
                                disabled={page === 1}
                                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                            >
                                Previous
                            </Button>

                            <div className="px-4 sm:px-5 py-2 rounded-xl bg-white shadow-sm border border-slate-300 font-semibold text-slate-700 flex items-center justify-center min-w-[80px] text-sm sm:text-base">
                                Page {page}
                            </div>

                            <Button
                                className="flex-1 sm:flex-none sm:w-24 text-sm sm:text-base"
                                variant="outline"
                                disabled={page === pages}
                                onClick={() => setPage((prev) => prev + 1)}
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
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
        <Card className="bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg border border-slate-200 p-4 sm:p-5 hover:shadow-xl transition-all duration-300">
            <div className="flex flex-col sm:flex-row gap-4">
                {/* Product Image */}
                <div className="flex-shrink-0 self-center sm:self-start">
                    <img
                        src={returnData.product?.images?.[0]?.url}
                        alt={returnData.product?.name}
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover border border-slate-200"
                    />
                </div>

                {/* Main Content - Compact Layout */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Product & Customer Info */}
                    <div className="space-y-3">
                        <div>
                            <h3 className="font-semibold text-slate-800 text-base sm:text-lg line-clamp-2">
                                {returnData.product?.name}
                            </h3>
                            <div className="flex items-center gap-3 sm:gap-4 mt-1 text-xs sm:text-sm text-slate-600">
                                <span>₹{returnData.product?.price?.toLocaleString("en-IN")}</span>
                                <span>•</span>
                                <span>Qty: {returnData.quantity}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 text-xs sm:text-sm">
                            <User size={12} className="sm:w-3.5 sm:h-3.5 text-slate-500" />
                            <span className="font-medium text-slate-700 truncate">{returnData.customer?.username}</span>
                        </div>
                    </div>

                    {/* Address Info */}
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <MapPin size={12} className="sm:w-3.5 sm:h-3.5 text-slate-500" />
                            <span className="text-xs sm:text-sm font-medium text-slate-700">Delivery Address</span>
                        </div>
                        <div className="text-xs sm:text-sm text-slate-600 space-y-1">
                            <p className="font-medium truncate">{returnData.address?.name}</p>
                            <p className="line-clamp-2">{returnData.address?.address}</p>
                            <p>{returnData.address?.city} - {returnData.address?.pinCode}</p>
                        </div>
                    </div>

                    {/* Return Details */}
                    <div className="space-y-3">
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-2 sm:gap-0">
                            <div className="min-w-0">
                                <p className="text-xs sm:text-sm font-medium text-slate-700">Refund Amount</p>
                                <p className="text-base sm:text-lg font-bold text-slate-800">
                                    ₹{returnData.returnRequest?.refundAmount?.toLocaleString("en-IN")}
                                </p>
                            </div>
                            <div className={`px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs font-medium border uppercase ${getStatusColor(returnData?.returnRequest?.returnStatus)}`}>
                                {returnData?.returnRequest?.returnStatus}
                            </div>
                        </div>

                        <div>
                            <p className="text-xs sm:text-sm font-medium text-slate-700 mb-1">Reason</p>
                            <p className="text-xs sm:text-sm text-slate-600 line-clamp-2">
                                {returnData.returnRequest?.reason}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {returnData?.returnRequest?.returnStatus == "requested" && (
                <div className="flex gap-3 mt-4 pt-4 border-t border-slate-200">
                    <AssignDeliveryPartnerForReturn
                        returnID={returnData?.returnRequest?._id}
                        orderID={returnData.returnRequest.orderId}
                        itemID={returnData.returnRequest.itemId}
                    />
                </div>
            )}

            {(returnData?.returnRequest?.returnStatus === "pickedUp" ||
                returnData?.returnRequest?.returnStatus === "received" ||
                returnData?.returnRequest?.returnStatus === "approved") && (
                    <div className="flex gap-3 mt-4 pt-4 border-t border-slate-200">
                        <ReturnStatusActions
                            status={returnData.returnRequest.returnStatus}
                            returnID={returnData.returnRequest._id}
                            orderID={returnData.returnRequest.orderId}
                            itemID={returnData.returnRequest.itemId}
                        />
                    </div>
                )}
        </Card>
    );
};

const ReturnStatusActions = ({ status, returnID, orderID, itemID }) => {
    const queryClient = useQueryClient();

    const { mutate: handleReturnStatus, isPending: loading } = useMutation({
        mutationFn: sellerUpdateReturnStatusAPI,
        onSuccess: () => {
            queryClient.invalidateQueries(["sellerReturns"]);
        }
    });

    function handleNext(nextStatus) {
        handleReturnStatus({ returnID, orderID, itemID, nextStatus });
    }

    let action = null;
    if (status === "pickedUp") {
        action = (
            <Button
                className="w-full bg-green-600 hover:bg-green-700 text-white text-sm sm:text-base"
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
                className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base"
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
                className="w-full bg-purple-600 hover:bg-purple-700 text-white text-sm sm:text-base"
                onClick={() => handleNext("refunded")}
                disabled={loading}
            >
                {loading ? "Processing..." : "Request Refund"}
            </Button>
        );
    }

    return <>{action}</>;
};

const AssignDeliveryPartnerForReturn = ({ returnID, orderID, itemID }) => {
    const [partners, setPartners] = useState([]);
    const [selectedPartner, setSelectedPartner] = useState(null);
    const [open, setOpen] = useState(false);

    const queryClient = useQueryClient();
    const { data } = useSellerDeliveryPartner();
    useEffect(() => {
        setPartners(data?.partners);
    }, [data]);

    const { mutate: handleAssignDeliveryPartner, isPending: loading } = useMutation({
        mutationFn: sellerAssingDeliveryPartnerToReturnAPI,
        onSuccess: () => {
            queryClient.invalidateQueries(["sellerReturns"]);
        }
    });

    async function handleAssign() {
        if (!selectedPartner) return;
        handleAssignDeliveryPartner({ returnID, orderID, itemID, partnerID: selectedPartner });
        setOpen(false);
    }

    if (loading) return <p className="text-center py-2">Loading...</p>;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto text-sm sm:text-base">
                    Assign Delivery Partner
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <AlertDialogHeader>
                    <DialogTitle className="text-base sm:text-lg">Select a Delivery Partner</DialogTitle>
                </AlertDialogHeader>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                    {partners?.map((p) => (
                        <div
                            key={p?._id}
                            className={`border p-2 sm:p-3 rounded-lg flex justify-between items-center cursor-pointer ${selectedPartner === p._id ? "border-blue-600 bg-blue-50" : "border-slate-300"}`}
                            onClick={() => setSelectedPartner(p._id)}
                        >
                            <div className="min-w-0 flex-1">
                                <p className="font-semibold text-sm sm:text-base truncate">{p.username}</p>
                                <p className="text-xs sm:text-sm text-slate-600">📞 {p.phone}</p>
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
            </DialogContent>
        </Dialog>
    );
};