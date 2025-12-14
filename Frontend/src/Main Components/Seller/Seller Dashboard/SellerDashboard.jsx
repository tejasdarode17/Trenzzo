import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar, } from "recharts";
import { useNavigate } from "react-router-dom";


export default function SellerDashboard() {
    const seller = useSelector((s) => s.seller || {});
    const auth = useSelector((s) => s.auth || {});

    const products = seller.products || {};
    const revenue = seller.revenue || {};

    const username = auth.userData?.username || "Seller"
    const statsLoading = !!revenue.statsLoading;
    const totalRevenue = revenue.totalRevenue ?? 0;
    const monthlyRevenue = revenue.monthlyRevenue ?? 0;
    const yearlyRevenue = revenue.yearlyRevenue ?? 0;

    const totalProducts = products.totalProducts ?? products.total ?? 0;
    const totalOrders = revenue.totalOrdersDelivered ?? 0


    const navigate = useNavigate()

    const revenueTrend = useMemo(() => {
        const breakdown = revenue.monthlyBreakdown || [];
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        return monthNames.map((name, index) => ({
            month: name,
            revenue: breakdown[index] || 0
        }));

    }, [revenue.monthlyBreakdown]);


    return (
        <div className="space-y-8 p-6">
            {/* header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-semibold text-slate-900">Welcome back, {username}</h1>
                    <p className="text-sm text-slate-500 mt-1">Store overview & performance</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" onClick={() => navigate("/seller/add-product")}>New product</Button>
                </div>
            </div>

            {/* top KPI row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardContent>
                        <div className="text-sm text-slate-500">Products</div>
                        <div className="mt-2 flex items-baseline justify-between">
                            <div className="text-3xl font-bold text-sky-600">{totalProducts}</div>
                            <Badge className="bg-sky-100 text-sky-800">Live</Badge>
                        </div>
                        <div className="text-xs text-slate-400 mt-1">Total products in your store</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent>
                        <div className="text-sm text-slate-500">Total Orders</div>
                        <div className="mt-2 flex items-baseline justify-between">
                            <div className="text-3xl font-bold text-emerald-600">{totalOrders ?? 0}</div>
                            <Badge className="bg-emerald-100 text-emerald-800">Orders</Badge>
                        </div>
                        <div className="text-xs text-slate-400 mt-1">Orders received till date</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent>
                        <div className="text-sm text-slate-500">Total Revenue</div>
                        <div className="mt-2">
                            {statsLoading ? (
                                <div className="text-gray-400 animate-pulse">Loading…</div>
                            ) : (
                                <div className="text-3xl font-bold text-indigo-600">₹{totalRevenue}</div>
                            )}
                        </div>
                        <div className="text-xs text-slate-400 mt-1">Revenue captured today</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent>
                        <div className="text-sm text-slate-500">Monthly Revenue</div>
                        <div className="mt-2">
                            {statsLoading ? (
                                <div className="text-gray-400 animate-pulse">Loading…</div>
                            ) : (
                                <div className="text-3xl font-bold text-purple-600">₹{monthlyRevenue}</div>
                            )}
                        </div>
                        <div className="text-xs text-slate-400 mt-1">Revenue this month</div>
                    </CardContent>
                </Card>
            </div>

            {/* revenue area + top products */}
            <div className="">
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Revenue (last 12 months)</CardTitle>
                    </CardHeader>
                    <CardContent className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={revenueTrend} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey="revenue" stroke="#6366F1" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                    <CardFooter className="text-xs text-slate-500">Revenue shows gross value — net payouts will differ.</CardFooter>
                </Card>
            </div>
        </div>
    );
}
