import axios from "axios";
import { useState } from "react";

const useSellerChangeStatus = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    async function changeSellerStatus(newStatus, sellerID, message = "") {
        try {
            setLoading(true)
            setError(null)
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/admin/status-seller/${sellerID}`, { newStatus, message }, {
                withCredentials: true,
            });
            console.log(response.data);
            return response?.data?.seller
        } catch (error) {
            console.log(error);
            setError(error)
            throw error
        } finally {
            setLoading(false)
        }
    }
    return { changeSellerStatus, loading, error }
}


export default useSellerChangeStatus