import { deleteCarouselAPI } from "@/api/admin.api"
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Loader2, Trash } from "lucide-react"
import { useState } from "react"

const DeleteCarousel = ({ carousel }) => {
    const [open, setOpen] = useState(false)
    const queryClient = useQueryClient()

    const { mutate: deleteCarousel, isPending: loading, isError: error } = useMutation({
        mutationFn: deleteCarouselAPI,
        onSuccess: () => {
            setOpen(false)
            queryClient.invalidateQueries(["carousels"])
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Something went wrong on server")
        }
    })

    function handleDeleteCarousel() {
        deleteCarousel(carousel?._id)
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
                    <AlertDialogTitle>Delete Carousel</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This Carousel will be permanently deleted
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel disabled={loading}>
                        Cancel
                    </AlertDialogCancel>
                    <Button
                        onClick={handleDeleteCarousel}
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
            </AlertDialogContent>
        </AlertDialog>
    )

}


export default DeleteCarousel



//used Button insted of alerDialogAction cuz alert dialog buton was not crontrollable by state loading and open 