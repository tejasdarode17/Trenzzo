import { Loader2, ShoppingCart, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const MobileStickyBuyBar = ({ onAddToCart, addToCartLoading, onBuyNow, onBuyNowLoading, product }) => {
    // Safe price formatting
    const price = product?.price || 0;
    const salePrice = product?.salePrice || 0;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-xl px-4 py-3 lg:hidden">
            <div className="flex items-center justify-between max-w-7xl mx-auto gap-3">
                {/* Price Display */}
                <div className="flex-1">
                    <div className="flex items-baseline gap-2">
                        <span className="text-lg font-bold text-gray-900">
                            ₹{typeof price === 'number' ? price.toLocaleString("en-IN") : '0'}
                        </span>
                        {salePrice > 0 && (
                            <span className="line-through text-sm text-gray-500">
                                ₹{salePrice.toLocaleString("en-IN")}
                            </span>
                        )}
                    </div>
                    {salePrice > 0 && (
                        <p className="text-xs text-green-600 font-medium mt-0.5">
                            Save ₹{typeof price === 'number' && typeof salePrice === 'number'
                                ? (salePrice - price).toLocaleString("en-IN")
                                : '0'}
                        </p>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                    <Button
                        onClick={onAddToCart}
                        className="bg-amber-500 hover:bg-amber-600 text-white font-medium px-4 py-2 min-w-[100px]"
                        disabled={!product}
                    >
                        {addToCartLoading ? <Loader2 className="animate-spin mx-auto"></Loader2> : (
                            <>
                                <ShoppingCart className="w-4 h-4 mr-2" />
                            </>
                        )}
                    </Button>

                    <Button
                        onClick={onBuyNow}
                        className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-4 py-2 min-w-[100px]"
                        disabled={!product}
                    >
                        {onBuyNowLoading ? <Loader2 className="animate-spin mx-auto"></Loader2> : (
                            <>
                                <Zap className="w-4 h-4 mr-2" />
                                Buy Now
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default MobileStickyBuyBar;

