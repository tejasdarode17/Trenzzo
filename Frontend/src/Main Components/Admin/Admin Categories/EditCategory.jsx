import CategoryForm from "./CategoryForm";
import { useLocation, useNavigate, useParams, } from "react-router-dom";
import { StepBack } from "lucide-react";
import { Button } from "@/components/ui/button";
import { editCategoryAPI } from "@/api/admin.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const EditCategory = () => {

    const location = useLocation();
    const cat = location?.state?.cat;
    const navigate = useNavigate()
    const { id } = useParams()
    const queryClient = useQueryClient()

    const { mutate: editCategory, isPending: editLoading, isError: error } = useMutation({
        mutationFn: editCategoryAPI,
        onSuccess: () => {
            queryClient.invalidateQueries(["category"])
            navigate("/admin/category")
        },
        onError: (error) => {
            console.log(error);
            toast.error(error?.response?.data?.message || "Something went wrong on server")
        }
    })

    async function handleSubmit(formData) {
        editCategory({ formData, id })
    }

    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-5">
                <h1 className="text-2xl font-bold text-gray-800">Edit Category</h1>
                <Button variant="outline" className="pointer" onClick={() => navigate("/admin/category")} ><StepBack></StepBack>Back</Button>
            </div>


            <div className="mt-10">
                <CategoryForm initialData={cat} loading={editLoading} onSubmit={handleSubmit} />
            </div>
        </div>
    )
}

export default EditCategory