import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CloudUpload, Loader2, Plus, Trash } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

const CategoryForm = ({ initialData = {}, onSubmit, loading }) => {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        image: null,
        attributes: [],
        ...initialData,
    });

    const id = initialData._id;

    function handleChange(e) {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    }

    function handleImageChange(e) {
        const file = e.target.files[0];
        if (file) setFormData((prev) => ({ ...prev, image: file }));
    }

    function handleAttributeChange(index, key, value) {
        const updated = [...formData.attributes];
        updated[index] = { ...updated[index], [key]: value };
        setFormData((prev) => ({ ...prev, attributes: updated }));
    }

    function addAttribute() {
        setFormData((prev) => ({ ...prev, attributes: [...prev.attributes, { name: "", required: false }] }));
    }

    function removeAttribute(index) {
        const updated = [...formData.attributes];
        updated.splice(index, 1);
        setFormData((prev) => ({ ...prev, attributes: updated }));
    }

    useEffect(() => {
        return () => {
            if (formData.image && typeof formData.image !== "string") {
                URL.revokeObjectURL(formData.image);
            }
        };
    }, [formData.image]);

    function submitHandler(e) {
        e.preventDefault();
        onSubmit(formData);
    }

    return (
        <form onSubmit={submitHandler} className="grid gap-6">
            {/* Category Name */}
            <div className="flex flex-col gap-2">
                <Label>Category Name</Label>
                <Input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter category name"
                    required
                />
            </div>

            {/* Description */}
            <div className="flex flex-col gap-2">
                <Label>Description</Label>
                <Textarea
                    name="description"
                    rows={3}
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Enter category description"
                />
            </div>

            {/* Attributes */}
            <div className="flex flex-col gap-2">
                <Label>Attributes</Label>

                {(formData.attributes || []).map((attr, index) => (
                    <div
                        key={index}
                        className="grid grid-cols-1 md:grid-cols-3 gap-2 items-center border p-3 rounded-lg"
                    >
                        {/* Attribute Name */}
                        <Input
                            value={attr.name}
                            onChange={(e) => handleAttributeChange(index, "name", e.target.value)}
                            placeholder="Attribute name (e.g. Color, Size, RAM)"
                            required
                        />

                        {/* Required Checkbox */}
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                checked={attr?.required}
                                onCheckedChange={(checked) =>
                                    handleAttributeChange(index, "required", checked)
                                }
                            />
                            <Label>Required</Label>
                        </div>

                        {/* Delete */}
                        <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => removeAttribute(index)}
                        >
                            <Trash size={16} />
                        </Button>
                    </div>
                ))}

                <Button
                    type="button"
                    variant="secondary" 
                    size="sm"
                    onClick={addAttribute}
                    className="w-fit flex items-center gap-1"
                >
                    <Plus size={16} /> Add Attribute
                </Button>
            </div>

            {/* Image Upload */}
            <div className="flex flex-col gap-2">
                <Label>Category Image</Label>
                <Input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    id="category-image"
                    onChange={handleImageChange}
                />
                <label htmlFor="category-image" className="cursor-pointer w-fit">
                    {formData.image ? (
                        <img
                            src={
                                typeof formData.image === "string"
                                    ? formData.image
                                    : formData.image?.url
                                        ? formData.image.url
                                        : URL.createObjectURL(formData.image)
                            }
                            alt="Preview"
                            className="h-24 w-30 object-contain border rounded"
                        />
                    ) : (
                        <div className="h-24 w-24 border border-dashed rounded flex items-center justify-center text-sm text-muted-foreground">
                            <CloudUpload />
                        </div>
                    )}
                </label>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
                <Button type="submit" variant="secondary" disabled={loading}>
                    {loading ? <Loader2 className="animate-spin" /> : id ? "Update" : "Save"}
                </Button>
            </div>
        </form>
    );
};

export default CategoryForm;
