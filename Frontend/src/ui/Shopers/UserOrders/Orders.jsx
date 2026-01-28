import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import { formatDate } from "@/utils/formatDate";
import { Search, ChevronLeft, ChevronRight, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useUserOrders } from "@/hooks/shopper/useUserOrder";
import OrdersSkeleton from "./OrdersSkeleton";

const Orders = () => {
    const { isAuthenticated } = useSelector((store) => store.auth);
    const [page, setPage] = useState(1);
    const [searchText, setSearchText] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    const navigate = useNavigate();

    if (!isAuthenticated) return <Navigate to="/" replace />;

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchText);
            setPage(1);
        }, 500);

        return () => clearTimeout(timer);
    }, [searchText]);

    const { data, isLoading, isError, error, isFetching } = useUserOrders({ search: debouncedSearch, page });

    const orders = data?.orders || [];
    const pages = data?.pages || 1;

    const getStatusBadge = (status) => {
        const colors = {
            ordered: "bg-orange-100 text-orange-800 border-orange-200",
            packed: "bg-yellow-100 text-yellow-800 border-yellow-200",
            shipped: "bg-amber-100 text-amber-800 border-amber-200",
            "out-for-delivery": "bg-amber-100 text-amber-800 border-amber-200",
            delivered: "bg-green-100 text-green-800 border-green-200",
            cancelled: "bg-red-100 text-red-800 border-red-200",
            returned: "bg-red-100 text-red-800 border-red-200",
        };

        return (
            <Badge
                variant="outline"
                className={`${colors[status]} uppercase text-xs`}
            >
                {status}
            </Badge>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 py-6 sm:py-8">
            <div className="max-w-4xl mx-auto px-3 sm:px-4">

                {/* Search */}
                <div className="flex justify-center mb-6 sm:mb-8">
                    <div className="flex items-center bg-white border border-gray-300 rounded-lg px-3 py-2 sm:px-4 sm:py-3 w-full max-w-xl">
                        <Search className="text-gray-500 w-4 h-4 sm:w-5 sm:h-5" />
                        <input
                            type="text"
                            placeholder="Search your orders..."
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            className="ml-3 w-full outline-none text-sm bg-transparent"
                        />
                    </div>
                </div>

                {/* Loader */}
                {isLoading && <OrdersSkeleton></OrdersSkeleton>}


                {isError && (
                    <p className="text-red-500 text-center mt-4">
                        {error?.message || "Failed to load orders"}
                    </p>
                )}

                {/* Empty State */}
                {!isLoading && orders.length === 0 && (
                    <div className="text-center py-16">
                        <Package className="w-14 h-14 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            No orders found
                        </h3>
                        <Button
                            onClick={() => navigate("/")}
                            className="bg-amber-500 hover:bg-amber-600 text-white"
                        >
                            Start Shopping
                        </Button>
                    </div>
                )}

                {/* Orders */}
                <div className="space-y-5">
                    {orders.map((order) => (
                        <div
                            key={order._id}
                            onClick={() => navigate(`/order/${order._id}`)}
                            className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition cursor-pointer overflow-hidden"
                        >
                            {/* Header */}
                            <div className="bg-gray-50 px-4 py-3 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 border-b">
                                <div>
                                    <p className="text-xs text-gray-500 font-medium">
                                        ORDER PLACED
                                    </p>
                                    <p className="text-sm font-semibold text-gray-900">
                                        {formatDate(order.createdAt)}
                                    </p>
                                </div>
                                <div className="sm:text-right">
                                    <p className="text-xs text-gray-500 font-medium">
                                        TOTAL
                                    </p>
                                    <p className="text-lg font-bold text-gray-900">
                                        ₹{order.amount.toLocaleString("en-IN")}
                                    </p>
                                </div>
                            </div>

                            {/* Items */}
                            <div className="px-4 py-4 space-y-4">
                                {order.items.map((item) => (
                                    <div
                                        key={item._id}
                                        className="flex gap-3 sm:gap-4"
                                    >
                                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-lg border flex items-center justify-center flex-shrink-0">
                                            <img
                                                src={item.product?.images?.[0]?.url}
                                                alt={item.product?.name}
                                                className="w-14 h-14 sm:w-16 sm:h-16 object-contain"
                                            />
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-sm sm:text-base text-gray-900 line-clamp-2">
                                                {item.product?.name}
                                            </p>
                                            <p className="text-xs sm:text-sm text-gray-600 mt-1">
                                                Qty: {item.quantity} • ₹
                                                {item.lockedPrice.toLocaleString("en-IN")}
                                            </p>
                                            <div className="mt-2">
                                                {getStatusBadge(item.status)}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination */}
                {pages > 1 && (
                    <div className="flex flex-wrap justify-center items-center gap-2 mt-10">
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={page === 1}
                            onClick={() => setPage((p) => p - 1)}
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </Button>

                        {Array.from({ length: pages }).map((_, i) => (
                            <Button
                                key={i}
                                size="sm"
                                variant={page === i + 1 ? "default" : "outline"}
                                onClick={() => setPage(i + 1)}
                                className={`w-9 h-9 p-0 ${page === i + 1
                                    ? "bg-amber-500 hover:bg-amber-600"
                                    : ""
                                    }`}
                            >
                                {i + 1}
                            </Button>
                        ))}

                        <Button
                            variant="outline"
                            size="sm"
                            disabled={page === pages}
                            onClick={() => setPage((p) => p + 1)}
                        >
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Orders;
