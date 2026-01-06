import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ProductReview } from '@/Main Components/Shopers/Products/ProductDetails'
import { StepBack, Edit, Tag, Package, Star, BarChart3, Loader2 } from 'lucide-react'
import { useProductDetail } from '@/hooks/shopper/useProductDetail'

const SellerSingleProduct = () => {

    const { slug } = useParams();
    const { data, isLoading: loading } = useProductDetail({ slug })
    const product = data?.product

    const navigate = useNavigate()


    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
                        <Package className="w-10 h-10 text-slate-400" />
                    </div>
                    <p className="text-slate-600 text-lg font-medium">Loading product details... </p>
                    <Loader2></Loader2>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 p-6">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Page Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-blue-700 bg-clip-text text-transparent">
                            Product Details
                        </h1>
                        <p className="text-slate-600 mt-1">
                            Manage and view your product information
                        </p>
                    </div>

                    <Button
                        variant="outline"
                        onClick={() => navigate("/seller/products")}
                        className="border-slate-300 hover:bg-slate-50"
                    >
                        <StepBack size={16} className="mr-2" />
                        Back to Products
                    </Button>
                </div>

                {/* Product Main Card */}
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-200 shadow-lg overflow-hidden">

                    <div className="flex flex-col lg:flex-row">

                        {/* Left Section: Images */}
                        <div className="lg:w-2/5 p-6 border-r border-slate-200 space-y-4">
                            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                                <img
                                    src={product?.images?.[0]?.url ?? ""}
                                    alt={product?.name}
                                    className="w-full h-80 object-contain rounded-lg"
                                />
                            </div>

                            {product?.images?.length > 1 && (
                                <div className="grid grid-cols-4 gap-3">
                                    {product.images.slice(1).map((image, index) => (
                                        <img
                                            key={index}
                                            src={image.url}
                                            alt=""
                                            className="h-20 w-full object-cover rounded-lg border border-slate-200 hover:border-blue-300 transition"
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Right Section: Details */}
                        <div className="lg:w-3/5 p-6 space-y-8">

                            {/* Name, Category & Brand */}
                            <div>
                                <h2 className="text-2xl font-bold text-slate-800">{product?.name}</h2>
                                <div className="flex items-center gap-3 text-slate-600 mt-2">
                                    <Tag size={16} />
                                    <span>{product?.category?.name}</span>

                                    {product?.brand && (
                                        <>
                                            <span>•</span>
                                            <span className="font-medium">{product?.brand}</span>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Price + Stock */}
                            <div className="flex items-center gap-6 flex-wrap">

                                <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-5 py-3 rounded-xl shadow">
                                    <p className="text-2xl font-bold">
                                        ₹{product?.price?.toLocaleString("en-IN")}
                                    </p>
                                </div>

                                <div className={`px-4 py-2 rounded-lg border flex items-center gap-2 font-semibold
                                    ${product?.stock > 10
                                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                        : product?.stock > 0
                                            ? "bg-amber-50 text-amber-700 border-amber-200"
                                            : "bg-rose-50 text-rose-700 border-rose-200"
                                    }`}>
                                    <Package size={16} />
                                    Stock: {product?.stock}
                                </div>

                            </div>

                            {/* Highlights */}
                            <div className="space-y-3">
                                <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                                    <Star size={16} className="text-amber-500" />
                                    Product Highlights
                                </h3>

                                <div className="space-y-2">
                                    {product?.highlights?.map((line, index) => (
                                        <div key={index} className="flex items-start gap-3">
                                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                                            <p className="text-slate-700">{line}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-wrap gap-4 pt-2">
                                <Button
                                    onClick={() => navigate(`/seller/edit-product/${product?.slug}`)}
                                    className="bg-blue-600 hover:bg-blue-700 text-white shadow"
                                >
                                    <Edit size={16} className="mr-2" />
                                    Edit Product
                                </Button>

                                <Button
                                    variant="outline"
                                    className="border-slate-300 hover:bg-slate-50"
                                >
                                    <Tag size={16} className="mr-2" />
                                    Put on Sale
                                </Button>

                                <Button
                                    variant="outline"
                                    className="border-slate-300 hover:bg-slate-50"
                                >
                                    <BarChart3 size={16} className="mr-2" />
                                    View Analytics
                                </Button>
                            </div>

                        </div>
                    </div>
                </div>

                {/* Description */}
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-200 shadow-lg p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <Package className="w-5 h-5 text-blue-600" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-800">Product Description</h2>
                    </div>

                    <p className="text-slate-700 leading-relaxed">
                        {product?.description || "No description available."}
                    </p>
                </div>

                {/* Reviews */}
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6">
                    <ProductReview />
                </div>

            </div>
        </div>
    )
}

export default SellerSingleProduct
