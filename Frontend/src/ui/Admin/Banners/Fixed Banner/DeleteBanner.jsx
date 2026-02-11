import { deleteBannerAPI } from "@/api/admin.api"
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Loader2, Trash } from "lucide-react"
import { useState } from "react"

const DeleteBanner = ({ banner }) => {

    const [open, setOpen] = useState(false)
    const queryClient = useQueryClient()

    const { mutate: deleteBanner, isPending: loading, isError: error } = useMutation({
        mutationFn: deleteBannerAPI,
        onSuccess: () => {
            queryClient.invalidateQueries(["banners"])
            setOpen(false)
        },
        onError: (error) => {
            toast.error(error?.respone?.data?.message || "Somwthing went wrong on server")
        }
    })

    function handleDeleteBanner() {
        deleteBanner(banner?._id)
    }

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button variant="destructive">
                    <Trash />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete Banner</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This banner will be permanently deleted
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={loading}>
                            Cancel
                        </AlertDialogCancel>
                        <Button
                            onClick={handleDeleteBanner}
                            disabled={loading}
                            className="bg-red-500 hover:bg-red-600 flex items-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                "Delete"
                            )}
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )

}


export default DeleteBanner