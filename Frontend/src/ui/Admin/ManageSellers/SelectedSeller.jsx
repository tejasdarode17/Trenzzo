import { useParams } from "react-router-dom";
import { formatDate } from "@/utils/formatDate";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SellerVerificationBadge } from "./VerificationBadge";
import SellerManagement from "./SellerManagement";
import { ApproveRejectButton } from "./ApproveRejectButton";
import { useSeller } from "@/hooks/admin/useSeller";

const SelectedSeller = () => {
    const { id } = useParams();

    const { data, isLoading: loading } = useSeller(id)
    const seller = data?.seller


    if (loading) return <p className="p-6">Loading seller...</p>;
    if (!seller) return <p className="p-6">Seller not found</p>;

    return (
        <div className="p-6 space-y-6">

            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-bold text-slate-800">{seller.username}</h1>
                    <div className="hidden sm:inline">
                        <SellerVerificationBadge seller={seller} />
                    </div>
                </div>

                <ApproveRejectButton seller={seller} />
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* Profile Info */}
                <Card>
                    <CardHeader>
                        <CardTitle>Profile Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm text-slate-700">
                        <Info label="Email" value={seller.email} />
                        <Info label="Phone" value={seller.phone || "N/A"} />
                        <Info label="Address" value={seller.businessAddress || "N/A"} />
                        <Info label="Joined" value={formatDate(seller.createdAt)} />
                        <Info label="Status">
                            <Badge className={seller.status === "approved" ? "bg-green-500" : seller.status === "pending" ? "bg-yellow-500" : "bg-red-500"}>
                                {seller.status}
                            </Badge>
                        </Info>
                    </CardContent>
                </Card>

                {/* Platform Insights */}
                <Card>
                    <CardHeader>
                        <CardTitle>Platform Insights</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm text-slate-700">
                        <Info label="Total Products" value={seller.products?.length ?? 0} />
                        <Info label="Rating" value={seller.rating || "0"} />
                        <Info
                            label="Total Sales"
                            value={seller.sales || "0"}
                        />
                        <Info
                            label="Reports"
                            value={seller.reportCount || "0"}
                        />
                    </CardContent>
                </Card>
            </div>

            <div>
                <SellerManagement seller={seller} />
            </div>

        </div>
    );
};

const Info = ({ label, value, children }) => (
    <div className="flex items-center justify-between">
        <span className="text-slate-500">{label}</span>
        {children ? <div>{children}</div> : <span>{value}</span>}
    </div>
);

export default SelectedSeller;
