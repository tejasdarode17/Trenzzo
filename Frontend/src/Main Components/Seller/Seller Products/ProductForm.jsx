import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue, } from "@/components/ui/select";
import { CloudUpload, Loader2, X } from "lucide-react";
import { useCatogery } from "@/hooks/admin/useCategory";

function ProductForm({ initialData = {}, onSubmit, loading }) {
    // const { categories } = useSelector((store) => store.categories);
    const isEditMode = Boolean(initialData?._id);
    const { data: categories, } = useCatogery()

    const [productImages, setProductImages] = useState([]);
    const [formData, setFormData] = useState({
        name: "",
        price: "",
        category: "",
        brand: "",
        stock: "",
        attributes: {},
        description: "",
        highlights: [],
    });

    useEffect(() => {
        if (!initialData?._id) return;
        setFormData({
            name: initialData.name || "",
            price: initialData.price || "",
            category: String(initialData.category?._id || ""),
            brand: initialData.brand || "",
            stock: initialData.stock || "",
            attributes: initialData.attributes || {},
            description: initialData.description || "",
            highlights: initialData.highlights || [],
        });
        setProductImages(initialData.images || []);
    }, [initialData]);

    const selectedCategory = categories?.find((c) => String(c._id) === String(formData.category));

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleCategoryChange = (value) => {
        setFormData((prev) => ({
            ...prev,
            category: value,
            attributes: {},
        }));
    };

    const handleAttributeChange = (name, value) => {
        setFormData((prev) => ({
            ...prev,
            attributes: { ...prev.attributes, [name]: value },
        }));
    };

    const handleHighlightChange = (value) => {
        setFormData((prev) => ({ ...prev, highlights: value }));
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setProductImages((prev) => [...prev, ...files]);
    };

    const handleImageRemove = (idx) => {
        setProductImages((prev) => prev.filter((_, i) => i !== idx));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData, productImages);
    };

    return (
        <form onSubmit={handleSubmit} className="grid gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <div className="flex flex-col gap-2">
                    <Label>Category</Label>
                    <Select
                        key={formData.category}
                        value={formData.category}
                        onValueChange={handleCategoryChange}
                        disabled={isEditMode}
                        required
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                            {categories?.map((cat) => (
                                <SelectItem key={cat._id} value={String(cat._id)}>
                                    {cat.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex flex-col gap-2">
                    <Label>Product Name</Label>
                    <Input name="name" value={formData.name} onChange={handleChange} required />
                </div>

                <div className="flex flex-col gap-2">
                    <Label>Brand</Label>
                    <Input name="brand" value={formData.brand} onChange={handleChange} required />
                </div>

                <div className="flex flex-col gap-2">
                    <Label>Price (₹)</Label>
                    <Input type="number" name="price" value={formData.price} onChange={handleChange} required />
                </div>

                <div className="flex flex-col gap-2">
                    <Label>Stock</Label>
                    <Input type="number" name="stock" value={formData.stock} onChange={handleChange} required />
                </div>
            </div>

            {selectedCategory?.attributes?.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedCategory.attributes.map((attr) => (
                        <div key={attr.name} className="p-3 border rounded">
                            <Label className="py-2">{attr.name}{attr.required && "*"}</Label>
                            <Input
                                value={formData.attributes[attr.name] || ""}
                                onChange={(e) => handleAttributeChange(attr.name, e.target.value)}
                                required={attr.required}
                            />
                        </div>
                    ))}
                </div>
            )}

            <ListInput
                value={formData.highlights}
                onChange={handleHighlightChange}
                placeholder="Add highlight"
            />

            <div className="flex flex-col gap-2">
                <Label>Description</Label>
                <Textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="flex gap-2 flex-wrap">
                <Input
                    id="product-image"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    multiple
                    onChange={handleImageChange}
                />

                <label htmlFor="product-image" className="flex gap-2 flex-wrap cursor-pointer">
                    {productImages.map((file, idx) => (
                        <div key={idx} className="h-24 w-24 border rounded relative">
                            <img
                                src={file.url || URL.createObjectURL(file)}
                                className="object-cover w-full h-full"
                            />
                            <button
                                type="button"
                                onClick={() => handleImageRemove(idx)}
                                className="absolute top-1 right-1 bg-white rounded-full p-1"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    ))}

                    <div className="h-24 w-24 border border-dashed rounded flex items-center justify-center">
                        <CloudUpload />
                    </div>
                </label>
            </div>

            <Button type="submit" disabled={loading}>
                {loading ? <Loader2 className="animate-spin" /> : "Save Product"}
            </Button>
        </form>
    );
}

const ListInput = ({ value = [], onChange, placeholder }) => {
    const [input, setInput] = useState("");

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && input.trim()) {
            e.preventDefault();
            onChange([...value, input.trim()]);
            setInput("");
        }
    };

    const handleRemove = (idx) => {
        onChange(value.filter((_, i) => i !== idx));
    };

    return (
        <div className="flex flex-col gap-2">
            <div className="flex flex-wrap gap-2">
                {value.map((item, idx) => (
                    <span key={idx} className="bg-gray-200 px-2 py-1 rounded flex gap-1">
                        {item}
                        <button type="button" onClick={() => handleRemove(idx)}>
                            <X size={12} />
                        </button>
                    </span>
                ))}
            </div>

            <Input
                placeholder={placeholder}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
            />
        </div>
    );
};

export default ProductForm;
