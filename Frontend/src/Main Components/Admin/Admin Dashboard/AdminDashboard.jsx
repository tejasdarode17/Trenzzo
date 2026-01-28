import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { formatDistanceToNowStrict } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { fetchAdminStats } from "@/api/admin.api";

const sampleTopSellers = [
    { name: "alice", products: 42 },
    { name: "bob", products: 34 },
    { name: "charlie", products: 28 },
    { name: "david", products: 20 },
    { name: "eve", products: 12 },
];

export default function AdminDashboardCarded() {

    const navigate = useNavigate();

    const { data } = useQuery({
        queryKey: ["adminStats"],
        queryFn: fetchAdminStats
    })

    const totals = data?.totals || { all: 0, pending: 0 };
    const recentSellers = data?.recentSellers || [];
    const topSellers = data?.topSellers || sampleTopSellers;

    return (
        <div className="p-3 sm:p-4 lg:p-6 space-y-5">

            {/* Header */}
            <div className="flex flex-col gap-2">
                <h1 className="text-lg sm:text-xl lg:text-3xl font-semibold text-slate-800">
                    Platform Dashboard
                </h1>
                <p className="text-xs sm:text-sm text-slate-500">
                    Overview — health, safety & urgent actions
                </p>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">

                <Card asChild>
                    <div className="p-2.5 sm:p-4 cursor-pointer"
                        onClick={() => navigate('/admin/sellers?status=all')}>
                        <div className="text-xs text-slate-500">Total Sellers</div>
                        <div className="mt-1.5 flex items-center justify-between">
                            <div className="text-lg sm:text-2xl font-bold text-sky-600">
                                {totals.all ?? 0}
                            </div>
                            <Badge className="bg-sky-100 text-sky-800 text-[10px] sm:text-xs">
                                Live
                            </Badge>
                        </div>
                        <div className="text-[10px] sm:text-xs text-slate-400 mt-0.5">
                            Registered sellers
                        </div>
                    </div>
                </Card>

                <Card asChild>
                    <div className="p-2.5 sm:p-4 cursor-pointer"
                        onClick={() => navigate('/admin/sellers?status=pending')}>
                        <div className="text-xs text-slate-500">Pending</div>
                        <div className="mt-1.5 flex items-center justify-between">
                            <div className="text-lg sm:text-2xl font-bold text-yellow-600">
                                {totals.pending ?? 0}
                            </div>
                            <Badge className="bg-yellow-100 text-yellow-800 text-[10px] sm:text-xs">
                                Review
                            </Badge>
                        </div>
                        <div className="text-[10px] sm:text-xs text-slate-400 mt-0.5">
                            Awaiting approval
                        </div>
                    </div>
                </Card>

                {/* <Card asChild>
                    <div className="p-2.5 sm:p-4 cursor-pointer col-span-2 sm:col-span-1"
                        onClick={() => navigate('/admin/reports')}>
                        <div className="text-xs text-slate-500">Reported</div>
                        <div className="mt-1.5 flex items-center justify-between">
                            <div className="text-lg sm:text-2xl font-bold text-rose-600">
                                {totals.reported ?? 0}
                            </div>
                            <Badge className="bg-rose-100 text-rose-800 text-[10px] sm:text-xs">
                                Action
                            </Badge>
                        </div>
                        <div className="text-[10px] sm:text-xs text-slate-400 mt-0.5">
                            Flagged products
                        </div>
                    </div>
                </Card> */}

            </div>

            {/* Priority Actions */}
            <Card>
                <CardHeader className="sm:px-2">
                    <CardTitle className="text-sm sm:text-base">Priority Actions</CardTitle>
                </CardHeader>
                <CardContent className="">
                    <ul className="space-y-3">
                        {[
                            {
                                color: "bg-yellow-500",
                                title: "Pending sellers",
                                sub: `${totals.pending ?? 0} pending`,
                                action: () => navigate('/admin/sellers?status=pending')
                            },
                            {
                                color: "bg-rose-500",
                                title: "Reported products",
                                sub: `${totals.reported ?? 0} reports`,
                                action: () => navigate('/admin/reports')
                            },
                            {
                                color: "bg-slate-500",
                                title: "Suspended sellers",
                                sub: "Review suspended accounts",
                                action: () => navigate('/admin/sellers?status=suspend')
                            }
                        ].map((item, i) => (
                            <li key={i} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                                    <div>
                                        <div className="text-xs sm:text-sm font-medium">{item.title}</div>
                                        <div className="text-[10px] sm:text-xs text-slate-400">{item.sub}</div>
                                    </div>
                                </div>
                                <Button size="sm" variant="ghost" onClick={item.action}>
                                    View
                                </Button>
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>

            {/* Tables + Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* Recent Sellers */}
                <Card>
                    <CardHeader className="sm:px-2">
                        <CardTitle className="text-sm sm:text-base">Recent Sellers</CardTitle>
                    </CardHeader>
                    <CardContent className="p-2">
                        <div className="w-full overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Seller</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Joined</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {recentSellers.map((s) => (
                                        <TableRow
                                            key={s._id}
                                            className="hover:bg-slate-50 cursor-pointer"
                                            onClick={() => navigate(`/admin/seller/${s._id}`)}
                                        >
                                            <TableCell className="text-xs sm:text-sm">{s.username}</TableCell>
                                            <TableCell>
                                                <Badge className="uppercase text-[10px] sm:text-xs">{s.status}</Badge>
                                            </TableCell>
                                            <TableCell className="text-[10px] sm:text-xs text-slate-500">
                                                {formatDistanceToNowStrict(new Date(s.createdAt))} ago
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>

                        <div className="mt-2 text-right px-3 sm:px-0">
                            <Button variant="link" size="sm" onClick={() => navigate('/admin/sellers')}>
                                View all
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Chart */}
                <Card className="">
                    <CardHeader className="sm:px-2 m-0">
                        <CardTitle className="text-sm sm:text-base m-0">
                            Top Sellers
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="h-44 sm:h-56 p-0">
                        <ResponsiveContainer width="80%" height="100%">
                            <BarChart
                                data={topSellers}
                                margin={{ top: 8, right: 8, left: 0, bottom: 8 }}
                                barCategoryGap={24}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                                <YAxis tick={{ fontSize: 10 }} />
                                <Tooltip />
                                <Bar dataKey="products" fill="#0EA5A4" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

            </div>
        </div>
    );
}
