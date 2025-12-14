import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import ProductForm from './ProductForm'
import { useDispatch } from 'react-redux'
import { addProduct } from '@/Redux/sellerSlice'
import useUploadImages from '@/Custom Hooks/useUploadImages'
import { StepBack } from 'lucide-react'


export const AddNewProduct = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)

    const { uploadImagesToServer } = useUploadImages()

    async function handleSubmit(formData, setFormData, productImages, setProductImages) {
        try {
            setLoading(true)
            const uploadedImages = await uploadImagesToServer(productImages);
            const productData = {
                name: formData.name,
                price: Number(formData.price),
                brand: formData.brand,
                category: formData.category,
                stock: Number(formData.stock),
                highlights: formData.highlights,
                description: formData.description,
                attributes: formData.attributes,
                images: uploadedImages
            };

            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/seller/add-product`, productData, {
                withCredentials: true,
            });
            dispatch(addProduct(response?.data?.product))
            setFormData({ name: "", price: "", salePrice: "", brand: "", category: "", stock: "", description: "", });
            setProductImages([])
            navigate("/seller/products")
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="p-6 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold text-gray-800">Add New Product</h1>
                <Button onClick={() => navigate(-1)} variant="outline">
                    <StepBack></StepBack>Back
                </Button>
            </div>

            <div className="bg-white p-6 rounded shadow-md">
                <ProductForm onSubmit={handleSubmit} loading={loading} />
            </div>
        </div>
    );
}