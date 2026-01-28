import { useEffect, useState } from "react";
import axios from "axios";

const useSearch = (query, delay = 400) => {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!query || query.trim().length < 2) {
            setResults([]);
            return;
        }

        const timer = setTimeout(async () => {
            setLoading(true);
            try {
                const res = await axios.get(
                    `${import.meta.env.VITE_BACKEND_URL}/search/suggestions`,
                    {
                        params: { search: query },
                        withCredentials: true,
                    }
                );
                setResults(res?.data?.products || []);
            } catch (err) {
                console.log(err);
                setResults([]);
            } finally {
                setLoading(false);
            }
        }, delay);

        return () => clearTimeout(timer);
    }, [query, delay]);

    return { results, loading };
};

export default useSearch;
