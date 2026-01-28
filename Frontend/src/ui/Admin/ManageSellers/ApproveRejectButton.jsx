import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { changeSellerStatusAPI } from "@/api/admin.api";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { CheckCircle2, CircleSlash, MoreHorizontal, } from "lucide-react";
import { toast } from "sonner";


export const ApproveRejectButton = ({ seller }) => {

    const [open, setOpen] = useState(false)

    const queryClient = useQueryClient()
    const { mutate: changeStatus, isPending: loading } = useMutation({
        mutationFn: changeSellerStatusAPI,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["seller"] })
            setOpen(false)
        },
        onError: (error) => {
            toast.error(error.response.data.message || "Something Went wrong on server")
        }
    })

    function handleChangeStatus(newStatus) {
        changeStatus({ newStatus, sellerID: seller?._id })
    }

    return (
        <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>
                <Button variant="secondary" disabled={loading}>
                    <MoreHorizontal />
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent>
                {seller?.status !== "approved" && (
                    <DropdownMenuItem onClick={() => handleChangeStatus("approved")}>
                        <CheckCircle2 className="text-green-400 mr-2 h-4 w-4" />
                        Approve
                    </DropdownMenuItem>
                )}

                {seller?.status !== "rejected" && (
                    <DropdownMenuItem onClick={() => handleChangeStatus("rejected")}>
                        <CircleSlash className="text-red-500 mr-2 h-4 w-4" />
                        Reject
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};