import CategoryForm from "./CategoryForm";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { StepBack } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addCategoryAPI, } from "@/api/admin.api";


const AddCategory = () => {

    const navigate = useNavigate()
    const queryClient = useQueryClient()

    const { mutate: addCategory, isPending: loading, isError: error } = useMutation({
        mutationFn: addCategoryAPI,
        onSuccess: () => {
            queryClient.invalidateQueries(["category"])
            navigate("/admin/category")
        },
        onError: (error) => {
            console.log(error);
            toast.error(error?.response?.data?.message || "Something went wrong on server")
        }
    })

    function handleSubmit(formData) {
        addCategory(formData)
    }

    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-5">
                <h1 className="text-2xl font-bold text-gray-800">Add Category</h1>
                <Button variant="outline" className="pointer" onClick={() => navigate("/admin/category")} ><StepBack></StepBack>Back</Button>
            </div>


            <div className="mt-10">
                <CategoryForm onSubmit={handleSubmit} loading={loading} />
            </div>
        </div>
    );
};


export default AddCategory