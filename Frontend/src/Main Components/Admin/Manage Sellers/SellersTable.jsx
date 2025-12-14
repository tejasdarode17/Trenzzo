import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatDate } from "@/utils/formatDate"
import { useNavigate } from "react-router-dom"
import { SellerVerificationBadge } from "./VerificationBadge"
import { ApproveRejectButton } from "./ApproveRejectButton"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

const SellersTable = ({ sellers = [], loading, pages, page, onPageChange }) => {
    const navigate = useNavigate()

    return (
        <Card>
            <CardHeader>
                <CardTitle>Seller List</CardTitle>
            </CardHeader>

            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Username</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Products</TableHead>
                            <TableHead>Rating</TableHead>
                            <TableHead>Registered</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={7} className="py-10 text-center">
                                    <Loader2 className="animate-spin mx-auto" size={28} />
                                </TableCell>
                            </TableRow>
                        ) : sellers.length > 0 ? (
                            sellers.map((s) => (
                                <TableRow
                                    key={s._id}
                                    className="cursor-pointer"
                                    onClick={() => navigate(`/admin/seller/${s._id}`)}
                                >
                                    <TableCell>{s.username || "N/A"}</TableCell>
                                    <TableCell>{s.email || "N/A"}</TableCell>
                                    <TableCell><SellerVerificationBadge seller={s} /></TableCell>
                                    <TableCell>{s?.products?.length ?? 0}</TableCell>
                                    <TableCell>{s?.rating ?? "—"}</TableCell>
                                    <TableCell>{formatDate(s.createdAt)}</TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={7} className="py-10 text-center text-gray-500 italic">
                                    🚫 No sellers found
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>

            {pages > 1 && (
                <CardFooter className="flex justify-center py-4">
                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            disabled={page === 1}
                            onClick={() => onPageChange(prev => Math.max(prev - 1, 1))}
                        >
                            Previous
                        </Button>

                        <span className="px-4 py-1 border rounded-lg bg-white shadow-sm font-medium">
                            Page {page} of {pages}
                        </span>

                        <Button
                            variant="outline"
                            disabled={page === pages}
                            onClick={() => onPageChange(prev => prev + 1)}
                        >
                            Next
                        </Button>
                    </div>
                </CardFooter>
            )}
        </Card>
    )
}

export default SellersTable
