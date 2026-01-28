import useSearch from "@/hooks/shopper/useSearch";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchResults from "./SearchResult";

const DesktopSearchbar = () => {
    const [query, setQuery] = useState("");
    const [open, setOpen] = useState(false);

    const { results, loading } = useSearch(query);
    const navigate = useNavigate();

    function handleKeyDown(e) {
        if (e.key === "Enter") {
            e.preventDefault();
            setOpen(false);
            navigate(`/products?search=${encodeURIComponent(query)}`);
        }
    }

    return (
        <div className="relative w-full max-w-xl hidden md:block">
            <input
                type="text"
                value={query}
                onChange={(e) => {
                    setQuery(e.target.value);
                    setOpen(true);
                }}
                onKeyDown={handleKeyDown}
                placeholder="Search for products"
                className="w-full px-4 py-2 rounded-md outline-none bg-[#F0F5FF]"
            />

            {open && query && (
                <div className="absolute top-full left-0 right-0 bg-white shadow-lg rounded-md mt-1 z-50">
                    <SearchResults
                        results={results}
                        loading={loading}
                        query={query}
                        onClose={() => setOpen(false)}
                    />
                </div>
            )}
        </div>
    );
};


export default DesktopSearchbar