import api from "@/api/axiosInstance";



const useUploadImages = () => {
    async function uploadImagesToServer(files) {
        const formData = new FormData();
        files?.forEach(file => formData.append("images", file));
        
        const response = await api.post("/upload-images", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        return response.data.images;
    }

    return { uploadImagesToServer };
};

export default useUploadImages;
