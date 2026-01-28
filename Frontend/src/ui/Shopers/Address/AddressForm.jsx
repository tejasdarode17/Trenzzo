import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, MapPin } from "lucide-react";
import { Button } from '@/components/ui/button';
import { Checkbox } from "@/components/ui/checkbox";

const AddressForm = ({ onSubmit, initialData = {}, loading, open, setOpen }) => {

    const [deliveryAddress, setDeliveryAddress] = useState({
        name: '',
        phoneNumber: '',
        pinCode: '',
        locality: '',
        address: '',
        city: '',
        state: '',
        landmark: '',
        label: 'Home',
        isDefault: false,
        ...initialData,
    });

    const [errors, setErrors] = useState({});

    function handleInputChange(field, value) {
        setDeliveryAddress(prev => ({ ...prev, [field]: value }));
        setErrors(prev => ({ ...prev, [field]: '' }));
    }

    function validateForm() {
        const newErrors = {};
        const requiredFields = [
            "name", "phoneNumber", "pinCode", "locality",
            "address", "city", "state", "landmark"
        ];

        requiredFields.forEach((field) => {
            if (!deliveryAddress[field]?.trim()) {
                newErrors[field] = "This field is required";
            }
        });

        if (deliveryAddress.phoneNumber && !/^[0-9]{10}$/.test(deliveryAddress.phoneNumber)) {
            newErrors.phoneNumber = "Enter a valid 10-digit phone number";
        }
        if (deliveryAddress.pinCode && !/^[0-9]{6}$/.test(deliveryAddress.pinCode)) {
            newErrors.pinCode = "Enter a valid 6-digit PIN code";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    function handleSubmit(e) {
        e.preventDefault();
        if (!validateForm()) return;
        onSubmit(deliveryAddress, setDeliveryAddress);
    }

    return (
        <Card className="border-gray-200 shadow-sm rounded-none">
            <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-amber-500" />
                    Delivery Address
                </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* Name + Phone */}
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input
                            id="fullName"
                            value={deliveryAddress.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            placeholder="Enter your full name"
                            className={errors.name ? "border-red-500" : ""}
                        />
                        {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="phoneNumber">Phone Number</Label>
                        <Input
                            id="phoneNumber"
                            value={deliveryAddress.phoneNumber}
                            onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                            placeholder="Enter your phone number"
                            className={errors.phoneNumber ? "border-red-500" : ""}
                        />
                        {errors.phoneNumber && <p className="text-red-500 text-xs">{errors.phoneNumber}</p>}
                    </div>
                </div>

                {/* Pincode + Locality */}
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="pinCode">PIN Code</Label>
                        <Input
                            id="pinCode"
                            value={deliveryAddress.pinCode}
                            onChange={(e) => handleInputChange('pinCode', e.target.value)}
                            placeholder="Enter 6-digit PIN code"
                            className={errors.pinCode ? "border-red-500" : ""}
                        />
                        {errors.pinCode && <p className="text-red-500 text-xs">{errors.pinCode}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="locality">Locality / Area</Label>
                        <Input
                            id="locality"
                            value={deliveryAddress.locality}
                            onChange={(e) => handleInputChange('locality', e.target.value)}
                            placeholder="Enter your area or locality"
                            className={errors.locality ? "border-red-500" : ""}
                        />
                        {errors.locality && <p className="text-red-500 text-xs">{errors.locality}</p>}
                    </div>
                </div>

                {/* Address Line */}
                <div className="space-y-2">
                    <Label htmlFor="address">Complete Address</Label>
                    <Input
                        id="address"
                        value={deliveryAddress.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        placeholder="Flat / House No., Building, Street, etc."
                        className={errors.address ? "border-red-500" : ""}
                    />
                    {errors.address && <p className="text-red-500 text-xs">{errors.address}</p>}
                </div>

                {/* City / State / Landmark */}
                <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input
                            id="city"
                            value={deliveryAddress.city}
                            onChange={(e) => handleInputChange('city', e.target.value)}
                            placeholder="Enter city"
                            className={errors.city ? "border-red-500" : ""}
                        />
                        {errors.city && <p className="text-red-500 text-xs">{errors.city}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="state">State</Label>
                        <Input
                            id="state"
                            value={deliveryAddress.state}
                            onChange={(e) => handleInputChange('state', e.target.value)}
                            placeholder="Enter state"
                            className={errors.state ? "border-red-500" : ""}
                        />
                        {errors.state && <p className="text-red-500 text-xs">{errors.state}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="landmark">Landmark</Label>
                        <Input
                            id="landmark"
                            value={deliveryAddress.landmark}
                            onChange={(e) => handleInputChange('landmark', e.target.value)}
                            placeholder="Near (optional)"

                        />
                        {errors.landmark && <p className="text-red-500 text-xs">{errors.landmark}</p>}
                    </div>
                </div>

                {/* Label + Default */}
                <div className="grid md:grid-cols-2 gap-4 items-center">
                    <div className="space-y-2">
                        <Label htmlFor="label">Address Label</Label>
                        <select
                            id="label"
                            value={deliveryAddress.label}
                            onChange={(e) => handleInputChange('label', e.target.value)}
                            className="border rounded-md w-full p-2 text-sm"
                        >
                            <option value="Home">Home</option>
                            <option value="Work">Work</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div className="flex items-center space-x-2 mt-6">
                        <Checkbox
                            id="isDefault"
                            checked={deliveryAddress.isDefault}
                            onCheckedChange={(checked) => handleInputChange('isDefault', checked)}
                        />
                        <Label htmlFor="isDefault" className="text-sm">
                            Set as default address
                        </Label>
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-2 items-center pt-4">
                    <Button
                        onClick={handleSubmit}
                        className={`font-semibold text-white ${loading ? "bg-gray-400" : "bg-amber-500 hover:bg-amber-600"}`}
                        disabled={loading}
                    >
                        {loading ? (
                            <Loader2 className="animate-spin w-6 h-6" />
                        ) : (
                            "SAVE AND DELIVER HERE"
                        )}
                    </Button>

                    <Button variant="outline" onClick={() => setOpen(false)}>
                        CANCEL
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default AddressForm;
