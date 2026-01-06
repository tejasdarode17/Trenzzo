import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CloudUpload, Star } from "lucide-react";
import useUploadImage from "@/hooks/image/useUploadImage";
import { toast } from "sonner";
import { usePostReview } from "@/hooks/shopper/userPostReview";


const UserReview = ({ productID, }) => {
    const [open, setOpen] = useState(false)
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState("");
    const [image, setImage] = useState("");
    const { uploadImageToServer } = useUploadImage()

    const { mutateAsync: addReview, isLoading } = usePostReview()

    async function handleSubmit(e) {
        e.preventDefault();
        if (!rating || !review.trim()) {
            toast.error("Please add rating and review");
            return;
        }
        try {
            let uploadedImage = null;
            if (image) {
                uploadedImage = await uploadImageToServer(image);
            }
            await addReview({
                productID,
                review,
                rating,
                image: uploadedImage,
            })

        } catch (err) {
            console.error(err);
        }
    }


    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="shadow-none">
                    Rate & Review Product
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-lg">
                <form onSubmit={(e) => handleSubmit(e)} className="space-y-4" >
                    <DialogHeader>
                        <h2 className="text-xl font-semibold">Write a Review</h2>
                        <p className="text-sm text-gray-500">Share your experience about this product</p>
                    </DialogHeader>

                    {/* Rating Stars */}
                    <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                                key={star}
                                size={24}
                                className={`cursor-pointer transition-colors ${star <= rating ? "text-yellow-400" : "text-gray-300"}`}
                                onClick={() => setRating(star)}
                            />
                        ))}
                        <span className="text-sm text-gray-500">{rating} / 5</span>
                    </div>

                    {/* Review Text */}
                    <Textarea
                        value={review}
                        onChange={(e) => setReview(e.target.value)}
                        placeholder="Write your review here..."
                        className="w-full"
                        rows={4}
                        required
                    />

                    <div>
                        <Input
                            id="product-image"
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={(e) => setImage(e.target.files[0])}
                            className="hidden"
                        />
                        <label htmlFor="product-image" className=" text-sm font-medium text-gray-700">
                            {
                                image ? (
                                    <div className="overflow-hidden">
                                        <img
                                            src={URL.createObjectURL(image)}
                                            alt={"Image"}
                                            className="w-20 h-20 object-cover rounded-md border"
                                        />
                                    </div>
                                ) : (
                                    <div className="flex justify-center items-center pointer w-20 h-20 object-cover rounded-md border">
                                        <CloudUpload></CloudUpload>
                                    </div>
                                )
                            }
                        </label>
                    </div>

                    {/* Submit Button */}
                    <Button disabled={isLoading} type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                        Submit Review
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};



export default UserReview