import { uploadImage, uploadImages } from "../utils/cloudinaryHandler.js"

export const uploadImageController = async (req, res) => {
    try {
        const result = await uploadImage(req.file.buffer);
        res.status(200).json({ success: true, image: { url: result.secure_url, public_id: result.public_id } });
    } catch (error) {
        res.status(500).json({ success: false, message: "Upload failed" });
    }
};

export const uploadImagesController = async (req, res) => {
    try {
        const buffers = req.files.map((file) => file.buffer);
        const results = await uploadImages(buffers);
        res.status(200).json({
            success: true,
            images: results.map((r) => ({
                url: r.secure_url,
                public_id: r.public_id,
            })),
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Upload failed" });
    }
};


