import { useWishlist } from "@/hooks/shopper/useWishlist"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, ShoppingCart, Trash2, ArrowRight, Star, Truck } from "lucide-react"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { addToCartThunk } from "@/Redux/cartSlice"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { addProductToWishlist } from "@/api/shopper.api"

const Wishlist = () => {
    const { data: wishlist } = useWishlist()
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleAddToCart = (product) => {
        dispatch(addToCartThunk({
            productID: product._id,
            quantity: 1,
            attributes: product.attributes
        }));
        navigate("/cart");
    }

    const handleViewProduct = (product) => {
        navigate(`/product/${product?.slug}`)
    }


    const queryClient = useQueryClient()
    const { mutate: addToWishlist, isPending: wishlistAdding } = useMutation({
        mutationFn: addProductToWishlist,
        onSuccess: () => {
            queryClient.invalidateQueries(["wishlist"])
        },
        onError: (error) => {
            console.log(error);
            toast.error(error?.response?.data?.message || "Something went wrong on server")
        }
    })

    function handleRemoveFromWishlist(product) {
        addToWishlist({ productID: product?._id })
    }

    if (wishlist?.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8">
                <div className="text-center max-w-md mx-auto p-8">
                    <div className="w-20 h-20 bg-pink-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Heart className="w-10 h-10 text-pink-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Wishlist is Empty</h2>
                    <p className="text-gray-600 mb-6">
                        Save items you love for later. Add items to your wishlist to see them here.
                    </p>
                    <Button
                        onClick={() => navigate('/')}
                        className="bg-amber-500 hover:bg-amber-600 text-white"
                    >
                        Start Shopping
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-6xl mx-auto px-4">
                {/* Header */}
                <div className="mb-8 flex items-center gap-4">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Wishlist</h1>
                </div>

                {/* Wishlist Items */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {wishlist?.map((product) => (
                        <div
                            key={product._id}
                            className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group"
                        >
                            {/* Product Image */}
                            <div
                                className="relative h-48 bg-gray-100 cursor-pointer"
                                onClick={() => handleViewProduct(product)}
                            >
                                <img
                                    src={product?.images?.[0]?.url}
                                    alt={product.name}
                                    className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                                />
                                {/* Remove Button */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        handleRemoveFromWishlist(product)
                                    }}
                                    className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md hover:bg-red-50 hover:text-red-600 transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                                {/* Out of Stock Overlay */}
                                {product.outOfStock && (
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                        <span className="text-white font-semibold bg-red-600 px-3 py-1 rounded text-sm">
                                            Out of Stock
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Product Details */}
                            <div className="p-4 space-y-3">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                            {product.brand}
                                        </span>
                                        <Badge className="bg-green-600 text-white px-2 py-0 text-xs h-5">
                                            Assured
                                        </Badge>
                                    </div>
                                    <h3
                                        className="font-semibold text-gray-900 text-sm line-clamp-2 hover:text-amber-600 transition-colors cursor-pointer"
                                        onClick={() => handleViewProduct(product)}
                                    >
                                        {product.brand} {product.name} {product.attributes?.storage}
                                    </h3>
                                </div>

                                {/* Rating */}
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center gap-1 bg-green-600 text-white px-2 py-1 rounded text-xs">
                                        <Star className="w-3 h-3 fill-current" />
                                        <span className="font-semibold">4.5</span>
                                    </div>
                                    <span className="text-gray-500 text-xs">1,200 ratings</span>
                                </div>

                                {/* Price */}
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-lg font-bold text-gray-900">
                                            ₹{product.price?.toLocaleString("en-IN")}
                                        </p>
                                        {product.salePrice > 0 && (
                                            <p className="text-sm text-gray-500 line-through">
                                                ₹{product.salePrice.toLocaleString("en-IN")}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Delivery Info */}
                                <div className="flex items-center gap-2 text-xs text-green-600">
                                    <Truck className="w-3 h-3" />
                                    <span>Free delivery</span>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-2 pt-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="flex-1 border-gray-300 hover:bg-gray-50"
                                        onClick={() => handleViewProduct(product)}
                                    >
                                        <ArrowRight className="w-3 h-3 mr-1" />
                                        View
                                    </Button>
                                    <Button
                                        size="sm"
                                        className="flex-1 bg-amber-500 hover:bg-amber-600 text-white"
                                        onClick={() => handleAddToCart(product)}
                                        disabled={product.outOfStock}
                                    >
                                        <ShoppingCart className="w-3 h-3 mr-1" />
                                        Add to Cart
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Wishlist