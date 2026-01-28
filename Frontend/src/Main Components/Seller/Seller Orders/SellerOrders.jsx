import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { formatDate } from "@/utils/formatDate";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { markSellerNotificationsRead } from "@/Redux/sellerSlice";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Package, User } from "lucide-react";
import { useSellerOrders } from "@/hooks/seller/useSellerOrders";

export default function SellerOrders() {
    const { notifications } = useSelector((store) => store.seller);
    const [selectRange, setSelectRange] = useState();
    const [page, setPage] = useState(1);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { data, isLoading: ordersLoading } = useSellerOrders({ range: selectRange, page });
    const orders = data?.orders;
    const totalPages = data?.totalPages;

    function orderDetails(order) {
        navigate(`/seller/order/${order?._id}`);
    }

    useEffect(() => {
        dispatch(markSellerNotificationsRead());
    }, [notifications?.data]);

    function checkDeliveryStatusPerItem(order) {
        return order.items.every((i) => i.status === "delivered");
    }

    return (
        <div className="min-h-screen px-4 py-6">
            <div className="max-w-6xl mx-auto">
             
                <div className="mb-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <Package className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                        </div>
                        <h1 className="text-xl font-bold bg-gradient-to-r from-slate-800 to-blue-700 bg-clip-text text-transparent">
                            Order Management
                        </h1>
                    </div>
                    <p className="text-slate-600 text-sm">
                        Manage and track your customer orders
                    </p>
                </div>


                {/* Filter Section */}
                <div className="my-5">
                    <Select value={selectRange} onValueChange={(value) => setSelectRange(value)}>
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

                {/* Loading State */}
                {ordersLoading && (
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

                {/* Orders List */}
                {!ordersLoading && orders?.length === 0 ? (
                    <div className="text-center py-12 sm:py-16">
                        <div className="w-16 h-16 sm:w-24 sm:h-24 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
                            <svg className="w-8 h-8 sm:w-12 sm:h-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                        </div>
                        <p className="text-slate-500 text-base sm:text-lg font-medium">No orders found</p>
                        <p className="text-slate-400 text-xs sm:text-sm mt-1">
                            {selectRange && selectRange !== "all" ? "Try selecting a different time range" : "Orders will appear here once customers start purchasing"}
                        </p>
                    </div>
                ) : (
                    !ordersLoading && (
                        <div className="space-y-4">
                            {(orders || []).map((order) => (
                                <Card
                                    key={order._id}
                                    className="
                                        p-4 sm:p-6 border border-slate-200 
                                        shadow-sm hover:shadow-lg 
                                        rounded-xl sm:rounded-2xl
                                        transition-all duration-300 
                                        bg-white/90 backdrop-blur-sm
                                        hover:border-blue-300
                                        cursor-pointer
                                        group
                                        hover:-translate-y-1
                                    "
                                    onClick={() => orderDetails(order)}
                                >
                                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4 sm:gap-6">
                                        {/* LEFT SIDE */}
                                        <div className="space-y-3 flex-1 w-full">
                                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                                                <p className="font-bold text-slate-800 text-base sm:text-lg group-hover:text-blue-700 transition-colors">
                                                    Order #{order._id.slice(-8).toUpperCase()}
                                                </p>
                                                <div className="flex flex-wrap gap-2">
                                                    <span
                                                        className={`px-2 py-1 text-xs rounded-full font-semibold capitalize border ${order.paymentStatus === "paid"
                                                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                                            : "bg-rose-50 text-rose-700 border-rose-200"
                                                            }`}
                                                    >
                                                        {order.paymentStatus === "paid" ? "Paid" : "Pending"}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 text-sm">
                                                <div className="space-y-1">
                                                    <p className="text-slate-500 text-xs font-medium">CUSTOMER</p>
                                                    <p className="flex items-center gap-2 font-medium text-slate-800">
                                                        <User size={14} className="text-slate-500 flex-shrink-0" />
                                                        <span className="truncate">{order.customer?.username || "N/A"}</span>
                                                    </p>
                                                </div>

                                                <div className="space-y-1">
                                                    <p className="text-slate-500 text-xs font-medium">ORDER DATE</p>
                                                    <p className="font-medium text-slate-800 truncate">
                                                        {formatDate(order.createdAt)}
                                                    </p>
                                                </div>

                                                <div className="space-y-1">
                                                    <p className="text-slate-500 text-xs font-medium">SHIP TO</p>
                                                    <p className="font-medium text-slate-800 truncate">
                                                        {order.address?.city || "N/A"}, {order.address?.state || "N/A"}
                                                    </p>
                                                </div>
                                            </div>

                                            {checkDeliveryStatusPerItem(order) && (
                                                <Badge className="bg-green-400 w-fit">
                                                    <p className="uppercase text-xs">delivered</p>
                                                </Badge>
                                            )}
                                        </div>

                                        {/* RIGHT SIDE AMOUNT */}
                                        <div className="flex flex-col items-start sm:items-end min-w-0 w-full sm:w-auto">
                                            <p className="text-xs text-slate-500 tracking-wide font-medium mb-2">
                                                TOTAL AMOUNT
                                            </p>

                                            <div
                                                className="
                                                    px-4 sm:px-6 py-2 sm:py-3
                                                    rounded-xl sm:rounded-2xl
                                                    bg-gradient-to-r from-blue-500 to-blue-600
                                                    text-white
                                                    font-bold
                                                    text-lg sm:text-xl
                                                    shadow-lg
                                                    border border-blue-600
                                                    group-hover:from-blue-600 group-hover:to-blue-700
                                                    transition-all
                                                    w-full sm:w-auto text-center sm:text-right
                                                "
                                            >
                                                ₹{order?.sellerTotalAmount?.toLocaleString("en-IN")}
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex flex-col sm:flex-row justify-center items-center mt-8 gap-3">
                        <div className="flex gap-3 w-full sm:w-auto">
                            <Button
                                className="flex-1 sm:flex-none sm:w-24"
                                variant="outline"
                                disabled={page === 1}
                                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                            >
                                Previous
                            </Button>

                            <div className="px-4 sm:px-5 py-2 rounded-xl bg-white shadow-sm border border-slate-300 font-semibold text-slate-700 flex items-center justify-center min-w-[80px]">
                                Page {page}
                            </div>

                            <Button
                                className="flex-1 sm:flex-none sm:w-24"
                                variant="outline"
                                disabled={page === totalPages}
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