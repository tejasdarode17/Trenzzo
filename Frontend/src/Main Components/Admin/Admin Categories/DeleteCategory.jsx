import { deleteCategoryAPI } from "@/api/admin.api"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Loader2, Trash } from "lucide-react"

const DeleteCategory = ({ cat }) => {

    const queryClient = useQueryClient()
    const { mutate: deleteCategory, isPending: loading, isError: error } = useMutation({
        mutationFn: deleteCategoryAPI,
        onSuccess: () => {
            queryClient.invalidateQueries(["category"])
        },
        onMutate: async (id) => {
            await queryClient.cancelQueries({ queryKey: ["category"] })
            const previousCategories = queryClient.getQueryData(["category"])
            queryClient.setQueryData(["category"], (old) => old?.filter((c) => c?._id !== id))
            return { previousCategories }
        },
        onError: (err, _, context) => {
            console.log(err);
            queryClient.setQueryData(["category"], context.previousCategories)
            toast.error("Failed to delete category")
        },
        onSettled: () => {
            queryClient.invalidateQueries(["category"])
        },
    })

    function handleDeleteCategory() {
        deleteCategory(cat?._id)
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="destructive">
                    <Trash />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete Category</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. Deleting this category will permanently remove it from your store, and products linked to this category may be affected.
                        Are you sure you want to continue?
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDeleteCategory}
                        disabled={loading}
                        className="bg-red-500 hover:bg-red-600 flex items-center gap-2"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : "Delete"}
                    </AlertDialogAction>

                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )

}


export default DeleteCategory