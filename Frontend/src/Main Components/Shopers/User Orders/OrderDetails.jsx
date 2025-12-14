import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatDate } from "@/utils/formatDate";
import { useNavigate } from "react-router-dom";
import { CheckCircle, Circle, MapPin, CreditCard, Package, ShoppingBag, Calendar, Phone, ArrowRight, Copy, Star, ThumbsUp, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import UserReturn from "./UserReturn";
import { fetchUserReviews } from "@/Redux/userSlice";
import UserReview from "./UserReview";
import axios from "axios";

const OrderDetails = () => {
    const { order, userReviews } = useSelector((store) => store.user);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        dispatch(fetchUserReviews())
    }, [order, userReviews])

    const copyOrderId = () => {
        navigator.clipboard.writeText(order._id);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const statusFlow = ["ordered", "packed", "shipped", "out-for-delivery", "delivered"];
    const getTimeline = (currentStatus) =>
        statusFlow.map((step) => ({
            step,
            completed: statusFlow.indexOf(step) <= statusFlow.indexOf(currentStatus),
            current: step === currentStatus,
        }));

    const returnFlow = ["requested", "in-transit", "received", "approved", "refunded"];
    const getReturnTimeline = (currentStatus) =>
        returnFlow.map((step) => ({
            step,
            completed: returnFlow.indexOf(step) <= returnFlow.indexOf(currentStatus),
            current: step === currentStatus,
        }));

    function checkReview(item) {
        if (!userReviews) return false;
        return userReviews.find((r) => r?.product._id?.toString() === item?.product._id?.toString()) || false;
    }

    async function deleteReview(id, productID) {
        try {
            const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/product/delete/review/${id}`,
                {
                    data: { productID },
                    withCredentials: true
                }
            );
            console.log(response);
        } catch (error) {
            console.log(error);
        }
    }

    if (!order) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center p-8">
                <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Order Selected</h3>
                <p className="text-gray-600 mb-4">Please select an order to view details</p>
                <Button onClick={() => navigate('/orders')}>View All Orders</Button>
            </div>
        </div>
    )

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-6xl mx-auto px-4">
                {/* Header with Order ID */}
                <div className="mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                        <div className="flex items-center gap-4">
                            <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="shrink-0">
                                <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
                                Back
                            </Button>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Order Details</h1>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-sm text-gray-500">Order ID:</span>
                                    <code className="text-sm bg-gray-100 px-2 py-1 rounded-md font-mono">
                                        {order._id}
                                    </code>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={copyOrderId}
                                        className="h-6 w-6 p-0 hover:bg-gray-200"
                                    >
                                        <Copy className="w-3 h-3" />
                                    </Button>
                                    {copied && (
                                        <span className="text-xs text-green-600 font-medium animate-fade-in">
                                            Copied!
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Order Date and Status Badge */}
                        <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-lg border border-gray-200">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Calendar className="w-4 h-4" />
                                <span>{formatDate(order?.createdAt)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* -------- RIGHT SIDEBAR -------- */}
                    <div className="space-y-6">
                        {/* ORDER SUMMARY */}
                        <Card className="border-gray-200 shadow-sm">
                            <CardHeader className="">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <ShoppingBag className="w-5 h-5 text-amber-500" />
                                    Order Summary
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-600">Order Date</span>
                                    <span className="font-medium">{formatDate(order?.createdAt)}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-600">Item Total</span>
                                    <span className="font-medium">{order?.items?.reduce((total, item) => total + item.subtotal, 0) || 0}</span>
                                </div>
                                <Separator />
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-600">Platform Fees</span>
                                    <span className="font-medium">{order?.platformFees}</span>
                                </div>
                                <Separator />
                                <div className="flex justify-between items-center font-semibold">
                                    <span>Total Amount</span>
                                    <span className="text-lg">₹{order?.amount?.toLocaleString("en-IN")}</span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* DELIVERY ADDRESS */}
                        <Card className="border-gray-200 shadow-sm">
                            <CardHeader className="">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <MapPin className="w-5 h-5 text-amber-500" />
                                    Delivery Address
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div>
                                    <p className="font-semibold text-gray-900">{order.address?.name}</p>
                                    <p className="text-sm text-gray-600 mt-1">{order.address?.address}</p>
                                    <p className="text-sm text-gray-600">
                                        {order?.address?.city}, {order?.address?.state} - {order?.address?.pinCode}
                                    </p>
                                </div>
                                <Separator />
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Phone className="w-4 h-4" />
                                    <span>{order?.address?.phoneNumber}</span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* PAYMENT INFO */}
                        <Card className="border-gray-200 shadow-sm">
                            <CardHeader className="">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <CreditCard className="w-5 h-5 text-amber-500" />
                                    Payment Info
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Mode</span>
                                    <Badge variant="outline" className="capitalize">
                                        {order?.paymentMode}
                                    </Badge>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Status</span>
                                    <Badge className={
                                        order?.paymentStatus === "paid"
                                            ? "bg-green-100 text-green-800 hover:bg-green-100 uppercase"
                                            : "bg-red-100 text-red-800 hover:bg-red-100 uppercase"
                                    }>
                                        {order?.paymentStatus}
                                    </Badge>
                                </div>
                                <Separator />
                                <div className="flex justify-between items-center font-semibold">
                                    <span>Amount Paid</span>
                                    <span className="text-lg text-green-600">₹{order?.amount?.toLocaleString("en-IN")}</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* -------- MAIN CONTENT -------- */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* ORDER ITEMS */}
                        <Card className="border-gray-200 shadow-sm">
                            <CardHeader className="">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Package className="w-5 h-5 text-amber-500" />
                                    Order Items ({order?.items?.length})
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {order?.items?.map((item) => {
                                    const timeline = getTimeline(item?.status);
                                    const userReview = checkReview(item)
                                    return (
                                        <div key={item._id} className="border border-gray-200 rounded-xl p-5 space-y-5 hover:border-gray-300 transition-colors">
                                            {/* Product Info */}
                                            <div className="flex gap-4 group">
                                                <div className="w-20 h-20 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center flex-shrink-0 group-hover:border-amber-200 transition-colors">
                                                    <img
                                                        src={item?.product?.images?.[0]?.url}
                                                        alt={item?.product?.name}
                                                        className="w-16 h-16 object-contain pointer"
                                                        onClick={(e) => {
                                                            e.preventDefault()
                                                            e.stopPropagation()
                                                            navigate(`/product/${item?.product?.slug}`);
                                                        }}
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-semibold text-gray-900  line-clamp-2">
                                                        {item?.product?.name}
                                                    </p>
                                                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                                                        <span>Qty: {item.quantity}</span>
                                                        <span className="font-semibold text-gray-900">
                                                            ₹{item?.lockedPrice?.toLocaleString("en-IN")} X {item?.quantity} = {item?.subtotal}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-gray-500 mt-2">
                                                        Seller: {item?.seller?.username}
                                                    </p>
                                                </div>
                                            </div>

                                            {item?.returnStatus === "none" &&
                                                <div className="space-y-3">
                                                    <div className="flex items-center justify-between">
                                                        <h4 className="font-medium text-sm text-gray-900">Delivery Status</h4>
                                                        <Badge variant="outline" className="text-xs capitalize">
                                                            {item?.status?.replace("-", " ")}
                                                        </Badge>
                                                    </div>

                                                    <div className="relative">
                                                        <div className="flex justify-between mb-2">
                                                            {timeline?.map((step, index) => (
                                                                <div key={step.step} className="flex flex-col items-center flex-1">
                                                                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center mb-2 transition-all duration-300 ${step.completed
                                                                        ? "bg-amber-500 border-amber-500 text-white shadow-sm"
                                                                        : step.current
                                                                            ? "border-amber-500 bg-white shadow-sm"
                                                                            : "border-gray-300 bg-white"
                                                                        }`}>
                                                                        {step.completed ? (
                                                                            <CheckCircle className="w-4 h-4" />
                                                                        ) : (
                                                                            <Circle className={`w-4 h-4 ${step.current ? "text-amber-500" : "text-gray-300"
                                                                                }`} />
                                                                        )}
                                                                    </div>
                                                                    <span className={`text-xs text-center capitalize px-1 transition-colors ${step.completed || step.current
                                                                        ? "text-amber-600 font-medium"
                                                                        : "text-gray-400"
                                                                        }`}>
                                                                        {step.step.replace("-", " ")}
                                                                    </span>
                                                                </div>
                                                            ))}
                                                        </div>

                                                        {/* Progress Bar */}
                                                        <div className="absolute top-4 left-4 right-4 h-0.5 bg-gray-200 -z-10">
                                                            <div className="h-full bg-amber-500 transition-all duration-500 ease-out"
                                                                style={{ width: `${(timeline.filter(s => s.completed).length - 1) / (timeline.length - 1) * 100}%` }}
                                                            >
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            }

                                            {item?.returnStatus !== "none" && (
                                                <div className="mt-4">
                                                    <h4 className="font-medium text-sm text-gray-900 mb-2">Return Status</h4>
                                                    <div className="relative">
                                                        <div className="flex justify-between mb-2">
                                                            {getReturnTimeline(item.returnStatus).map((step) => (
                                                                <div key={step.step} className="flex flex-col items-center flex-1">
                                                                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center mb-2 transition-all duration-300 ${step.completed
                                                                        ? "bg-red-500 border-red-500 text-white shadow-sm"
                                                                        : step.current
                                                                            ? "border-red-500 bg-white shadow-sm"
                                                                            : "border-gray-300 bg-white"
                                                                        }`}>
                                                                        {step.completed ? (
                                                                            <CheckCircle className="w-4 h-4" />
                                                                        ) : (
                                                                            <Circle className={`w-4 h-4 ${step.current ? "text-red-500" : "text-gray-300"}`} />
                                                                        )}
                                                                    </div>
                                                                    <span className={`text-xs text-center capitalize px-1 transition-colors ${step.completed || step.current
                                                                        ? "text-red-600 font-medium"
                                                                        : "text-gray-400"
                                                                        }`}>
                                                                        {step.step.replace("-", " ")}
                                                                    </span>
                                                                </div>
                                                            ))}
                                                        </div>

                                                        {/* Progress Bar */}
                                                        <div className="absolute top-4 left-4 right-4 h-0.5 bg-gray-200 -z-10">
                                                            <div
                                                                className="h-full bg-red-500 transition-all duration-500 ease-out"
                                                                style={{
                                                                    width: `${(getReturnTimeline(item.returnStatus).filter(s => s.completed).length - 1) / (returnFlow.length - 1) * 100}%`
                                                                }}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}


                                            {(item.status === "delivered" || item.status === "returned") && (
                                                <div className="border-t border-gray-100 pt-4 mt-4">
                                                    <div className="flex items-center justify-between mb-3">
                                                        {userReview && (
                                                            <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                                                                Reviewed
                                                            </Badge>
                                                        )}
                                                    </div>

                                                    {userReview ? (
                                                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
                                                            <div className="flex items-start justify-between">
                                                                <div className="flex-1">
                                                                    {/* Rating and Date */}
                                                                    <div className="flex items-center gap-3 mb-2">
                                                                        <div className="flex items-center gap-1">
                                                                            {[1, 2, 3, 4, 5].map((star) => (
                                                                                <Star
                                                                                    key={star}
                                                                                    className={`w-4 h-4 ${star <= userReview.rating
                                                                                        ? "text-amber-500 fill-current"
                                                                                        : "text-gray-300"
                                                                                        }`}
                                                                                />
                                                                            ))}
                                                                            <span className="text-sm font-medium text-gray-700 ml-1">
                                                                                {userReview.rating}.0
                                                                            </span>
                                                                        </div>
                                                                        <span className="text-xs text-gray-500">
                                                                            {formatDate(userReview.createdAt)}
                                                                        </span>
                                                                    </div>

                                                                    {/* Review Comment */}
                                                                    {userReview.comment && (
                                                                        <p className="text-gray-700 text-sm leading-relaxed mb-3">
                                                                            {userReview.comment}
                                                                        </p>
                                                                    )}

                                                                    {/* Review Image */}
                                                                    {userReview.image?.url && (
                                                                        <div className="mt-2">
                                                                            <img
                                                                                src={userReview.image.url}
                                                                                alt="Your review"
                                                                                className="w-20 h-20 rounded-lg object-cover border border-gray-200 shadow-sm"
                                                                            />
                                                                        </div>
                                                                    )}
                                                                </div>

                                                                <Button onClick={() => deleteReview(userReview._id, item.product._id)} variant="outline" size="sm" className="text-amber-600 border-amber-200 hover:bg-amber-50">
                                                                    <Trash></Trash>
                                                                    Delete
                                                                </Button>
                                                            </div>

                                                            {/* Helpful Indicator */}
                                                            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-green-200">
                                                                <ThumbsUp className="w-3 h-3 text-green-600" />
                                                                <span className="text-xs text-green-700 font-medium">
                                                                    Your review helps other shoppers
                                                                </span>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="text-center py-4 bg-gray-50 rounded-lg border border-gray-200">
                                                            <Star className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                                                            <p className="text-sm text-gray-600 mb-3">
                                                                Share your experience with this product
                                                            </p>
                                                            <UserReview productID={item.product._id} />
                                                        </div>
                                                    )}
                                                </div>
                                            )
                                            }

                                            {item.status === "delivered" && item?.returnStatus === "none" && (
                                                <div className="flex justify-center pt-4 border-t border-gray-100">
                                                    <UserReturn item={item} order={order} />
                                                </div>
                                            )}

                                        </div>
                                    )
                                })}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;                                      