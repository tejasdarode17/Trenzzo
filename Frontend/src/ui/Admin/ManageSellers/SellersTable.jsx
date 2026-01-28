import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatDate } from "@/utils/formatDate"
import { useNavigate } from "react-router-dom"
import { SellerVerificationBadge } from "./VerificationBadge"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

const SellersTable = ({ sellers = [], loading, pages, page, onPageChange }) => {
    const navigate = useNavigate()

    return (
        <Card>

            {/* Header */}
            <CardHeader className="sm:px-2">
                <CardTitle className="text-sm sm:text-base">Seller's List</CardTitle>
            </CardHeader>

            {/* Content */}
            <CardContent className="p-0 sm:p-6 sm:pt-0">

                {/* Mobile Scroll Container */}
                <div className="w-full overflow-x-auto">

                    <Table>

                        <TableHeader>
                            {/* Mobile Header */}
                            <TableRow className="sm:hidden">
                                <TableHead>Username</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>

                            {/* Desktop Header */}
                            <TableRow className="hidden sm:table-row">
                                <TableHead>Username</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Products</TableHead>
                                <TableHead>Registered</TableHead>
                            </TableRow>

                        </TableHeader>


                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="py-10 text-center">
                                        <Loader2 className="animate-spin mx-auto" size={26} />
                                    </TableCell>
                                </TableRow>
                            ) : sellers.length > 0 ? (

                                sellers.map((s) => (
                                    <TableRow
                                        key={s._id}
                                        className="cursor-pointer hover:bg-slate-50"
                                        onClick={() => navigate(`/admin/seller/${s._id}`)}
                                    >

                                        {/* Username */}
                                        <TableCell className="font-medium text-xs sm:text-sm">
                                            {s.username || "N/A"}
                                        </TableCell>

                                        {/* Email (hide on mobile) */}
                                        <TableCell className="hidden sm:table-cell text-sm">
                                            {s.email || "N/A"}
                                        </TableCell>

                                        {/* Status */}
                                        <TableCell>
                                            <SellerVerificationBadge seller={s} />
                                        </TableCell>

                                        {/* Products (hide on mobile) */}
                                        <TableCell className="hidden sm:table-cell text-sm">
                                            {s?.products?.length ?? 0}
                                        </TableCell>

                                        {/* Date */}
                                        <TableCell className="text-[10px] sm:text-sm text-slate-500">
                                            {formatDate(s.createdAt)}
                                        </TableCell>

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
                </div>
            </CardContent>

            {/* Pagination */}
            {pages > 1 && (
                <CardFooter className="flex justify-center py-3 sm:py-4">
                    <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm">

                        <Button
                            size="sm"
                            variant="outline"
                            disabled={page === 1}
                            onClick={() => onPageChange(prev => Math.max(prev - 1, 1))}
                        >
                            Prev
                        </Button>

                        <span className="px-2 sm:px-4 py-1 border rounded-lg bg-white shadow-sm font-medium">
                            {page} / {pages}
                        </span>

                        <Button
                            size="sm"
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
