import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line, } from "recharts";
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
    const recentSellers = data?.recentSellers
    const topSellers = data?.topSellers || sampleTopSellers;

    return (
        <div className="p-6 space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-semibold text-slate-800">Platform Dashboard</h1>
                    <p className="text-sm text-slate-500 mt-1">Overview — health, safety & urgent actions</p>
                </div>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card asChild>
                    <div className="p-4 cursor-pointer" onClick={() => navigate('/admin/sellers?status=all')}>
                        <div className="text-sm text-slate-500">Total Sellers</div>
                        <div className="mt-2 flex items-baseline justify-between">
                            <div className="text-2xl font-bold text-sky-600">{totals.all ?? 0}</div>
                            <Badge className="bg-sky-100 text-sky-800">Live</Badge>
                        </div>
                        <div className="text-xs text-slate-400 mt-1">Total registered sellers</div>
                    </div>
                </Card>

                <Card asChild>
                    <div className="p-4 cursor-pointer" onClick={() => navigate('/admin/sellers?status=pending')}>
                        <div className="text-sm text-slate-500">Pending Approvals</div>
                        <div className="mt-2 flex items-baseline justify-between">
                            <div className="text-2xl font-bold text-yellow-600">{totals.pending ?? 0}</div>
                            <Badge className="bg-yellow-100 text-yellow-800">Review</Badge>
                        </div>
                        <div className="text-xs text-slate-400 mt-1">Sellers waiting for approval</div>
                    </div>
                </Card>

                <Card asChild>
                    <div className="p-4 cursor-pointer" onClick={() => navigate('/admin/reports')}>
                        <div className="text-sm text-slate-500">Reported Products</div>
                        <div className="mt-2 flex items-baseline justify-between">
                            <div className="text-2xl font-bold text-rose-600">{totals.reported ?? 0}</div>
                            <Badge className="bg-rose-100 text-rose-800">Action</Badge>
                        </div>
                        <div className="text-xs text-slate-400 mt-1">Products flagged by users</div>
                    </div>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Priority Actions</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-2">
                        <li className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                <div>
                                    <div className="text-sm font-medium">Sellers awaiting approval</div>
                                    <div className="text-xs text-slate-400">{totals.pending ?? 0} pending</div>
                                </div>
                            </div>
                            <Button variant="ghost" onClick={() => navigate('/admin/sellers?status=pending')}>Review</Button>
                        </li>

                        <li className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full bg-rose-500" />
                                <div>
                                    <div className="text-sm font-medium">Reported products</div>
                                    <div className="text-xs text-slate-400">{totals.reported ?? 0} new reports</div>
                                </div>
                            </div>
                            <Button variant="ghost" onClick={() => navigate('/admin/reports')}>Review</Button>
                        </li>

                        <li className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full bg-slate-500" />
                                <div>
                                    <div className="text-sm font-medium">Suspended sellers</div>
                                    <div className="text-xs text-slate-400">Quick look at suspended accounts</div>
                                </div>
                            </div>
                            <Button variant="ghost" onClick={() => navigate('/admin/sellers?status=suspend')}>View</Button>
                        </li>
                    </ul>
                </CardContent>
            </Card>


            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Sellers</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Seller</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Joined</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {(recentSellers || []).map((s) => (
                                    <TableRow key={s._id} className="hover:bg-slate-50 cursor-pointer" onClick={() => navigate(`/admin/seller/${s._id}`)}>
                                        <TableCell>{s.username}</TableCell>
                                        <TableCell><Badge className="uppercase text-xs">{s.status}</Badge></TableCell>
                                        <TableCell className="text-sm text-slate-500">{formatDistanceToNowStrict(new Date(s.createdAt))} ago</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <div className="mt-4 text-right">
                            <Button variant="link" onClick={() => navigate('/admin/sellers')}>View all sellers</Button>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Top 5 Sellers (by products)</CardTitle>
                    </CardHeader>
                    <CardContent className="h-56">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={topSellers} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
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
