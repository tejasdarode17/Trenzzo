import axios from "axios";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const SearchBar = () => {
    const [searchDropDown, setSearchDropDown] = useState(false);
    const [userInput, setUserInput] = useState("");
    const [productsSuggesation, setProductsSuggesation] = useState([]);

    const navigate = useNavigate();

    async function fetchSearchSuggestion() {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/search/suggestions`, {
                params: { search: userInput },
                withCredentials: true,
            });
            setProductsSuggesation(response?.data?.products || []);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            if (userInput.length < 2) {
                return
            }
            if (userInput.trim()) {
                fetchSearchSuggestion();
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [userInput]);

    function handleKeyDown(e) {
        if (e.key === "Enter") {
            e.preventDefault();
            navigate(`/products?search=${encodeURIComponent(userInput)}`,);
        }
    }



    return (
        <div className="relative flex-1" >
            <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
            />

            <Input
                placeholder="Search products..."
                value={userInput}
                className="bg-[#F0F5FF] pl-10 w-full rounded-none"
                onFocus={() => setSearchDropDown(true)}
                onBlur={() => setSearchDropDown(false)}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={handleKeyDown}
            />

            {searchDropDown && (
                <Card className="w-full absolute shadow-2xl m-0 p-0 rounded-none">
                    {userInput?.length > 0 ? (
                        productsSuggesation.length > 0 ? (
                            <CardContent className="p-0 m-0">
                                {productsSuggesation.map((p, index) => (
                                    <>
                                        <p
                                            key={p?.brand + p?._id}
                                            onMouseDown={() => {
                                                setUserInput(p?.brand);
                                                setSearchDropDown(false);
                                                navigate(`/products?search=${encodeURIComponent(p?.brand)}`, { state: { userInput } })
                                            }}
                                            className={`p-2 text-sm cursor-pointer`}
                                        >
                                            {p?.brand}
                                        </p>
                                        <p
                                            key={p?.name + p?._id}
                                            onMouseDown={() => {
                                                setUserInput(p?.name);
                                                setSearchDropDown(false);
                                                navigate(`/products?search=${encodeURIComponent(p?.name)}`, { state: { userInput } })
                                            }}
                                            className={`p-2 text-sm cursor-pointer`}
                                        >
                                            {p?.brand + " " + p?.name}
                                        </p>
                                    </>
                                ))}
                            </CardContent>
                        ) : (
                            <CardContent className="p-0">
                                <p className="p-2 text-muted-foreground text-sm">No Result Found</p>
                            </CardContent>
                        )
                    ) : (
                        <CardContent className="p-0">
                            <p className="p-2 text-sm hover:bg-gray-200 cursor-pointer">Asus ROG</p>
                            <p className="p-2 text-sm hover:bg-gray-200 cursor-pointer">Apple iPhone 16</p>
                            <p className="p-2 text-sm hover:bg-gray-200 cursor-pointer">Samsung S25</p>
                            <p className="p-2 text-sm hover:bg-gray-200 cursor-pointer">Redmi 14 Pro</p>
                            <p className="p-2 text-sm hover:bg-gray-200 cursor-pointer">LG OLED TV 55"</p>
                        </CardContent>
                    )}
                </Card>
            )}
        </div>
    );
};

export default SearchBar;

