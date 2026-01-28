const OrderDetailsSkeleton = () => {
    return (
        <div className="min-h-screen bg-gray-50 py-8 animate-pulse">
            <div className="max-w-6xl mx-auto px-4">

                {/* Header */}
                <div className="mb-8 space-y-4">
                    <div className="h-6 w-40 bg-gray-200 rounded" />
                    <div className="h-4 w-72 bg-gray-200 rounded" />
                </div>

                <div className="grid lg:grid-cols-3 gap-8">

                    {/* RIGHT SIDEBAR */}
                    <div className="space-y-6">
                        {[1, 2, 3].map((card) => (
                            <div
                                key={card}
                                className="bg-white border border-gray-200 rounded-lg p-5 space-y-4"
                            >
                                <div className="h-5 w-40 bg-gray-200 rounded" />
                                {[1, 2, 3].map((row) => (
                                    <div key={row} className="flex justify-between">
                                        <div className="h-4 w-24 bg-gray-200 rounded" />
                                        <div className="h-4 w-20 bg-gray-200 rounded" />
                                    </div>
                                ))}
                                <div className="h-6 w-32 bg-gray-200 rounded ml-auto" />
                            </div>
                        ))}
                    </div>

                    {/* MAIN CONTENT */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Order Items Card */}
                        <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
                            <div className="h-5 w-48 bg-gray-200 rounded" />

                            {[1, 2].map((item) => (
                                <div
                                    key={item}
                                    className="border border-gray-200 rounded-xl p-5 space-y-5"
                                >
                                    {/* Product Info */}
                                    <div className="flex gap-4">
                                        <div className="w-20 h-20 bg-gray-200 rounded-lg" />
                                        <div className="flex-1 space-y-3">
                                            <div className="h-4 w-3/4 bg-gray-200 rounded" />
                                            <div className="h-4 w-1/2 bg-gray-200 rounded" />
                                            <div className="h-3 w-1/3 bg-gray-200 rounded" />
                                        </div>
                                    </div>

                                    {/* Timeline */}
                                    <div className="space-y-3">
                                        <div className="h-4 w-32 bg-gray-200 rounded" />
                                        <div className="flex justify-between">
                                            {[1, 2, 3, 4, 5].map((dot) => (
                                                <div
                                                    key={dot}
                                                    className="w-8 h-8 bg-gray-200 rounded-full"
                                                />
                                            ))}
                                        </div>
                                        <div className="h-1 w-full bg-gray-200 rounded" />
                                    </div>

                                    {/* Action area */}
                                    <div className="h-10 w-40 bg-gray-200 rounded mx-auto" />
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default OrderDetailsSkeleton;
