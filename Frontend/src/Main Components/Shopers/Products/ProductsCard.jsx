import { Shield, Truck } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ product }) => {
    const navigate = useNavigate();

    return (
        <div
            onClick={() => navigate(`/product/${product.slug}`)}
            className="group cursor-pointer border rounded-md p-2 md:p-3 bg-white transition active:scale-[0.98]"
        >
            {/* Image */}
            <div className="w-full h-36 md:h-40 flex items-center justify-center">
                <img
                    src={product?.images?.[0]?.url}
                    alt={product?.name}
                    className="max-h-full object-contain"
                />
            </div>

            {/* Brand + Assured */}
            <div className="flex items-center gap-2 mt-2">
                <span className="text-[10px] md:text-xs bg-gray-100 px-2 py-0.5 rounded">
                    {product.brand}
                </span>

                <span className="bg-green-600 text-white text-[10px] md:text-xs px-2 py-0.5 flex items-center gap-1 rounded">
                    <Shield className="w-3 h-3" />
                    Assured
                </span>
            </div>

            {/* Name */}
            <h3 className="text-xs md:text-sm font-medium mt-2 line-clamp-2">
                {product.name}
            </h3>

            {/* Price + Delivery */}
            <div className="flex justify-between items-center mt-2">
                <p className="text-base md:text-lg font-bold">
                    ₹{product.price.toLocaleString("en-IN")}
                </p>

                <div className="flex items-center gap-1 text-green-600 text-[10px] md:text-xs">
                    <Truck className="w-4 h-4" />
                    Free
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
