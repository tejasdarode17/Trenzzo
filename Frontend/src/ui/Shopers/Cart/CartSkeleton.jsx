import { Skeleton } from "@/components/ui/skeleton";

const CartSkeleton = () => {
    return (
        <div className="max-w-6xl mx-auto mt-4 px-4">
            <div className="flex flex-col lg:flex-row gap-6">
                {/* LEFT */}
                <div className="flex-1 bg-white rounded-xl shadow border p-6 space-y-6">
                    <Skeleton className="h-6 w-40" />
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex gap-4">
                            <Skeleton className="w-28 h-28 rounded-lg" />
                            <div className="flex-1 space-y-3">
                                <Skeleton className="h-4 w-3/4" />
                                <Skeleton className="h-4 w-1/2" />
                                <Skeleton className="h-8 w-32" />
                            </div>
                        </div>
                    ))}
                </div>

                {/* RIGHT */}
                <div className="hidden lg:block w-96">
                    <div className="bg-white rounded-xl shadow border p-6 space-y-4">
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartSkeleton;
