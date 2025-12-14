import { v2 as cloudinary } from "cloudinary"

export async function uploadImage(buffer) {
    try {
        const result = await new Promise((resolve, reject) => {
            
            cloudinary.uploader.upload_stream(
                {
                    folder: "Ecom",
                    resource_type: "image",
                    transformation: [{ quality: "auto:eco" }]
                },
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result);
                }
            ).end(buffer);
        });

        return result;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function deleteImage(publicID) {
    try {
        const result = await cloudinary.uploader.destroy(publicID);
        return result;
    } catch (error) {
        console.error("Cloudinary single delete error:", error);
    }
}

export async function uploadImages(buffers) {
    const uploadSingle = (buffer) =>
        new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                {
                    folder: "Ecom",
                    resource_type: "image",
                    transformation: [{ quality: "auto:eco" }],
                },
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result);
                }
            ).end(buffer);
        });

    const results = await Promise.all(buffers.map(uploadSingle));
    return results;
}

export async function deleteImages(publicIDs = []) {
    try {
        const results = await Promise.all(
            publicIDs.map(id => cloudinary.uploader.destroy(id))
        );
        return results;
    } catch (error) {
        console.error("Cloudinary batch delete error:", error);
        throw error;
    }
}

