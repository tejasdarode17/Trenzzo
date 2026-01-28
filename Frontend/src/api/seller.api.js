import useUploadImages from "@/hooks/image/useUploadImages";
import api from "@/api/axiosInstance";

const { uploadImagesToServer } = useUploadImages();


// =========================
// Products API
// =========================

export async function fetchSellerProductAPI({ category, page, status, search }) {
    const response = await api.get("/seller/products", {
        params: { category, page, status, search }
    });
    return response?.data;
}

export async function fetchSellerProductDetailsAPI({ category, page, status, search, id }) {
    const response = await api.get(`/seller/products/${id}`, {
        params: { category, page, status, search }
    });
    return response?.data;
}

export async function addNewProductAPI({ productFromData, productImages }) {
    const uploadedImages = await uploadImagesToServer(productImages);

    const response = await api.post(
        "/seller/add-product",
        { ...productFromData, images: uploadedImages }
    );

    return response?.data;
}

export async function editProductAPI({ productData, productImages, id }) {
    let uploadedImages = [];

    const imagesToUpload = productImages?.filter(i => i instanceof File);
    const existingImages = productImages?.filter(i => i.url);

    if (imagesToUpload.length > 0) {
        const uploaded = await uploadImagesToServer(imagesToUpload);
        uploadedImages = [...uploaded, ...existingImages];
    } else {
        uploadedImages = existingImages;
    }

    const response = await api.post(
        `/seller/edit/product/${id}`,
        { ...productData, images: uploadedImages }
    );

    return response?.data;
}

export async function deleteProductAPI(id) {
    const response = await api.delete(`/seller/delete/product/${id}`);
    return response?.data;
}

export async function toggleProductStatusAPI({ id, newStatus }) {
    const response = await api.post(
        `/seller/active/product/${id}`,
        { newStatus }
    );
    return response?.data;
}


// =========================
// Orders API
// =========================

export async function fetchSellerOrdersAPI({ range, page }) {
    const response = await api.get("/seller/all-orders", {
        params: { range, page }
    });
    return response?.data;
}

export async function fetchSellerOrderDetailsAPI(orderId) {
    const response = await api.get(`/seller/order/${orderId}`);
    return response?.data;
}

export async function sellerUpdateDeliveryStatusAPI({ orderID, itemID }) {
    const response = await api.post(
        "/seller/order/status",
        { orderID, itemID, newStatus: "packed" }
    );
    return response?.data;
}

export async function FetchDeliveryPartnersAPI() {
    const response = await api.get("/delivery/all");
    return response?.data;
}

export async function sellerAssignDeliveryPartnerAPI({ orderID, itemID, partnerID }) {
    const response = await api.post(
        "/seller/assign/order",
        { orderID, itemID, partnerID }
    );
    return response?.data;
}


// =========================
// Returns API
// =========================

export async function fetchSellerReturnRequestsAPI({ filter, page }) {
    const response = await api.get("/seller/returns", {
        params: { filter, page }
    });
    return response?.data;
}

export async function sellerAssingDeliveryPartnerToReturnAPI({ returnID, orderID, itemID, partnerID }) {
    const response = await api.post(
        "/seller/order/return",
        { returnID, orderID, itemID, partnerID }
    );
    return response?.data;
}

export async function sellerUpdateReturnStatusAPI({ returnID, orderID, itemID, nextStatus }) {
    const response = await api.post(
        "/seller/return/update-status",
        { returnID, orderID, itemID, nextStatus }
    );
    return response?.data;
}


// =========================
// Stats API
// =========================

export async function fetchSellerStatsAPI() {
    const response = await api.get("/seller/stats");
    return response?.data;
}
