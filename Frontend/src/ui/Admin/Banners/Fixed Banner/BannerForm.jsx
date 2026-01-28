import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CloudUpload, Loader2, X } from "lucide-react";
import { Label } from "@radix-ui/react-dropdown-menu";

const BannerForm = ({ onSubmit, loading, error }) => {
    const [bannerForm, setBannerForm] = useState({
        type: "",
        image: null,
        link: "",
    });

    useEffect(() => {
        return () => {
            if (bannerForm.image instanceof File) {
                URL.revokeObjectURL(bannerForm.image);
            }
        };
    }, [bannerForm.image]);

    const submitHandler = (e) => {
        e.preventDefault();
        onSubmit(bannerForm, setBannerForm);
    };

    return (
        <form className="flex flex-col gap-5" onSubmit={submitHandler}>
            {/* Type Selector */}
            <div className="flex flex-col gap-3 w-full">
                <Label className="text-sm font-medium text-muted-foreground">
                    Select where you want to display
                </Label>
                <Select
                    value={bannerForm?.type}
                    onValueChange={(val) =>
                        setBannerForm((prev) => ({ ...prev, type: val }))
                    }
                >
                    <SelectTrigger className="flex justify-between border rounded px-3 py-2 text-sm text-left">
                        <SelectValue placeholder="Please Select Type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="fixed">Below Front Page Carousel</SelectItem>
                        <SelectItem value="sale">Some Where Else</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Link Input */}
            <div className="flex flex-col gap-3 w-full">
                <Label className="text-sm font-medium text-muted-foreground">
                    Link
                </Label>
                <Input
                    placeholder="If you want to make banner clickable"
                    type="text"
                    value={bannerForm.link || ""}
                    onChange={(e) =>
                        setBannerForm((prev) => ({ ...prev, link: e.target.value }))
                    }
                />
            </div>

            {/* Image Selector */}
            <div className="flex flex-col gap-2">
                <Label className="text-sm font-medium text-muted-foreground">
                    Select banner image
                </Label>
                <input
                    id="image"
                    name="image"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) =>
                        setBannerForm((prev) => ({
                            ...prev,
                            image: e.target.files[0]
                        }))
                    }
                />
                <label htmlFor="image" className="cursor-pointer">
                    {bannerForm.image ? (
                        <div className="relative group w-24 h-24">
                            <img
                                className="h-24 w-24 object-cover border rounded"
                                src={URL.createObjectURL(bannerForm.image)}
                                alt="banner"
                            />
                            <button
                                type="button"
                                onClick={() =>
                                    setBannerForm((prev) => ({ ...prev, image: "" }))
                                }
                                className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition"
                            >
                                <X className="h-4 w-4 text-red-500" />
                            </button>
                        </div>
                    ) : (
                        <div className="h-24 w-24 border border-dashed rounded flex items-center justify-center text-sm text-muted-foreground cursor-pointer">
                            <CloudUpload />
                        </div>
                    )}
                </label>

            </div>

            {error && (
                <div className="flex items-center gap-2 p-3 rounded-md bg-red-100 border border-red-300 text-red-700 text-sm shadow">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-red-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p>{error}</p>
                </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-center">
                <Button
                    type="submit"
                    variant="outline"
                    className="w-25"
                    disabled={loading}
                >
                    {loading ? (
                        <Loader2 className="animate-spin w-5 h-5" />
                    ) : (
                        "Save"
                    )}
                </Button>
            </div>
        </form>
    );
};

export default BannerForm;
