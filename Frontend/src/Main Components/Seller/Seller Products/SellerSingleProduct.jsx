import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { StepBack, Edit, Tag, Package, Star, BarChart3 } from 'lucide-react'
import { useProductDetail } from '@/hooks/shopper/useProductDetail'
import ProductReviews from '@/Main Components/Shopers/Products/ProductReviews'
import { useEffect, useState } from 'react'
import SellerProductsDetailsShimmer from './SellerProductsDetailsShimmer'

const SellerSingleProduct = () => {
    const { slug } = useParams()
    const { data, isLoading: loading } = useProductDetail({ slug })
    const product = data?.product
    const [mainImage, setMainImage] = useState("")
    const navigate = useNavigate()

    useEffect(() => {
        if (product?.images?.length) {
            setMainImage(product.images[0].url)
        }
    }, [product])

    if (loading) {
        return (
            <SellerProductsDetailsShimmer></SellerProductsDetailsShimmer>
        )
    }

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-slate-500">Product not found</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen px-3 py-4 sm:px-5 sm:py-6">
            <div className="max-w-7xl mx-auto space-y-6">

                {/* Header */}
                <div className="">
                    <div className='flex justify-between items-center gap-4'>
                        <h1 className="text-xl sm:text-3xl font-bold bg-gradient-to-r from-slate-800 to-blue-700 bg-clip-text text-transparent">
                            Product Details
                        </h1>
                        <Button
                            variant="secondary"
                            size="icon"
                            onClick={() => navigate("/seller/products")}
                            className="border-slate-300 hover:bg-slate-50"
                        >
                            <StepBack size={16} className="mr-2" />
                        </Button>
                    </div>

                    <p className="text-slate-600 text-xs lg:text-base lt:mt-1">
                        Manage and view your product information
                    </p>

                </div>

                {/* Main Card */}
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-5">

                        {/* Image Section */}
                        <div className="lg:col-span-2 p-3 sm:p-4 lg:p-6 border-b lg:border-b-0 lg:border-r border-slate-200">

                            {/* Main Image */}
                            <div className="bg-slate-50 rounded-xl p-3 sm:p-4 border border-slate-200">
                                <img
                                    src={mainImage}
                                    alt={product.name}
                                    className="w-full max-h-[260px] sm:max-h-[320px] lg:max-h-[380px] object-contain rounded-lg"
                                />
                            </div>

                            {/* Thumbnails */}
                            {product.images?.length > 1 && (
                                <div className="grid grid-cols-4 gap-2 sm:gap-3 mt-3">
                                    {product.images.map((image, index) => (
                                        <img
                                            key={index}
                                            onClick={() => setMainImage(image.url || "")}
                                            src={image.url}
                                            className={`h-16 sm:h-20 w-full object-cover rounded-lg border 
                                                ${mainImage === image.url
                                                    ? "border-blue-500 ring-2 ring-blue-200"
                                                    : "border-slate-200"}
                                                cursor-pointer transition`}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Details Section */}
                        <div className="lg:col-span-3 p-4 sm:p-5 lg:p-6 space-y-6">

                            {/* Title */}
                            <div>
                                <h2 className="text-xl sm:text-2xl font-bold text-slate-800">
                                    {product.name}
                                </h2>

                                <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-slate-600 mt-2 text-sm sm:text-base">
                                    <Tag size={16} />
                                    <span>{product?.category?.name}</span>

                                    {product?.brand && (
                                        <>
                                            <span>•</span>
                                            <span className="font-medium">{product.brand}</span>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Price + Stock */}
                            <div className="flex flex-wrap items-center gap-4">

                                <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2.5 rounded-xl shadow">
                                    <p className="text-xl sm:text-2xl font-bold">
                                        ₹{product.price?.toLocaleString("en-IN")}
                                    </p>
                                </div>

                                <div className={`px-3 py-2 rounded-lg border flex items-center gap-2 font-semibold text-sm
                                    ${product.stock > 10
                                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                        : product.stock > 0
                                            ? "bg-amber-50 text-amber-700 border-amber-200"
                                            : "bg-rose-50 text-rose-700 border-rose-200"
                                    }`}>
                                    <Package size={14} />
                                    Stock: {product.stock}
                                </div>

                            </div>

                            {/* Highlights */}
                            {product.highlights?.length > 0 && (
                                <div className="space-y-3">
                                    <h3 className="font-semibold text-slate-800 flex items-center gap-2 text-sm sm:text-base">
                                        <Star size={16} className="text-amber-500" />
                                        Product Highlights
                                    </h3>

                                    <div className="space-y-2">
                                        {product.highlights.map((line, index) => (
                                            <div key={index} className="flex items-start gap-3">
                                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                                                <p className="text-slate-700 text-sm sm:text-base">{line}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex gap-3 pt-2">

                                <Button
                                    onClick={() => navigate(`/seller/edit-product/${product.slug}`)}
                                    className="bg-blue-600 hover:bg-blue-700 text-white shadow w-full"
                                >
                                    <Edit size={16} className="mr-2" />
                                    Edit Product
                                </Button>

                                <Button
                                    variant="outline"
                                    className="border-slate-300 hover:bg-slate-50 w-full"
                                >
                                    <Tag size={16} className="mr-2" />
                                    Put on Sale
                                </Button>

                                <Button
                                    variant="outline"
                                    className="border-slate-300 hover:bg-slate-50 w-full"
                                >
                                    <BarChart3 size={16} className="mr-2" />
                                    View Analytics
                                </Button>
                            </div>

                        </div>
                    </div>
                </div>

                {/* Description */}
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-200 shadow-lg p-4 sm:p-5 lg:p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <Package className="w-5 h-5 text-blue-600" />
                        </div>
                        <h2 className="text-lg sm:text-xl font-bold text-slate-800">
                            Product Description
                        </h2>
                    </div>

                    <p className="text-slate-700 leading-relaxed text-sm sm:text-base">
                        {product.description || "No description available."}
                    </p>
                </div>

                {/* Reviews */}
                <ProductReviews />

            </div>
        </div>
    )
}

export default SellerSingleProduct
