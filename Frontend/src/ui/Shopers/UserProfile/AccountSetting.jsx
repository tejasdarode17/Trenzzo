import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import axios from 'axios'
import { Lock, Eye, EyeOff, CheckCircle, Loader2, AlertCircle } from 'lucide-react'
import React, { useState } from 'react'
import { toast } from 'sonner'

const AccountSettings = () => {
    const [showCurrentPassword, setShowCurrentPassword] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [passwordChanged, setPasswordChanged] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    })

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }


    async function handleSubmit(e) {
        e.preventDefault()

        if (formData.newPassword !== formData.confirmPassword) {
            toast.error("New passwords don't match")
            return
        }

        if (formData.newPassword.length < 6) {
            toast.error("Password must be at least 6 characters")
            return
        }

        try {
            setLoading(true)
            setError("")
            setPasswordChanged(false)
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/user/change-password`,
                {
                    currentPassword: formData.currentPassword,
                    newPassword: formData.newPassword
                },
                { withCredentials: true }
            )
            setPasswordChanged(true)
            setFormData({
                currentPassword: "",
                newPassword: "",
                confirmPassword: ""
            });
            setShowCurrentPassword(false);
            setShowNewPassword(false);
            setShowConfirmPassword(false);
        } catch (error) {
            setError(error?.response?.data?.message || "Something Went wrong on server!")
        } finally {
            setLoading(false)
        }

    }


    return (
        <Card className="border-gray-200 shadow-sm">
            <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                    <Lock className="w-5 h-5 text-amber-500" />
                    Change Password
                </CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                    Update your password to keep your account secure
                </p>
            </CardHeader>

            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Current Password */}
                    <div className="space-y-3">
                        <Label htmlFor="currentPassword" className="text-sm font-medium">
                            Current Password
                        </Label>
                        <div className="relative">
                            <Input
                                id="currentPassword"
                                type={showCurrentPassword ? "text" : "password"}
                                value={formData.currentPassword}
                                onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                                placeholder="Enter your current password"
                                className="border-gray-300 focus:border-amber-500 focus:ring-amber-500 pr-10"
                                required
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            >
                                {showCurrentPassword ? (
                                    <EyeOff className="w-4 h-4 text-gray-500" />
                                ) : (
                                    <Eye className="w-4 h-4 text-gray-500" />
                                )}
                            </Button>
                        </div>
                    </div>

                    {/* New Password */}
                    <div className="space-y-3">
                        <Label htmlFor="newPassword" className="text-sm font-medium">
                            New Password
                        </Label>
                        <div className="relative">
                            <Input
                                id="newPassword"
                                type={showNewPassword ? "text" : "password"}
                                value={formData.newPassword}
                                onChange={(e) => handleInputChange('newPassword', e.target.value)}
                                placeholder="Enter new password"
                                className="border-gray-300 focus:border-amber-500 focus:ring-amber-500 pr-10"
                                required
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                            >
                                {showNewPassword ? (
                                    <EyeOff className="w-4 h-4 text-gray-500" />
                                ) : (
                                    <Eye className="w-4 h-4 text-gray-500" />
                                )}
                            </Button>
                        </div>
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-3">
                        <Label htmlFor="confirmPassword" className="text-sm font-medium">
                            Confirm New Password
                        </Label>
                        <div className="relative">
                            <Input
                                id="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                value={formData.confirmPassword}
                                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                                placeholder="Confirm your new password"
                                className="border-gray-300 focus:border-amber-500 focus:ring-amber-500 pr-10"
                                required
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? (
                                    <EyeOff className="w-4 h-4 text-gray-500" />
                                ) : (
                                    <Eye className="w-4 h-4 text-gray-500" />
                                )}
                            </Button>
                        </div>
                    </div>

                    {/* Success Message */}
                    {passwordChanged && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <CheckCircle className="w-5 h-5 text-green-600" />
                                </div>
                                <div>
                                    <p className="font-medium text-green-800">Password updated successfully!</p>
                                    <p className="text-sm text-green-700 mt-1">
                                        Your password has been changed. Please use your new password for future logins.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}


                    {error && (
                        <div className="flex items-center gap-2 p-3 rounded-md border border-red-300 bg-red-50 text-red-700">
                            <AlertCircle className="w-4 h-4 text-red-600" />
                            <p className="text-sm font-medium">{error}</p>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">
                        <Button
                            type="submit"
                            disabled={loading}
                            className="bg-amber-500 hover:bg-amber-600 text-white flex-1"
                        >
                            {loading ? <Loader2 className='animate-spin'></Loader2> : "Update"}
                        </Button>

                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' })
                                setIsSuccess(false)
                            }}
                            className="flex-1 border-gray-300 hover:bg-gray-50"
                        >
                            Reset Form
                        </Button>
                    </div>
                </form>



                {/* Security Tips */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                    <h4 className="font-medium text-gray-900 mb-3 text-sm">Security Tips:</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                        <li className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-1.5"></div>
                            <span>Use a unique password that you don't use elsewhere</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-1.5"></div>
                            <span>Change your password every 3-6 months</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-1.5"></div>
                            <span>Never share your password with anyone</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-1.5"></div>
                            <span>Consider using a password manager</span>
                        </li>
                    </ul>
                </div>
            </CardContent>
        </Card>
    )
}

export default AccountSettings