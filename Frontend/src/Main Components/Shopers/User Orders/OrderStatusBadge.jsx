import { Badge } from "@/components/ui/badge";


const OrderStatusBadge = ({ order }) => {
    return (
        <div>
            {order?.items?.status === "ordered" && (
                <Badge className="bg-yellow-500 text-white">Ordered</Badge>
            )}
            {order.orderStatus === "shipped" && (
                <Badge className="bg-green-500 text-white">Paid</Badge>
            )}
            {order.orderStatus === "delivered" && (
                <Badge className="bg-orange-500 text-white">Failed</Badge>
            )}
            {order.orderStatus === "cancelled" && (
                <Badge className="bg-red-500 text-white">Refunded</Badge>
            )}
        </div>
    );
}


export default OrderStatusBadge