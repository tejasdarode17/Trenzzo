import axios from "axios";
import useUploadImages from "@/hooks/image/useUploadImages";
const { uploadImagesToServer } = useUploadImages()

//products
export async function fetchSellerProductAPI({ category, page, status, search }) {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/seller/products`,
        {
            params: { category, page, status, search },
            withCredentials: true
        }
    );
    return response.data
}

export async function fetchSellerProductDetailsAPI({ category, page, status, search, id }) {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/seller/products/${id}`,
        {
            params: { category, page, status, search },
            withCredentials: true
        }
    );
    return response.data
}

export async function addNewProductAPI({ productFromData, productImages }) {
    const uploadedImages = await uploadImagesToServer(productImages);
    const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/seller/add-product`,
        { ...productFromData, images: uploadedImages },
        { withCredentials: true, }
    );
    return response.data
}

export async function editProductAPI({ productData, productImages, id }) {
    let uploadedImages = []
    let imagesToUpload = productImages?.filter((i) => i instanceof File)
    let existingImages = productImages?.filter((i) => i.url)

    if (imagesToUpload.length > 0) {
        const uploaded = await uploadImagesToServer(imagesToUpload)
        uploadedImages = [...uploaded, ...existingImages]
    } else {
        uploadedImages = existingImages
    }

    const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/seller/edit/product/${id}`,
        { ...productData, images: uploadedImages },
        { withCredentials: true, }
    );
    return response.data
}

export async function deleteProductAPI(id) {
    const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/seller/delete/product/${id}`,
        { withCredentials: true, }
    )
    return response?.data
}

export async function toggleProductStatusAPI({ id, newStatus }) {
    const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/seller/active/product/${id}`,
        { newStatus },
        { withCredentials: true, }
    )
    return response?.data
}

//orders
export async function fetchSellerOrdersAPI({ range, page }) {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/seller/all-orders`,
        {
            params: { range, page },
            withCredentials: true
        }
    )
    return response.data
}

export async function fetchSellerOrderDetailsAPI(orderId) {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/seller/order/${orderId}`,
        { withCredentials: true, }
    )
    return response?.data
}

export async function sellerUpdateDeliveryStatusAPI({ orderID, itemID }) {
    const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/seller/order/status`,
        { orderID, itemID, newStatus: "packed" },
        { withCredentials: true }
    );
    return response.data
}

export async function FetchDeliveryPartnersAPI() {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/delivery/all`, { withCredentials: true });
    return response.data
}

export async function sellerAssignDeliveryPartnerAPI({ orderID, itemID, partnerID }) {
    const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/seller/assign/order`,
        { orderID, itemID, partnerID },
        { withCredentials: true }
    );
    return response.data
}


//returns
export async function fetchSellerReturnRequestsAPI({ filter, page }) {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/seller/returns`,
        {
            params: { filter, page },
            withCredentials: true
        }
    );
    return response.data
}

export async function sellerAssingDeliveryPartnerToReturnAPI({ returnID, orderID, itemID, partnerID }) {
    const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/seller/order/return`,
        { returnID, orderID, itemID, partnerID },
        { withCredentials: true }
    );
    return response.data
}

export async function sellerUpdateReturnStatusAPI({ returnID, orderID, itemID, nextStatus }) {
    const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/seller/return/update-status`,
        { returnID, orderID, itemID, nextStatus },
        { withCredentials: true }
    );
    return response.data
}


//stats
export async function fetchSellerStatsAPI() {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/seller/stats`,
        { withCredentials: true }
    );
    console.log(response.data);
    return response?.data
}

