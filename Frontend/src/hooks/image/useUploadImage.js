import axios from "axios";

const useUploadImage = () => {

    async function uploadImageToServer(file) {

        const formData = new FormData();
        formData.append("image", file);

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/upload-image`, formData,
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            return response.data.image; //response contains {image: {url, public_id} }
        } catch (error) {
            console.error("Upload failed:", error);
            throw error;
        }
    }
    return { uploadImageToServer }

}



export default useUploadImage