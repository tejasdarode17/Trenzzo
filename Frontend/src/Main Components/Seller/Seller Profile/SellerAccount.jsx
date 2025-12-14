import React, { useState } from 'react'
import { Lock, Key, Eye, EyeOff, CheckCircle, AlertCircle, Loader2, Mail, User, Edit, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import axios from 'axios'
import { toast } from 'sonner'
import { useSelector } from 'react-redux'

const SellerAccount = () => {
    const [showCurrentPassword, setShowCurrentPassword] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [passwordChanged, setPasswordChanged] = useState(false)
    const [error, setError] = useState("")

    const [editMode, setEditMode] = useState(false)
    const [loadingInfo, setLoadingInfo] = useState(false)
    const [infoError, setInfoError] = useState("")

    const { userData } = useSelector((store) => store.auth)

    const [sellerInfo, setSellerInfo] = useState({
        name: userData.username,
        email: userData.email,
        address: userData.businessAddress
    })


    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    })
    function handleChange(e) {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }


    async function handleSubmit(e) {
        try {

            e.preventDefault()
            if (formData.newPassword !== formData.confirmPassword) {
                toast.error("New passwords don't match")
                return
            }
            if (formData.newPassword.length < 6) {
                toast.error("Password must be at least 6 characters")
                return
            }

            setLoading(true)
            setError("")
            setPasswordChanged(false)
            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/seller/change-password`,
                {
                    currentPassword: formData.currentPassword,
                    newPassword: formData.newPassword
                },
                { withCredentials: true }
            )

            toast.success("Password changed successfully!")
            setPasswordChanged(true)

            setFormData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            })

            setTimeout(() => setPasswordChanged(false), 3000)
        } catch (error) {
            setError(error?.response?.data?.message || "Something Went wrong on server!")
        } finally {
            setLoading(false)
        }
    }

    async function handlePersonalInfoSubmit(e) {
        try {
            e.preventDefault()
            setLoadingInfo(true)
            setInfoError("")

            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/seller/info`, sellerInfo,
                { withCredentials: true }
            )

            toast.success(response?.data?.message)
            setEditMode(false)

        } catch (error) {
            console.log(error);
            setInfoError(error?.response?.data?.message || "Something went wrong on server")
        } finally {
            setLoadingInfo(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 p-6">
            <div className="max-w-4xl mx-auto space-y-8">

                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-blue-700 bg-clip-text text-transparent">
                        Account Settings
                    </h1>
                    <p className="text-slate-600 mt-2">
                        Manage your personal information and account security
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* LEFT COLUMN - PERSONAL INFORMATION */}
                    <div className="space-y-6">
                        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <User className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <h2 className="text-xl font-bold text-slate-800">
                                        Personal Information
                                    </h2>
                                </div>

                                {!editMode ? (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setEditMode(true)}
                                        className="border-slate-300 hover:bg-slate-50"
                                    >
                                        <Edit size={16} className="mr-2" />
                                        Edit
                                    </Button>
                                ) : (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            setEditMode(false)
                                            setSellerInfo({
                                                name: userData.username,
                                                email: userData.email,
                                                address: userData.businessAddress
                                            })
                                        }}
                                        className="border-slate-300 hover:bg-slate-50"
                                    >
                                        Cancel
                                    </Button>
                                )}
                            </div>

                            <form onSubmit={handlePersonalInfoSubmit}>
                                <div className="space-y-4">
                                    {/* NAME */}
                                    <div>
                                        <label className="text-sm font-medium text-slate-700 block mb-2">
                                            Full Name
                                        </label>
                                        {editMode ? (
                                            <Input
                                                type="text"
                                                name="name"
                                                value={sellerInfo.name}
                                                onChange={(e) =>
                                                    setSellerInfo({ ...sellerInfo, [e.target.name]: e.target.value })
                                                }
                                                required
                                                className="bg-white border-slate-300"
                                                placeholder="Enter your full name"
                                            />
                                        ) : (
                                            <p className="p-2 bg-slate-50 rounded border border-slate-200 text-slate-800">
                                                {sellerInfo.name}
                                            </p>
                                        )}
                                    </div>

                                    {/* EMAIL */}
                                    <div>
                                        <label className="text-sm font-medium text-slate-700 block mb-2">
                                            Email Address
                                        </label>
                                        {editMode ? (
                                            <Input
                                                type="email"
                                                name="email"
                                                value={sellerInfo.email}
                                                onChange={(e) => setSellerInfo({ ...sellerInfo, [e.target.name]: e.target.value })}
                                                required
                                                className="bg-white border-slate-300"
                                                placeholder="Enter your email"
                                            />
                                        ) : (
                                            <div className="flex items-center gap-2 p-2 bg-slate-50 rounded border border-slate-200">
                                                <Mail size={16} className="text-slate-500" />
                                                <span className="text-slate-800">{sellerInfo.email}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* BUSINESS ADDRESS */}
                                    <div>
                                        <label className="text-sm font-medium text-slate-700 block mb-2">
                                            Business Address
                                        </label>
                                        {editMode ? (
                                            <Input
                                                type="text"
                                                name="address"
                                                value={sellerInfo.address}
                                                onChange={(e) => setSellerInfo({ ...sellerInfo, [e.target.name]: e.target.value })}
                                                className="bg-white border-slate-300"
                                                placeholder="Enter your business address"
                                            />
                                        ) : (
                                            <p className="p-2 bg-slate-50 rounded border border-slate-200 text-slate-800">
                                                {sellerInfo.address}
                                            </p>
                                        )}
                                    </div>

                                    {/* ERROR */}
                                    {infoError && (
                                        <div className="flex items-center gap-2 p-3 rounded-md border border-red-300 bg-red-50 text-red-700">
                                            <AlertCircle className="w-4 h-4 text-red-600" />
                                            <p className="text-sm font-medium">{infoError}</p>
                                        </div>
                                    )}

                                    {/* SAVE BUTTON */}
                                    {editMode && (
                                        <Button
                                            type="submit"
                                            disabled={loadingInfo}
                                            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg mt-4"
                                        >
                                            {loadingInfo ? (
                                                <Loader2 className="animate-spin mr-2" size={16} />
                                            ) : (
                                                <Save className="mr-2" size={16} />
                                            )}
                                            Save Changes
                                        </Button>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>


                    {/* RIGHT COLUMN - PASSWORD CHANGE */}
                    <div className="space-y-6">
                        {/* Password Change Card */}
                        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200 p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <Lock className="w-5 h-5 text-blue-600" />
                                </div>
                                <h2 className="text-xl font-bold text-slate-800">
                                    Change Password
                                </h2>
                            </div>

                            {/* Success Message */}
                            {passwordChanged && (
                                <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                                        <div>
                                            <p className="font-medium text-emerald-800">Password Changed Successfully</p>
                                            <p className="text-emerald-700 text-sm mt-1">Your password has been updated</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* CURRENT PASSWORD */}
                                <div>
                                    <label className="text-sm font-medium text-slate-700 block mb-2">
                                        Current Password
                                    </label>
                                    <div className="relative">
                                        <Input
                                            type={showCurrentPassword ? "text" : "password"}
                                            name="currentPassword"
                                            value={formData.currentPassword}
                                            onChange={handleChange}
                                            placeholder="Enter your current password"
                                            required
                                            className="pl-10 pr-10 bg-white border-slate-300"
                                        />
                                        <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <button
                                            type="button"
                                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                                        >
                                            {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                </div>

                                {/* NEW PASSWORD */}
                                <div>
                                    <label className="text-sm font-medium text-slate-700 block mb-2">
                                        New Password
                                    </label>
                                    <div className="relative">
                                        <Input
                                            type={showNewPassword ? "text" : "password"}
                                            name="newPassword"
                                            value={formData.newPassword}
                                            onChange={handleChange}
                                            placeholder="Enter new password (min. 6 characters)"
                                            required
                                            minLength={6}
                                            className="pl-10 pr-10 bg-white border-slate-300"
                                        />
                                        <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <button
                                            type="button"
                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                                        >
                                            {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                </div>

                                {/* CONFIRM PASSWORD */}
                                <div>
                                    <label className="text-sm font-medium text-slate-700 block mb-2">
                                        Confirm New Password
                                    </label>
                                    <div className="relative">
                                        <Input
                                            type={showConfirmPassword ? "text" : "password"}
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            placeholder="Confirm your new password"
                                            required
                                            className="pl-10 pr-10 bg-white border-slate-300"
                                        />
                                        <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                                        >
                                            {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                </div>

                                {error && (
                                    <div className="flex items-center gap-2 p-3 rounded-md border border-red-300 bg-red-50 text-red-700">
                                        <AlertCircle className="w-4 h-4 text-red-600" />
                                        <p className="text-sm font-medium">{error}</p>
                                    </div>
                                )}

                                {/* SUBMIT BUTTON */}
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg py-3"
                                >
                                    {loading ? <Loader2 className='animate-spin'></Loader2> : "Change Password"}
                                </Button>
                            </form>
                        </div>

                        {/* Security Note */}
                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                            <p className="text-sm text-slate-600 text-center">
                                For security reasons, you'll be logged out of all devices after changing your password.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SellerAccount