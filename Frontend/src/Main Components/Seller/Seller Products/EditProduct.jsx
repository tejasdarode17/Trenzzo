import { Button } from '@/components/ui/button'
import { useNavigate, useParams } from 'react-router-dom';
import ProductForm from './ProductForm';
import { StepBack } from 'lucide-react';
import { useSellerEditProduct } from '@/hooks/seller/useSellerEditProduct';
import { useProductDetail } from '@/hooks/shopper/useProductDetail';

const EditProduct = () => {

    const navigate = useNavigate()
    const { slug } = useParams();
    const id = slug?.split("-").pop();

    const { data, } = useProductDetail({ slug })
    const product = data?.product

    const { mutateAsync: editProduct, isPending: loading } = useSellerEditProduct(id)
    async function handleSubmit(formData, productImages,) {
        try {
            const productData = {
                name: formData.name,
                price: Number(formData.price),
                brand: formData.brand,
                stock: Number(formData.stock),
                highlights: formData.highlights,
                description: formData.description,
                attributes: formData.attributes,
            };
            await editProduct({ productData, productImages })
            navigate(`/seller/product/${slug}`)
        } catch (err) {
            console.log(err);
        }
    }

    return (

        <div className="p-6 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold text-gray-800">Edit Product</h1>
                <Button onClick={() => navigate('/seller/products')} variant="outline">
                    <StepBack></StepBack> Back
                </Button>
            </div>

            <div className="bg-white p-6 rounded shadow-md">
                <ProductForm initialData={product} onSubmit={handleSubmit} loading={loading} />
            </div>
        </div>
    )
}



export default EditProduct

