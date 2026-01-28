import { Badge } from "@/components/ui/badge";


export const SellerVerificationBadge = ({ seller }) => {
    return (
        <div>
            {seller.status === "pending" && (
                <Badge className="bg-yellow-500 text-white">Pending</Badge>
            )}
            {seller.status === "approved" && (
                <Badge className="bg-green-500 text-white">Approved</Badge>
            )}
            {seller.status === "suspend" && (
                <Badge className="bg-orange-500 text-white">Suspended</Badge>
            )}
            {seller.status === "banned" && (
                <Badge className="bg-red-500 text-white">Banned</Badge>
            )}
            {seller.status === "rejected" && (
                <Badge className="bg-gray-500 text-white">Rejected</Badge>
            )}
        </div>
    );
};