import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";

const EmptyCart = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">

            {/* Empty State Content */}
            <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
                <div className="text-center max-w-md w-full">
                    {/* Icon */}
                    <div className="mx-auto mb-6">
                        <div className="bg-amber-50 p-5 rounded-full inline-flex">
                            <ShoppingBag className="w-16 h-16 text-amber-500" />
                        </div>
                    </div>

                    {/* Text Content */}
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">
                        Your cart feels lonely 🛒
                    </h2>
                    <p className="text-gray-600 text-base mb-2">
                        Looks like you haven't added anything yet.
                    </p>
                    <p className="text-gray-500 text-sm mb-8">
                        Explore our collection and find something special!
                    </p>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                        <Button
                            onClick={() => navigate("/")}
                            className="w-full bg-amber-500 hover:bg-amber-600 text-white py-3 text-base font-medium rounded-lg shadow-sm"
                            size="lg"
                        >
                            Start Shopping
                        </Button>
                    </div>

                    {/* Quick Categories */}
                    {/* <div className="mt-10 pt-8 border-t border-gray-100">
                        <p className="text-gray-700 font-medium mb-4">Shop by category</p>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => navigate("/category/electronics")}
                                className="bg-white border border-gray-200 rounded-lg p-3 text-sm hover:border-amber-300 transition-colors"
                            >
                                📱 Electronics
                            </button>
                            <button
                                onClick={() => navigate("/category/fashion")}
                                className="bg-white border border-gray-200 rounded-lg p-3 text-sm hover:border-amber-300 transition-colors"
                            >
                                👗 Fashion
                            </button>
                            <button
                                onClick={() => navigate("/category/home")}
                                className="bg-white border border-gray-200 rounded-lg p-3 text-sm hover:border-amber-300 transition-colors"
                            >
                                🏠 Home & Kitchen
                            </button>
                            <button
                                onClick={() => navigate("/category/beauty")}
                                className="bg-white border border-gray-200 rounded-lg p-3 text-sm hover:border-amber-300 transition-colors"
                            >
                                💄 Beauty
                            </button>
                        </div>
                    </div> */}
                </div>
            </div>


        </div>
    );
};

export default EmptyCart;