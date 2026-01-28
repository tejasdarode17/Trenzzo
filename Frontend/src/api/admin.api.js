import useUploadImage from "@/hooks/image/useUploadImage";
import useUploadImages from "@/hooks/image/useUploadImages";
import api from "@/api/axiosInstance";

const { uploadImageToServer } = useUploadImage();
const { uploadImagesToServer } = useUploadImages();


// =========================
// Carousel API
// =========================

export async function addCarouselAPI({ carousalType, carouselImages }) {
    const images = await uploadImagesToServer(carouselImages);

    const payload = {
        title: carousalType,
        images
    };

    const response = await api.post("/admin/add-carousel", payload);
    return response?.data;
}

export async function deleteCarouselAPI(id) {
    const response = await api.delete(`/admin/delete-carousel/${id}`);
    return response?.data;
}

export async function editCarouselAPI({ carousalType, carouselImages, id }) {
    let uploadedImages = [];

    const newFiles = carouselImages?.filter(img => img instanceof File);
    const existingImages = carouselImages?.filter(img => img.url);

    if (newFiles.length > 0) {
        const uploaded = await uploadImagesToServer(newFiles);
        uploadedImages = [...existingImages, ...uploaded];
    } else {
        uploadedImages = existingImages;
    }

    const payload = {
        title: carousalType,
        images: uploadedImages
    };

    const response = await api.post(`/admin/edit-carousel/${id}`, payload);
    return response?.data;
}


// =========================
// Banner API
// =========================

export async function addBannerAPI(bannerFrom) {
    const uploadedImage = await uploadImageToServer(bannerFrom?.image);

    const payload = {
        type: bannerFrom.type,
        image: uploadedImage,
        link: bannerFrom.link,
    };

    const response = await api.post("/admin/add-banner", payload);
    return response?.data;
}

export async function deleteBannerAPI(id) {
    const response = await api.delete(`/admin/delete-banner/${id}`);
    return response?.data;
}


// =========================
// Category API
// =========================

export async function addCategoryAPI(formData) {
    const uploadedImage = await uploadImageToServer(formData.image);

    const payload = {
        name: formData.name,
        description: formData.description,
        image: uploadedImage,
        attributes: formData.attributes
    };

    const response = await api.post("/admin/add-category", payload);
    return response?.data;
}

export async function deleteCategoryAPI(id) {
    const response = await api.delete(`/admin/delete-category/${id}`);
    return response?.data;
}

export async function editCategoryAPI({ formData, id }) {
    let uploadedImage = formData.image;

    if (formData.image instanceof File) {
        uploadedImage = await uploadImageToServer(formData.image);
    }

    const payload = {
        name: formData.name,
        description: formData.description,
        image: uploadedImage,
        attributes: formData.attributes
    };

    const response = await api.post(`/admin/edit-category/${id}`, payload);
    return response?.data;
}


// =========================
// Seller API
// =========================

export async function fetchSellersAPI({ status = "all", page = 1, search = "" }) {
    const response = await api.get("/admin/sellers", {
        params: { status, page, search }
    });
    return response?.data;
}

export async function fetchSellerAPI(id) {
    const response = await api.get(`/admin/seller/${id}`);
    return response?.data;
}

export async function changeSellerStatusAPI({ sellerID, newStatus, message }) {
    const response = await api.post(
        `/admin/status-seller/${sellerID}`,
        { newStatus, message }
    );
    return response?.data?.sellers;
}


// =========================
// Dashboard Stats API
// =========================

export async function fetchAdminStats() {
    const response = await api.get("/admin/stats");
    return response?.data;
}


// =========================
// Public APIs (Admin + User)
// =========================

export async function fetchCarouselsAPI() {
    const response = await api.get("/carousels");
    return response?.data;
}

export async function fetchBannersAPI() {
    const response = await api.get("/banners");
    return response?.data;
}

export async function fetchCategoriesAPI() {
    const response = await api.get("/admin/category");
    return response?.data?.categories;
}
