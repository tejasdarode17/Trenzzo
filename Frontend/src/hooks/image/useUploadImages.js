import axios from "axios";

const useUploadImages = () => {

    async function uploadImagesToServer(files) {

        const formData = new FormData();
        files?.forEach((file) => { formData?.append("images", file) })

        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/upload-images`, formData,
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            return response.data.images;
        } catch (error) {
            console.error("Upload failed:", error);
            throw error;
        }
    }
    return { uploadImagesToServer }
}

export default useUploadImages

