import useUploadImage from "@/hooks/image/useUploadImage";
import useUploadImages from "@/hooks/image/useUploadImages";
import axios from "axios";


const { uploadImageToServer } = useUploadImage()
const { uploadImagesToServer } = useUploadImages()

//carousel API

export async function addCarouselAPI({ carousalType, carouselImages }) {
    const images = await uploadImagesToServer(carouselImages)
    const payload = {
        title: carousalType,
        images: images
    }
    const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/admin/add-carousel`, payload, {
        withCredentials: true,
    });
    return response?.data
}

export async function deleteCarouselAPI(id) {
    const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/admin/delete-carousel/${id}`, {
        withCredentials: true,
    });
    return response?.data
}

export async function editCarouselAPI({ carousalType, carouselImages, id }) {
    let uploadedImages = []
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
    }

    const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/admin/edit-carousel/${id}`, payload, {
        withCredentials: true,
    })

    return response?.data
}


//banner API
export async function addBannerAPI(bannerFrom) {
    const uploadedImage = await uploadImageToServer(bannerFrom?.image);
    const payload = {
        type: bannerFrom.type,
        image: uploadedImage,
        link: bannerFrom.link,
    }
    const respone = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/admin/add-banner`, payload, {
        withCredentials: true,
    })
    return respone?.data
}

export async function deleteBannerAPI(id) {
    const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/admin/delete-banner/${id}`, {
        withCredentials: true,
    });
    return response?.data
}


//category API
export async function addCategoryAPI(formData) {
    const uploadedImage = await uploadImageToServer(formData.image);
    const payload = {
        name: formData.name,
        description: formData.description,
        image: uploadedImage,
        attributes: formData.attributes
    };
    const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/admin/add-category`,
        payload,
        { withCredentials: true, }
    )
    return response?.data
}

export async function deleteCategoryAPI(id) {
    const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/admin/delete-category/${id}`, {
        withCredentials: true,
    });
    return response?.data
}

export async function editCategoryAPI({ formData, id }) {
    let uploadedImage = formData.image;
    if (formData.image && formData.image instanceof File) {
        uploadedImage = await uploadImageToServer(formData.image);
    }

    const payload = {
        name: formData.name,
        description: formData.description,
        image: uploadedImage,
        attributes: formData.attributes
    }

    const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/admin/edit-category/${id}`, payload, {
        withCredentials: true,
    })

    return response.data
}


//seller API
export async function fetchSellersAPI({ status = "all", page = 1, search = "" }) {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/admin/sellers`,
        {
            params: { status, page, search },
            withCredentials: true
        }
    );
    console.log(response.data);
    return response.data
}

export async function fetchSellerAPI(id) {
    const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/admin/seller/${id}`,
        { withCredentials: true }
    );
    return res.data
}

export async function changeSellerStatusAPI({ sellerID, newStatus, message }) {
    const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/admin/status-seller/${sellerID}`, { newStatus, message }, {
        withCredentials: true,
    });
    console.log(response.data);
    return response?.data?.sellers
}


//Stat Dashboard API
export async function fetchAdminStats() {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/admin/stats`,
        { withCredentials: true }
    );
    return response.data
}



//below apis are fetched by admin and user 
export async function fetchCarouselsAPI() {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/carousels`, {
        withCredentials: true,
    });
    return response?.data
}

export async function fetchBannersAPI() {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/banners`, {
        withCredentials: true,
    });
    return response?.data
}

export async function fetchCategoriesAPI() {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/admin/category`, {
        withCredentials: true,
    });
    return response?.data?.categories
}
