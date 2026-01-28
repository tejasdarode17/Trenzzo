import ProductsFilter from "./ProductsFilter";
import Products from "./Products";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
const ProductsLayout = () => {
    const [showFilters, setShowFilters] = useState(false);

    return (
        <div className="w-full">
            {/* Mobile Filter Button */}
            <div className="md:hidden px-3 py-2 sticky top-[56px] bg-white z-40 border-b">
                <Button
                    variant="outline"
                    className="w-full flex gap-2"
                    onClick={() => setShowFilters(true)}
                >
                    <Filter className="w-4 h-4" />
                    Filters & Sort
                </Button>
            </div>

            <div className="flex">
                {/* Desktop Sidebar */}
                <aside className="hidden md:block w-1/5 p-4 border-r bg-white">
                    <ProductsFilter />
                </aside>

                {/* Products */}
                <main className="flex-1">
                    <Products />
                </main>
            </div>

            {/* Mobile Filter Drawer */}
            {showFilters && (
                <div className="fixed inset-0 z-50 bg-black/40 md:hidden">
                    <div className="absolute bottom-0 w-full bg-white rounded-t-xl p-4 max-h-[85vh] overflow-y-auto">
                        <ProductsFilter onClose={() => setShowFilters(false)} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductsLayout;
