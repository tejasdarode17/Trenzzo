import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Pencil, Plus } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import DeleteCategory from "./DeleteCategory";
import { useNavigate } from "react-router-dom";
import { useCatogery } from "@/hooks/admin/useCategory";

const AdminCategory = () => {
    const navigate = useNavigate();

    return (
        <div className="p-4 sm:p-6 space-y-4">

            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <h1 className="text-lg sm:text-xl font-semibold text-gray-800">
                    Categories
                </h1>

                <Button
                    onClick={() => navigate("/admin/add-category")}
                    variant="outline"
                    className="h-9 text-sm flex items-center gap-2"
                >
                    <Plus className="h-4 w-4" />
                    Add Category
                </Button>
            </div>

            <CategoryList />
        </div>
    );
};

const CategoryList = () => {
    const navigate = useNavigate();
    const { data: categories, isLoading } = useCatogery();

    return (
        <Card className="shadow-sm">
            <CardHeader className="">
                <CardTitle className="text-sm font-semibold text-gray-700">
                    Category List
                </CardTitle>
            </CardHeader>

            <CardContent className="p-0 sm:p-4">
                <Table>

                    {/* Compact Header */}
                    <TableHeader>
                        <TableRow>

                            {/* Mobile */}
                            <TableHead className="sm:hidden py-2 text-xs font-medium text-muted-foreground">
                                Category
                            </TableHead>
                            <TableHead className="sm:hidden py-2 text-xs font-medium text-muted-foreground text-right">
                                Actions
                            </TableHead>

                            {/* Desktop */}
                            <TableHead className="hidden sm:table-cell py-2 text-xs font-medium text-muted-foreground">
                                Image
                            </TableHead>
                            <TableHead className="hidden sm:table-cell py-2 text-xs font-medium text-muted-foreground">
                                Name
                            </TableHead>
                            <TableHead className="hidden sm:table-cell py-2 text-xs font-medium text-muted-foreground text-right">
                                Actions
                            </TableHead>

                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {(categories || []).map((cat) => (
                            <TableRow key={cat._id} className="hover:bg-slate-50">

                                {/* Mobile Cell */}
                                <TableCell className="sm:hidden py-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-md overflow-hidden border bg-gray-50 shrink-0">
                                            <img
                                                className="object-contain w-full h-full"
                                                src={cat?.image?.url}
                                                alt={cat.name}
                                            />
                                        </div>

                                        <span className="text-sm font-medium text-gray-800">
                                            {cat.name}
                                        </span>
                                    </div>
                                </TableCell>

                                {/* Mobile Actions */}
                                <TableCell className="sm:hidden py-3 text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button
                                            size="icon"
                                            variant="outline"
                                            className="h-8 w-8"
                                            onClick={() =>
                                                navigate(`/admin/edit-category/${cat._id}`, {
                                                    state: { cat },
                                                })
                                            }
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <DeleteCategory cat={cat} />
                                    </div>
                                </TableCell>

                                {/* Desktop Image */}
                                <TableCell className="hidden sm:table-cell py-3">
                                    <div className="w-12 h-12 rounded-md overflow-hidden border bg-gray-50">
                                        <img
                                            className="object-contain w-full h-full"
                                            src={cat?.image?.url}
                                            alt={cat.name}
                                        />
                                    </div>
                                </TableCell>

                                {/* Desktop Name */}
                                <TableCell className="hidden sm:table-cell py-3">
                                    <span className="font-medium text-gray-800">
                                        {cat.name}
                                    </span>
                                </TableCell>

                                {/* Desktop Actions */}
                                <TableCell className="hidden sm:table-cell py-3 text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button
                                            size="icon"
                                            variant="outline"
                                            className="h-9 w-9"
                                            onClick={() =>
                                                navigate(`/admin/edit-category/${cat._id}`, {
                                                    state: { cat },
                                                })
                                            }
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <DeleteCategory cat={cat} />
                                    </div>
                                </TableCell>

                            </TableRow>
                        ))}

                        {/* Empty / Loading State */}
                        {(!categories || categories.length === 0) && (
                            <TableRow>
                                <TableCell
                                    colSpan={5}
                                    className="text-center text-sm text-muted-foreground py-6"
                                >
                                    {isLoading ? "Loading categories..." : "No categories found"}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>

                </Table>
            </CardContent>
        </Card>
    );
};

export default AdminCategory;
