import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Pencil, Plus } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import DeleteCategory from "./DeleteCategory";
import { useNavigate } from "react-router-dom";
import { useCatogery } from "@/hooks/admin/useCategory";

const AdminCategory = () => {
    const navigate = useNavigate()
    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-800">Categories</h1>
                <Button onClick={() => navigate("/admin/add-category")} variant="outline"><Plus></Plus> Add Category</Button>
            </div>
            <CategoryList />
        </div>
    );
};


const CategoryList = () => {
    const navigate = useNavigate()
    const { data: categories, isLoading: loading } = useCatogery()

    return (
        <Card>
            <CardHeader>
                <CardTitle>Category List</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Image</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {(categories || []).map((cat) => (
                            <TableRow key={cat._id}>
                                <TableCell>
                                    <div className="w-12 h-12 rounded-md overflow-hidden border bg-gray-50">
                                        <img
                                            className="object-contain w-full h-full"
                                            src={cat?.image?.url}
                                            alt={cat.name}
                                        />
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <p className="font-medium text-gray-800">{cat.name}</p>
                                </TableCell>
                                <TableCell className="text-right flex gap-2 justify-end">
                                    <Button onClick={() => navigate(`/admin/edit-category/${cat?._id}`, { state: { cat } })} variant="outline"> <Pencil></Pencil></Button>
                                    <DeleteCategory cat={cat} />
                                </TableCell>
                            </TableRow>
                        ))}

                        {(!categories || categories.length === 0) && (
                            <TableRow>
                                <TableCell
                                    colSpan={3}
                                    className="text-center text-gray-500 py-6"
                                >
                                    {loading ? "Loading categories..." : "No categories found"}
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


