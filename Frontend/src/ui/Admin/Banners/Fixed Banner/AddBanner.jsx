import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import BannerForm from "./BannerForm";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addBannerAPI } from "@/api/admin.api";
import { toast } from "sonner";

const AddBanner = () => {
    const [open, setOpen] = useState(false)
    const queryClient = useQueryClient()

    const { mutate: addBanner, isPending: loading, error } = useMutation({
        mutationFn: addBannerAPI,
        onSuccess: () => {
            queryClient.invalidateQueries(["banners"])
            setOpen(false)
        },
        onError: (error) => {
            toast.error(error?.respone?.data?.message || "Somwthing went wrong on server")
        }
    })

    function handleSubmit(bannerFrom) {
        addBanner(bannerFrom)
    }


    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button variant="outline">
                        Add Banner
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add Banner</DialogTitle>
                        <DialogDescription></DialogDescription>
                    </DialogHeader>
                    <BannerForm onSubmit={handleSubmit} error={error} loading={loading}></BannerForm>
                </DialogContent>
            </Dialog>
        </>
    )
}


export default AddBanner


