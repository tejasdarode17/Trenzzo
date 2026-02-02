import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { User, Mail, Edit, Save, X, AlertCircle, Loader2 } from 'lucide-react'
import axios from 'axios'
import { toast } from 'sonner'

const UserProfilePersonalInformation = () => {
    const { userData } = useSelector((store) => store.auth)
    const [isEditMode, setIsEditMode] = useState(false)
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const [userFormData, setUserFormData] = useState({
        username: userData?.username || "",
        email: userData?.email || ""
    })

    useEffect(() => {
        setUserFormData({
            username: userData?.username || "",
            email: userData?.email || ""
        });
    }, [userData]);

    async function handleSave() {
        try {
            setLoading(true)
            setError("")
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/user/info`, userFormData,
                { withCredentials: true }
            )
            toast.success(response?.data?.message)
            setIsEditMode(false)
        } catch (error) {
            setError(error?.response?.data?.message || "Something went wrong on server")
        } finally {
            setLoading(false)
        }
    }

    function handleCancel() {
        setUserFormData({
            username: userData.username || "",
            email: userData.email || ""
        })
        setError("")
        setIsEditMode(false)
    }

    return (
        <Card className="border-gray-200 shadow-sm">
            <CardHeader className="pb-4">
                <div className="flex justify-between items-center">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <User className="w-5 h-5 text-amber-500" />
                        Personal Information
                    </CardTitle>
                    {!isEditMode && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIsEditMode(true)}
                            className="border-gray-300 hover:bg-gray-50"
                        >
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                        </Button>
                    )}
                </div>
            </CardHeader>

            <CardContent>
                {!isEditMode ? (
                    <div className="space-y-6">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                                <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <User className="w-5 h-5 text-amber-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Full Name</p>
                                    <p className="font-medium text-gray-900">{userFormData?.username}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <Mail className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Email Address</p>
                                    <p className="font-medium text-gray-900">{userFormData?.email}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="username" className="text-sm font-medium">
                                    Full Name
                                </Label>
                                <Input
                                    id="username"
                                    value={userFormData?.username}
                                    onChange={(e) => setUserFormData(prev => ({ ...prev, username: e.target.value }))}
                                    placeholder="Enter your full name"
                                    className="border-gray-300 focus:border-amber-500 focus:ring-amber-500"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-sm font-medium">
                                    Email Address
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={userFormData?.email}
                                    onChange={(e) => setUserFormData(prev => ({ ...prev, email: e.target.value }))}
                                    placeholder="Enter your email address"
                                    className="border-gray-300 focus:border-amber-500 focus:ring-amber-500"
                                />
                            </div>

                            {error && (
                                <div className="flex items-center gap-2 p-3 rounded-md border border-red-300 bg-red-50 text-red-700">
                                    <AlertCircle className="w-4 h-4 text-red-600" />
                                    <p className="text-sm font-medium">{error}</p>
                                </div>
                            )}

                        </div>

                        <div className="flex gap-3 pt-2">
                            <Button
                                onClick={handleSave}
                                className="bg-amber-500 hover:bg-amber-600 text-white flex-1"
                            >
                                <Save className="w-4 h-4 mr-2" />
                                {loading ? <Loader2 className='animate-spin'></Loader2> : "Save Changes"}
                            </Button>
                            <Button
                                variant="outline"
                                onClick={handleCancel}
                                className="flex-1 border-gray-300 hover:bg-gray-50"
                            >
                                <X className="w-4 h-4 mr-2" />
                                Cancel
                            </Button>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

export default UserProfilePersonalInformation