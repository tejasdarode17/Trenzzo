import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Ban, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { changeSellerStatusAPI } from "@/api/admin.api";

const SellerManagement = ({ seller }) => {
    const [open, setOpen] = useState(false);
    const [actionType, setActionType] = useState(null);
    const [message, setMessage] = useState("");

    function handleOpen(type) {
        setActionType(type);
        setOpen(true);
    }

    const queryClient = useQueryClient();
    const { mutate: changeStatus, isPending: loading } = useMutation({
        mutationFn: changeSellerStatusAPI,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["seller"] });
            setOpen(false);
            setMessage("");
        },
        onError: (error) => {
            toast.error(error.response.data.message || "Something went wrong on server");
        }
    });

    function handleConfirm() {
        changeStatus({ sellerID: seller._id, newStatus: actionType, message });
    }

    async function handleDelete() {
        try {
            console.log("Deleted seller:", seller?._id);
            setOpen(false);
            setMessage("");
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <>
            <Card className="shadow-sm">
                <CardHeader className="sm:py-2">
                    <CardTitle className="text-sm sm:text-base">
                        Seller Management
                    </CardTitle>
                </CardHeader>

                <CardContent className="flex flex-col sm:flex-row gap-2 sm:gap-4">

                    <Button
                        variant="outline"
                        className="text-orange-500 border-orange-500 h-9 sm:h-10 text-xs sm:text-sm"
                        onClick={() => handleOpen("suspend")}
                    >
                        <AlertCircle className="mr-2 h-4 w-4" />
                        Suspend
                    </Button>

                    <Button
                        variant="outline"
                        className="text-red-500 border-red-500 h-9 sm:h-10 text-xs sm:text-sm"
                        onClick={() => handleOpen("banned")}
                    >
                        <Ban className="mr-2 h-4 w-4" />
                        Ban
                    </Button>

                    <Button
                        className="bg-red-600 hover:bg-red-700 text-white h-9 sm:h-10 text-xs sm:text-sm"
                        onClick={() => handleOpen("delete")}
                    >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Seller
                    </Button>

                </CardContent>
            </Card>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-md">

                    <DialogHeader>
                        <DialogTitle className="text-sm sm:text-base">
                            {actionType === "suspend" && "Suspend Seller"}
                            {actionType === "banned" && "Ban Seller"}
                            {actionType === "delete" && "Delete Seller"}
                        </DialogTitle>

                        <DialogDescription className="text-xs sm:text-sm">
                            {actionType === "delete"
                                ? "This will permanently remove the seller. This action cannot be undone."
                                : "Provide a reason. The seller will see this message in their dashboard."}
                        </DialogDescription>
                    </DialogHeader>

                    {actionType !== "delete" && (
                        <Textarea
                            className="text-xs sm:text-sm min-h-[80px]"
                            placeholder="Enter reason (e.g. violating policies, fake listings...)"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                    )}

                    <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                        <Button
                            variant="outline"
                            className="h-9 text-xs sm:text-sm"
                            onClick={() => setOpen(false)}
                        >
                            Cancel
                        </Button>

                        <Button
                            variant={actionType === "delete" ? "destructive" : "default"}
                            className={`h-9 text-xs sm:text-sm ${actionType === "delete" ? "bg-red-600 hover:bg-red-700 text-white" : ""}`}
                            onClick={actionType === "delete" ? handleDelete : handleConfirm}
                            disabled={loading}
                        >
                            Confirm {actionType?.charAt(0).toUpperCase() + actionType?.slice(1)}
                        </Button>
                    </DialogFooter>

                </DialogContent>
            </Dialog>
        </>
    );
};

export default SellerManagement;
