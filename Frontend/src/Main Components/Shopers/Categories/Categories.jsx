import { useCatogery } from "@/hooks/admin/useCategory";

const Categories = () => {

    const { data: categories, isLoading: loading } = useCatogery()

    return (
        <div className="w-full mx-auto my-2 bg-white shadow-md p-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-6">
                {categories?.map((cat, idx) => (
                    <div
                        key={idx}
                        className="flex flex-col items-center text-center p-3 rounded-xl border hover:shadow-lg transition-shadow cursor-pointer"
                    >
                        <img
                            src={cat?.image?.url}
                            alt={cat.name}
                            className="w-20 h-20 object-contain mb-2"
                        />
                        <p className="text-sm font-medium text-gray-700">{cat.name}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};


export default Categories