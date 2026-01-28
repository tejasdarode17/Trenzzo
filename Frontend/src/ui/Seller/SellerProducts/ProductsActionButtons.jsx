import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { FiMoreVertical, FiTrash2 } from "react-icons/fi";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Switch } from '@/components/ui/switch';
import { Power } from "lucide-react";
import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteProductAPI, toggleProductStatusAPI } from '@/api/seller.api';

const ProductsActionButton = ({ product }) => {

    const [isActive, setIsActive] = useState(product?.active)

    const queryClient = useQueryClient()
    const { mutate: deleteProduct, isPending: deleteLoading } = useMutation({
        mutationFn: deleteProductAPI,
        onSuccess: () => {
            queryClient.invalidateQueries(["sellerProducts"])
        },
        onError: (err) => {
            toast.error(err?.response?.data?.message || "Something went Wrong on the Server..!")
        }
    })

    function handleDeleteProduct(id) {
        deleteProduct(id)
    }

    const { mutateAsync: toggleProductStatus, } = useMutation({
        mutationFn: toggleProductStatusAPI,
        onSuccess: () => {
            queryClient.invalidateQueries(["sellerProducts"])
        },
        onError: (err) => {
            toast.error(err?.response?.data?.message || "Something went Wrong on the Server..!")
        }
    })

    
    async function handleToggleProductStatus(id, newStatus) {
        setIsActive(newStatus);
        try {
            await toggleProductStatus({ id, newStatus })
        } catch (err) {
            setIsActive(!newStatus)
        }
    }


    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                    <FiMoreVertical size={18} />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48" align="end">
                <DropdownMenuLabel>Product Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuItem
                    className="justify-between"
                    onClick={(e) => e.preventDefault()}
                >
                    <span className="flex items-center space-x-2">
                        <Power size={16} />
                        <span>{isActive ? "Active" : "Inactive"}</span>
                    </span>
                    <Switch
                        checked={isActive}
                        onClick={(e) => e.stopPropagation()}
                        onCheckedChange={() => handleToggleProductStatus(product?._id, !isActive)}
                    />
                </DropdownMenuItem>

                <DropdownMenuSeparator />
                <DropdownMenuItem >
                    <button
                        disabled={deleteLoading}
                        className='flex items-center text-red-600 hover:bg-red-50 cursor-pointer'
                        onClick={(e) => { e.preventDefault(), e.stopPropagation(), handleDeleteProduct(product._id) }}
                    >
                        <FiTrash2 size={16} className="mr-2" />
                        {deleteLoading ? "Deleting..." : "Delete"}
                    </button>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}


export default ProductsActionButton


