import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";


const UserReturn = ({ item, order }) => {

    const [reason, setReason] = useState("");
    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(false)

    const navigate = useNavigate()

    async function handelProductReturnRequest(e, item, order) {
        try {
            e.preventDefault()
            setLoading(true)
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/return-req`,
                { itemId: item._id, orderId: order._id, reason },
                { withCredentials: true }
            );
            setLoading(false)
            setOpen(false)
            toast.success(response?.data?.message)
            if (response?.data?.success) {
                navigate("/orders")
            }
        } catch (error) {
            setLoading(false)
            setOpen(false)
            console.log(error);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="shadow-none">
                    Request Return / Refund
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-md">
                <form onSubmit={(e) => handelProductReturnRequest(e, item, order)} className="space-y-4">
                    <DialogHeader>
                        <h2 className="text-xl font-semibold">Request Return / Refund</h2>
                        <p className="text-sm text-gray-500">
                            Please tell us the reason for the return or refund
                        </p>
                    </DialogHeader>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="return-reason" className="text-sm font-medium text-gray-700">
                            Reason
                        </label>
                        <Input
                            id="return-reason"
                            type="text"
                            placeholder="Enter reason..."
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            required
                        />
                    </div>
                    <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white">
                        {loading ? <Loader2 className="animate-spin"></Loader2> : "Submit Request"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};


export default UserReturn