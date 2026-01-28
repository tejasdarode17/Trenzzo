import { useMemo } from "react";
import { useSelector } from "react-redux";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, } from "recharts";
import { useNavigate } from "react-router-dom";
import { useSellerStats } from "@/hooks/seller/useSellerStats";
import { Package2, Plus } from "lucide-react";

export default function SellerDashboard() {
    const auth = useSelector((s) => s.auth || {});
    const navigate = useNavigate();

    const username = auth.userData?.username || "Seller";
    const { data: stats, isLoading: statsLoading } = useSellerStats();

    const totalRevenue = stats?.totalRevenue ?? 0;
    const monthlyRevenue = stats?.monthRevenue ?? 0;
    const totalOrders = stats?.totalOrders ?? 0;
    const totalProducts = stats?.totalProducts ?? 0;

    const revenueTrend = useMemo(() => {
        const breakdown = stats?.monthlyBreakdown || [];
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        return monthNames.map((name, index) => ({
            month: name,
            revenue: breakdown[index] || 0,
        }));
    }, [stats?.monthlyBreakdown]);

    return (
        <div className="space-y-8 p-4 sm:p-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900">
                        Welcome back, {username}
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">Store overview & performance</p>
                </div>

                <Button variant="secondary" onClick={() => navigate("/seller/add-product")}>
                    New product
                </Button>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Products */}
                <Card
                    role="button"
                    tabIndex={0}
                    onClick={() => navigate("/seller/products")}
                    className="cursor-pointer hover:shadow-sm transition"
                >
                    <CardContent>
                        <div className="text-sm text-slate-500">Products</div>
                        <div className="mt-2 flex items-baseline justify-between">
                            <div className="text-3xl font-bold text-sky-600">
                                {statsLoading ? "—" : totalProducts}
                            </div>
                            <Badge className="bg-sky-100 text-sky-800">Live</Badge>
                        </div>
                        <div className="text-xs text-slate-400 mt-1">Total products in your store</div>
                    </CardContent>
                </Card>

                {/* Orders */}
                <Card
                    role="button"
                    tabIndex={0}
                    onClick={() => navigate("/seller/orders")}
                    className="cursor-pointer hover:shadow-sm transition"
                >
                    <CardContent>
                        <div className="text-sm text-slate-500">Total Orders</div>
                        <div className="mt-2 flex items-baseline justify-between">
                            <div className="text-3xl font-bold text-emerald-600">
                                {statsLoading ? "—" : totalOrders}
                            </div>
                            <Badge className="bg-emerald-100 text-emerald-800">Orders</Badge>
                        </div>
                        <div className="text-xs text-slate-400 mt-1">Orders received till date</div>
                    </CardContent>
                </Card>

                {/* Total Revenue */}
                <Card>
                    <CardContent>
                        <div className="text-sm text-slate-500">Total Revenue</div>
                        <div className="mt-2">
                            {statsLoading ? (
                                <div className="h-8 w-24 bg-slate-200 rounded animate-pulse" />
                            ) : (
                                <div className="text-3xl font-bold text-indigo-600">₹{totalRevenue}</div>
                            )}
                        </div>
                        <div className="text-xs text-slate-400 mt-1">Revenue captured today</div>
                    </CardContent>
                </Card>

                {/* Monthly Revenue */}
                <Card>
                    <CardContent>
                        <div className="text-sm text-slate-500">Monthly Revenue</div>
                        <div className="mt-2">
                            {statsLoading ? (
                                <div className="h-8 w-24 bg-slate-200 rounded animate-pulse" />
                            ) : (
                                <div className="text-3xl font-bold text-purple-600">₹{monthlyRevenue}</div>
                            )}
                        </div>
                        <div className="text-xs text-slate-400 mt-1">Revenue this month</div>
                    </CardContent>
                </Card>
            </div>

            {/* Revenue Chart */}
            <Card className="">
                <CardHeader>
                    <CardTitle>Revenue (last 12 months)</CardTitle>
                </CardHeader>

                <CardContent className="h-64 m-0 p-0">
                    <ResponsiveContainer width="90%" height="100%">
                        <LineChart data={revenueTrend} margin={{ top: 8, right: 12, left: 0, bottom: 8 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="revenue" stroke="#6366F1" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>

                <CardFooter className="text-xs text-slate-500">
                    Revenue shows gross value — net payouts will differ.
                </CardFooter>
            </Card>
        </div>
    );
}
