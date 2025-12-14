import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { CheckCircle2, CircleSlash, MoreHorizontal, } from "lucide-react";
import useSellerChangeStatus from "@/Custom Hooks/useSellerChangeStatus";
import { useDispatch } from "react-redux";
import { updateSellerStatus } from "@/Redux/adminSlice";
import { useState } from "react";


export const ApproveRejectButton = ({ seller }) => {

    const { changeSellerStatus, loading } = useSellerChangeStatus()
    const [open, setOpen] = useState(false)
    const dispatch = useDispatch()
    async function handleChangeStatus(newStatus, e) {
        try {
            const updatedSeller = await (changeSellerStatus(newStatus, seller?._id))
            setOpen(false)
            dispatch(updateSellerStatus({ id: seller._id, status: updatedSeller?.status }))
        } catch (error) {
            console.log(e);
        }
    }

    return (
        <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" disabled={loading}>
                    <MoreHorizontal />
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent>
                {seller?.status !== "approved" && (
                    <DropdownMenuItem onClick={() => handleChangeStatus("approved")}>
                        <CheckCircle2 className="text-green-400 mr-2 h-4 w-4" /> Approve
                    </DropdownMenuItem>
                )}

                {seller?.status !== "rejected" && (
                    <DropdownMenuItem onClick={() => handleChangeStatus("rejected")}>
                        <CircleSlash className="text-red-500 mr-2 h-4 w-4" /> Reject
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};