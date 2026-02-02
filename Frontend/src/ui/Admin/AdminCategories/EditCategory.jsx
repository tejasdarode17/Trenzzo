import CategoryForm from "./CategoryForm";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { StepBack } from "lucide-react";
import { Button } from "@/components/ui/button";
import { editCategoryAPI } from "@/api/admin.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const EditCategory = () => {
    const location = useLocation();
    const cat = location?.state?.cat;
    const navigate = useNavigate();
    const { id } = useParams();
    const queryClient = useQueryClient();

    const { mutate: editCategory, isPending: editLoading } = useMutation({
        mutationFn: editCategoryAPI,
        onSuccess: () => {
            queryClient.invalidateQueries(["category"]);
            navigate("/admin/category");
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Something went wrong on server");
        }
    });

    function handleSubmit(formData) {
        editCategory({ formData, id });
    }

    return (
        <div className="w-full p-4 sm:p-6">

            {/* Header */}
            <div className="flex flex-row items-center justify-between gap-2">
                <h1 className="text-lg sm:text-2xl font-bold text-gray-800">
                    Edit Category
                </h1>

                <Button
                    variant="secondary"
                    size="sm"
                    className="h-9 text-xs sm:text-sm flex items-center gap-2 w-fit"
                    onClick={() => navigate("/admin/category")}
                >
                    <StepBack className="h-4 w-4" />
                    Back
                </Button>
            </div>

            {/* Form */}
            <div className="mt-4 sm:mt-8 max-w-xl w-full">
                <CategoryForm initialData={cat} loading={editLoading} onSubmit={handleSubmit} />
            </div>
        </div>
    );
};

export default EditCategory;
