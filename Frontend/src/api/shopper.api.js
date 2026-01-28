import api from "@/api/axiosInstance";


// =========================
// Products API
// =========================

export async function fetchProductsAPI({ search, page = 1, sort = "relevance" }) {
    const response = await api.get("/search", {
        params: { search, page, sort }
    });
    return response?.data;
}


// =========================
// Orders API
// =========================

export async function fetchOrdersAPI({ search, page }) {
    const response = await api.get("/orders", {
        params: { search, page }
    });
    return response?.data;
}

export async function fetchOrderDetailAPI(orderId) {
    const response = await api.get(`/order/${orderId}`);
    return response?.data?.order;
}


// =========================
// Address API
// =========================

export async function fetchAddresses() {
    const response = await api.get("/fetch-addresses");
    return response?.data;
}

export async function addAddressAPI(deliveryAddress) {
    const response = await api.post("/address", deliveryAddress);
    return response?.data;
}

export async function editAddressAPI({ deliveryAddress, id }) {
    const response = await api.post(`/address/${id}`, deliveryAddress);
    return response?.data;
}


// =========================
// Review API
// =========================

export async function fetchUserReviewsAPI() {
    const response = await api.get("/fetch/user/reviews");
    return response?.data;
}

export async function addReviewAPI(reviewData) {
    const response = await api.post("/product/review", reviewData);
    return response?.data;
}

export async function deleteReviewAPI({ reviewID, productID }) {
    const response = await api.delete(`/product/delete/review/${reviewID}`, {
        data: { productID }
    });
    return response?.data;
}


// =========================
// Wishlist API
// =========================

export async function fetchWishlistAPI() {
    const response = await api.get("/wishlist");
    return response?.data?.wishlist;
}

export async function addProductToWishlist({ productID }) {
    const response = await api.post("/add-wishlist", { productID });
    return response?.data;
}


// =========================
// Cart API
// =========================

export async function fetchCartAPI() {
    const response = await api.get("/cart");
    return response?.data;
}

export async function addToCartAPI({ productID, quantity, attributes }) {
    const response = await api.post(
        "/add-cart",
        { productID, quantity, attributes }
    );
    return response?.data;
}

export async function decreaseCartQuantityAPI({ productID, attributes }) {
    const response = await api.post(
        "/decrease-quantity",
        { productID, attributes }
    );
    return response?.data;
}

export async function removeItemFromCartAPI({ productID, attributes }) {
    const response = await api.post(
        "/remove-cart",
        { productID, attributes }
    );
    return response?.data;
}

export async function clearCartAPI() {
    const response = await api.delete("/delete-cart");
    return response?.data;
}


// =========================
// Checkout API
// =========================

export async function initCheckoutAPI(payload) {
    const response = await api.post("/checkout/init", payload);
    return response?.data;
}

export async function checkOutAPI() {
    const response = await api.get("/checkout");
    return response?.data?.checkout;
}


// =========================
// Shared APIs (User + Seller)
// =========================

export async function fetchProductReviewsAPI({ productID }) {
    const response = await api.get("/fetch/reviews", {
        params: { productID }
    });
    return response?.data;
}

export async function fetchProductDetails({ slug }) {
    const response = await api.get(`/product-details/${slug}`);
    return response?.data;
}
