import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useNavigate } from 'react-router-dom';
import { formatDate } from '@/utils/formatDate';
import { Search, ChevronLeft, ChevronRight, Package } from "lucide-react";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useUserOrders } from '@/hooks/shopper/useUserOrder';

const Orders = () => {
    const { isAuthenticated } = useSelector((store) => store.auth);
    const [page, setPage] = useState(1);
    const [searchText, setSearchText] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState(searchText);

    const navigate = useNavigate()

    if (!isAuthenticated) return <Navigate to="/" replace />;

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(searchText);
            setPage(1)
        }, 500);
        return () => clearTimeout(handler);
    }, [searchText]);

    const { data, isLoading, isError, error, isFetching } = useUserOrders({ search: debouncedSearch, page })
    const orders = data?.orders || [];
    const pages = data?.pages || 1;

    const orderDetails = (order) => {
        navigate(`/order/${order._id}`);
    };

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
        return <Badge variant="outline" className={`${colors[status]} uppercase text-xs`}>{status}</Badge>;
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">

                {/* Search Bar */}
                <div className="flex justify-center mb-8">
                    <div className="flex items-center bg-white shadow-sm border border-gray-300 rounded-lg px-4 py-3 w-full max-w-xl hover:border-gray-400 transition-colors">
                        <Search className="text-gray-500 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search your orders..."
                            value={searchText}
                            onChange={(e) => { setSearchText(e.target.value) }}
                            // onKeyDown={(e) => handleKeyDown(e)}
                            className="ml-3 w-full outline-none text-sm bg-transparent"
                        />
                    </div>
                </div>

                {/* Loader */}
                {isLoading && (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500 mx-auto"></div>
                        <p className="text-gray-500 mt-3">Loading orders...</p>
                    </div>
                )}

                {isFetching && !isLoading && <p className="text-center text-gray-500 mt-2">Updating...</p>}
                {isError && <p className="text-red-500 text-center mt-4">{error.message || "Failed to load orders"}</p>}


                {/* No Orders */}
                {orders.length === 0 && (
                    <div className="text-center py-16 rounded-xl">
                        <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders found</h3>
                        <Button
                            onClick={() => navigate('/')}
                            className="bg-amber-500 hover:bg-amber-600 text-white"
                        >
                            Start Shopping
                        </Button>
                    </div>
                )}

                {/* Orders List */}
                <div className="space-y-6">
                    {orders.map((order) => (
                        <div
                            key={order._id}
                            onClick={() => orderDetails(order)}
                            className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300 transition-all duration-200 cursor-pointer overflow-hidden"
                        >
                            {/* Header */}
                            <div className="bg-gray-50 px-6 py-4 flex justify-between items-center border-b border-gray-200">
                                <div className="space-y-1">
                                    <p className="text-xs text-gray-600 font-medium">ORDER PLACED</p>
                                    <p className="text-sm font-semibold text-gray-900">{formatDate(order.createdAt)}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-gray-600 font-medium">TOTAL</p>
                                    <p className="text-lg font-bold text-gray-900">
                                        ₹{order.amount.toLocaleString("en-IN")}
                                    </p>
                                </div>
                            </div>

                            {/* Items */}
                            <div className="px-6 py-5 space-y-5">
                                {order.items.map((item) => (
                                    <div key={item._id} className="flex gap-4 group">
                                        <div className="w-20 h-20 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center flex-shrink-0">
                                            <img
                                                src={item.product?.images?.[0]?.url}
                                                className="w-16 h-16 object-contain"
                                                alt={item.product?.name}
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-gray-900 group-hover:text-amber-600 transition-colors line-clamp-2">
                                                {item.product?.name}
                                            </p>
                                            <p className="text-sm text-gray-600 mt-1">
                                                Qty: {item.quantity} • ₹{item.lockedPrice.toLocaleString("en-IN")}
                                            </p>
                                            <div className="mt-3">
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
                    <div className="flex justify-center items-center gap-2 mt-12">
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={page === 1}
                            onClick={() => setPage((p) => p - 1)}
                            className="border-gray-300 hover:bg-gray-50"
                        >
                            <ChevronLeft className="w-4 h-4" />
                            Previous
                        </Button>

                        <div className="flex items-center gap-1">
                            {Array.from({ length: pages }).map((_, index) => (
                                <Button
                                    key={index}
                                    variant={page === index + 1 ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setPage(index + 1)}
                                    className={`w-10 h-10 p-0 ${page === index + 1 ? 'bg-amber-500 hover:bg-amber-600' : 'border-gray-300 hover:bg-gray-50'}`}>
                                    {index + 1}
                                </Button>
                            ))}
                        </div>

                        <Button
                            variant="outline"
                            size="sm"
                            disabled={page === pages}
                            onClick={() => setPage((p) => p + 1)}
                            className="border-gray-300 hover:bg-gray-50"
                        >
                            Next
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Orders;