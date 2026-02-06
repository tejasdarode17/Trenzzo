import { useNavigate } from "react-router-dom";

const SearchResults = ({ results, loading, onClose, query }) => {
    const navigate = useNavigate();

    if (loading) {
        return <div className="p-4 text-sm text-gray-500">Searching...</div>;
    }

    if (!results?.length) {
        return <div className="p-4 text-sm text-gray-500">No results found</div>;
    }

    function handleSearchSubmit() {
        onClose(false);
        navigate(`/products?search=${encodeURIComponent(query)}`);
    }

    return (
        <ul>
            {results.map((item) => (
                <li
                    key={item._id}
                    onClick={() => {
                        onClose();
                        navigate(`/product/${item.slug}`);
                    }}
                    className="px-4 py-3 hover:bg-gray-100 cursor-pointer text-sm"
                >
                    {item?.brand + " " + item?.name}
                </li>
            ))}

            <li
                onClick={handleSearchSubmit}
                className="px-4 py-3 text-sm font-medium text-indigo-600 hover:bg-gray-50 cursor-pointer"
            >
                View all results for “{query}”
            </li>
        </ul>
    );
};

export default SearchResults;
