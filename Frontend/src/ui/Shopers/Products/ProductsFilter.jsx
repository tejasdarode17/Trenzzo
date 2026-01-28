import { useSearchParams, useLocation } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const ProductsFilter = ({ onClose }) => {
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();

    const searchQuery = searchParams.get("search");
    const userInput = location?.state?.userInput;
    const sort = searchParams.get("sort") || "relevance";

    function updateSort(value) {
        setSearchParams(prev => {
            prev.set("sort", value);
            prev.set("page", 1);
            return prev;
        });

        onClose?.();
    }

    return (
        <div className="space-y-6 md:min-h-screen">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                        <Filter className="w-5 h-5 text-amber-500" />
                        Filters
                    </h2>
                    <p className="text-sm text-gray-600">
                        Refine results for "{searchQuery || userInput}"
                    </p>
                </div>

                {onClose && (
                    <Button variant="ghost" size="icon" onClick={onClose}>
                        <X />
                    </Button>
                )}
            </div>

            <Separator />

            {/* Sort */}
            <div className="space-y-3">
                <Label>Sort By</Label>
                <Select value={sort} onValueChange={updateSort}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select sort" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="relevance">Relevance</SelectItem>
                        <SelectItem value="price_low_to_high">Price: Low to High</SelectItem>
                        <SelectItem value="price_high_to_low">Price: High to Low</SelectItem>
                        <SelectItem value="latest">Newest First</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
};

export default ProductsFilter;
