import { useState } from "react";
import useSearch from "@/hooks/shopper/useSearch";
import SearchResults from "./SearchResult";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const MobileSearchbar = ({ onClose }) => {
    
    const [query, setQuery] = useState("");
    const { results, loading } = useSearch(query);

    const navigate = useNavigate()

    function handleKeyDown(e) {
        if (e.key === "Enter") {
            onClose(false)
            e.preventDefault();
            navigate(`/products?search=${encodeURIComponent(query)}`);
        }
    }

    return (
        <div className="fixed inset-0 bg-white z-[100] md:hidden">
            <div className="flex items-center gap-3 px-4 py-3 border-b">
                <input
                    autoFocus
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Search products"
                    className="flex-1 outline-none text-sm"
                />
                <button onClick={() => onClose(false)}>
                    <X size={22} />
                </button>
            </div>

            <div className="overflow-y-auto">
                <SearchResults
                    results={results}
                    loading={loading}
                    query={query}
                    onClose={onClose}
                />
            </div>
        </div>
    );
};


export default MobileSearchbar