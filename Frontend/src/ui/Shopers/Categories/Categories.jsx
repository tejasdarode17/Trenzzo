import { useNavigate } from "react-router-dom";
import { useCatogery } from "@/hooks/admin/useCategory";

const Categories = () => {
    const { data: categories, isLoading } = useCatogery();
    const navigate = useNavigate();

    if (isLoading) {
        return (
            <div className="w-full bg-white py-4">
                {/* Mobile Skeleton Loader */}
                <div className="md:hidden px-2">
                    <div className="flex gap-4 overflow-x-auto scrollbar-hide py-2">
                        {[...Array(8)].map((_, index) => (
                            <div
                                key={index}
                                className="flex flex-col items-center min-w-[72px]"
                            >
                                <div className="w-14 h-14 rounded-full bg-gradient-to-r from-gray-100 via-gray-50 to-gray-300 animate-pulse relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent animate-[shimmer_1.5s_infinite] bg-[length:200%_100%]" />
                                </div>
                                <div className="mt-2 w-12 h-3 bg-gradient-to-r from-gray-100 via-gray-50 to-gray-300 rounded-full animate-pulse relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-[shimmer_1.5s_infinite] bg-[length:200%_100%]" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Desktop Skeleton Loader */}
                <div className="hidden md:block max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-7 gap-6 py-2">
                        {[...Array(14)].map((_, index) => (
                            <div
                                key={index}
                                className="flex flex-col items-center text-center p-3"
                            >
                                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 animate-pulse mb-4 relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent animate-[shimmer_1.5s_infinite] bg-[length:200%_100%]" />
                                </div>
                                <div className="w-16 h-4 bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 rounded animate-pulse relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-[shimmer_1.5s_infinite] bg-[length:200%_100%]" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (!categories?.length) return null;

    return (
        <div className="w-full bg-white">
            {/* MOBILE — horizontal app-style scroller */}
            <div className="md:hidden px-2">
                <div className="flex gap-4 overflow-x-auto scrollbar-hide py-2">
                    {categories?.map((cat) => (
                        <button
                            key={cat?._id}
                            onClick={() =>
                                navigate(`/products?category=${cat?.slug}&catID=${cat?._id}`)
                            }
                            className="flex flex-col items-center min-w-[72px] active:scale-95 transition"
                        >
                            <div className="w-14 h-14 rounded-full bg-gray-50 flex items-center justify-center">
                                <img
                                    src={cat?.image?.url}
                                    alt={cat?.name}
                                    className="w-8 h-8 object-contain"
                                />
                            </div>
                            <span className="mt-1 text-[11px] text-gray-700 text-center">
                                {cat?.name}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* DESKTOP — GRID */}
            <div className="hidden md:grid max-w-7xl mx-auto px-6 grid-cols-7 gap-6 py-2">
                {categories?.map((cat) => (
                    <div
                        key={cat?._id}
                        onClick={() =>
                            navigate(`/products?category=${cat?.slug}&catID=${cat?._id}`)
                        }
                        className="flex flex-col items-center text-center p-3 rounded-lg hover:shadow-md cursor-pointer transition"
                    >
                        <img
                            src={cat?.image?.url}
                            alt={cat?.name}
                            className="w-20 h-20 object-contain mb-2"
                        />
                        <p className="text-sm font-medium text-gray-700">
                            {cat?.name}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Categories;