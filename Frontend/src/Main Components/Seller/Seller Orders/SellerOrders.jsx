import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { formatDate } from "@/utils/formatDate";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { fetchAllSellerOrders, setSellerSingleOrder } from "@/Redux/sellerSlice";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User } from "lucide-react";


export default function SellerOrders() {
    const { orders } = useSelector((store) => store.seller);
    const [selectRange, setSelectRange] = useState("today")
    const [page, setPage] = useState(1);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    function orderDetails(order) {
        dispatch(setSellerSingleOrder(order));
        navigate(`/seller/order/${order?._id}`);
    }

    useEffect(() => {
        dispatch(fetchAllSellerOrders({ range: selectRange, page }));
    }, [selectRange, page]);


    function checkDeliveryStatusPerItem(order) {
        return order.items.every((i) => i.status === "delivered")
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header Section */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-blue-700 bg-clip-text text-transparent pb-2">
                        Order Management
                    </h1>
                    <p className="text-slate-600 mt-2">Manage and track your customer orders</p>
                </div>



                <div className="my-5">
                    <Select value={selectRange} onValueChange={(value) => setSelectRange(value)}>
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


                {orders?.orderLoading && (
                    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 p-6">
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
                )}

                {/* Orders List */}
                {orders.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="w-24 h-24 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
                            <svg className="w-12 h-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                        </div>
                        <p className="text-slate-500 text-lg font-medium">No orders found</p>
                        <p className="text-slate-400 text-sm mt-1">
                            {searchTerm ? "Try adjusting your search terms" : "Orders will appear here once customers start purchasing"}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.allOrders.map((order) => (
                            <Card
                                key={order._id}
                                className="
                                    p-6 border border-slate-200 
                                    shadow-sm hover:shadow-lg 
                                    rounded-2xl
                                    transition-all duration-300 
                                    bg-white/90 backdrop-blur-sm
                                    hover:border-blue-300
                                    cursor-pointer
                                    group
                                    hover:-translate-y-1
                                "
                                onClick={() => orderDetails(order)}
                            >
                                <div className="flex justify-between items-start gap-6">
                                    {/* LEFT SIDE */}
                                    <div className="space-y-3 flex-1">
                                        <div className="flex items-center gap-3">
                                            <p className="font-bold text-slate-800 text-lg group-hover:text-blue-700 transition-colors">
                                                Order #{order._id.slice(-8).toUpperCase()}
                                            </p>
                                            <div className="flex gap-2">
                                                <span
                                                    className={`px-3 py-1 text-xs rounded-full font-semibold capitalize border ${order.paymentStatus === "paid"
                                                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                                        : "bg-rose-50 text-rose-700 border-rose-200"
                                                        }`}
                                                >
                                                    Payment Status :  {order.paymentStatus}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                            <div className="space-y-1">
                                                <p className="text-slate-500 text-xs font-medium">CUSTOMER</p>
                                                <p className=" flex items-center gap-2 font-medium text-slate-800">
                                                    <User size={14} className="text-slate-500" />
                                                    {order.customer?.username || "N/A"}
                                                </p>
                                            </div>

                                            <div className="space-y-1">
                                                <p className="text-slate-500 text-xs font-medium">ORDER DATE</p>
                                                <p className="font-medium text-slate-800">
                                                    {formatDate(order.createdAt)}
                                                </p>
                                            </div>

                                            <div className="space-y-1">
                                                <p className="text-slate-500 text-xs font-medium">SHIP TO</p>
                                                <p className="font-medium text-slate-800">
                                                    {order.address?.city}, {order.address?.state}
                                                </p>
                                            </div>
                                        </div>

                                        {checkDeliveryStatusPerItem(order) &&
                                            <Badge className="bg-green-400">
                                                <p className="uppercase">delivered</p>
                                            </Badge>
                                        }

                                    </div>

                                    {/* RIGHT SIDE AMOUNT */}
                                    <div className="flex flex-col items-end min-w-[160px]">
                                        <p className="text-xs text-slate-500 tracking-wide font-medium mb-2">
                                            TOTAL AMOUNT
                                        </p>

                                        <div
                                            className="
                                                px-6 py-3
                                                rounded-2xl
                                                bg-gradient-to-r from-blue-500 to-blue-600
                                                text-white
                                                font-bold
                                                text-xl
                                                shadow-lg
                                                border border-blue-600
                                                group-hover:from-blue-600 group-hover:to-blue-700
                                                transition-all
                                            "
                                        >
                                            ₹{order?.sellerTotalAmount?.toLocaleString("en-IN")}
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}


                {
                    orders.totalPages > 1 && (
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
                                disabled={page === orders.totalPages}
                                onClick={() => setPage(prev => prev + 1)}
                            >
                                Next
                            </Button>
                        </div>
                    )
                }
            </div>
        </div>
    );
}



