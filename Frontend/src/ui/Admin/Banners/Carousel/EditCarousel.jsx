import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react"
import CarouselForm from "./CarouselForm";
import { Pencil } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { editCarouselAPI } from "@/api/admin.api";


const EditCarousal = ({ carousel }) => {
    const [open, setOpen] = useState(false);
    const queryClient = useQueryClient()

    const { mutate: editCarousal, isPending: loading, error } = useMutation({
        mutationFn: editCarouselAPI,
        onSuccess: () => {
            queryClient.invalidateQueries(["carousels"])
            setOpen(false);
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Something went wrong on server")
        }
    })

    function handleSubmit(carousalType, carouselImages, id) {
        editCarousal({ carousalType, carouselImages, id })
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <Pencil />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Carousel</DialogTitle>
                </DialogHeader>
                <CarouselForm onSubmit={handleSubmit} initialData={carousel} error={error} loading={loading}></CarouselForm>
            </DialogContent>
        </Dialog >
    )
}


export default EditCarousal


