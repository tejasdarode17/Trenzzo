import axios from "axios";

//products api
export async function fetchProductsAPI({ search, page = 1, sort = "relevance" }) {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/search`,
        {
            params: { search, page, sort, },
            withCredentials: true
        }
    );
    return response?.data
}


//orders api
export async function fetchOrdersAPI({ search, page }) {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/orders`,
        {
            params: { search, page },
            withCredentials: true,
        }
    )
    return response?.data;
}

export async function fetchOrderDetailAPI(orderId) {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/order/${orderId}`,
        { withCredentials: true, }
    )
    return response?.data?.order;
}

//address api
export async function fetchAddresses() {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/fetch-addresses`,
        { withCredentials: true }
    );
    return response.data
}

export async function addAddressAPI(deliveryAddress) {
    const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/address`, deliveryAddress, {
        withCredentials: true,
    });
    return response.data
}

export async function editAddressAPI({ deliveryAddress, id }) {
    const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/address/${id}`, deliveryAddress, {
        withCredentials: true,
    });
    return response.data
}


//review api
export async function fetchUserReviewsAPI() {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/fetch/user/reviews`,
        { withCredentials: true }
    );
    return response.data
}

export async function addReviewAPI(reviewData) {
    const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/product/review`, reviewData,
        { withCredentials: true }
    );
    return response.data;
};

export async function deleteReviewAPI({ reviewID, productID }) {
    const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/product/delete/review/${reviewID}`,
        {
            data: { productID },
            withCredentials: true
        }
    );
    return response.data
}


//wishlist api
export async function fetchWishlistAPI() {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/wishlist`,
        { withCredentials: true }
    );
    console.log(response.data);
    return response.data.wishlist
}

export async function addProductToWishlist({ productID }) {
    const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/add-wishlist`,
        { productID },
        { withCredentials: true }
    );

    console.log(response.data);
    return response.data
}


//below apis are called by both shopper and seller
export async function fetchProductReviewsAPI({ productID }) {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/fetch/reviews`,
        {
            params: { productID },
            withCredentials: true
        })
    return response.data
}

export async function fetchProductDetails({ slug }) {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/product-details/${slug}`,
        { withCredentials: true }
    );
    return response?.data
}



