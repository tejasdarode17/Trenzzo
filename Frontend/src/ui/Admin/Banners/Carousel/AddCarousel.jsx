import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react"
import CarouselForm from "./CarouselForm";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addCarouselAPI } from "@/api/admin.api";
import { toast } from "sonner";


const AddCarousal = () => {

    const [open, setOpen] = useState(false);
    const queryClient = useQueryClient()

    const { mutate: addCarousel, isPending: loading, isError: error } = useMutation({
        mutationFn: addCarouselAPI,
        onSuccess: () => {
            queryClient.invalidateQueries(["carousels"])
            setOpen(false);
        },
        onError: (error) => {
            console.log(error);
            toast.error(error?.response?.data?.message || "Something went wrong on server")
        }
    })

    
    function handleSubmit({ carousalType, carouselImages }) {
        addCarousel({ carousalType, carouselImages })
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">Add Carousel</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Carousel</DialogTitle>
                </DialogHeader>
                <CarouselForm onSubmit={handleSubmit} error={error} loading={loading}></CarouselForm>
            </DialogContent>
        </Dialog >
    )
}

export default AddCarousal


