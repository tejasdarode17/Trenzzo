import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import ProductForm from './ProductForm'
import { StepBack } from 'lucide-react'
import { useSellerNewProduct } from '@/hooks/seller/useSellerNewProduct'
import { toast } from 'sonner'

const AddNewProduct = () => {

    const { mutateAsync: addNewProduct, isPending: loading } = useSellerNewProduct()
    const navigate = useNavigate()

    async function handleSubmit(formData, productImages,) {
        try {
            const productFromData = {
                name: formData.name,
                price: Number(formData.price),
                brand: formData.brand,
                category: formData.category,
                stock: Number(formData.stock),
                highlights: formData.highlights,
                description: formData.description,
                attributes: formData.attributes,
            };

            await addNewProduct({ productFromData, productImages })
            navigate("/seller/products")

        } catch (err) {
            toast.error(err.response.data.message || "Server Error")
        }
    }

    return (
        <div className="p-6 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-xl font-semibold text-gray-800">Add New Product</h1>
                <Button size="icon" onClick={() => navigate(-1)} variant="secondary">
                    <StepBack></StepBack>
                </Button>
            </div>

            <div className="bg-white p-6 rounded shadow-md">
                <ProductForm initialData={{}} onSubmit={handleSubmit} loading={loading} />
            </div>
        </div>
    );
}


export default AddNewProduct