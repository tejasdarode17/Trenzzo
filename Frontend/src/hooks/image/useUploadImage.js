import api from "@/api/axiosInstance";


const useUploadImage = () => {
    async function uploadImageToServer(file) {
        const formData = new FormData();
        formData.append("image", file);

        const res = await api.post("/upload-image", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        return res.data.image; // { url, public_id }
    }

    return { uploadImageToServer };
};

export default useUploadImage;
