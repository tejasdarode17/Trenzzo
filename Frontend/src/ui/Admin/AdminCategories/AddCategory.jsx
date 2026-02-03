import CategoryForm from "./CategoryForm";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { StepBack } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addCategoryAPI } from "@/api/admin.api";
import { toast } from "sonner";

const AddCategory = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { mutate: addCategory, isPending: loading } = useMutation({
        mutationFn: addCategoryAPI,
        onSuccess: () => {
            queryClient.invalidateQueries(["category"]);
            navigate("/admin/category");
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Something went wrong on server");
        }
    });

    function handleSubmit(formData) {
        addCategory(formData);
    }

    return (
        <div className="w-full p-4 sm:p-6">

            {/* Header */}
            <div className="flex flex-row items-center justify-between gap-2">

                <h1 className="text-lg sm:text-2xl font-bold text-gray-800">
                    Add Category
                </h1>

                <Button
                    variant="secondary"
                    size="icon"
                    className="h-9 text-xs sm:text-sm flex items-center gap-2 "
                    onClick={() => navigate("/admin/category")}
                >
                    <StepBack className="h-4 w-4" />
                    {/* Back */}
                </Button>

            </div>

            {/* Form */}
            <div className="mt-4 sm:mt-8 max-w-xl w-full">
                <CategoryForm onSubmit={handleSubmit} loading={loading} />
            </div>

        </div>
    );
};

export default AddCategory;
