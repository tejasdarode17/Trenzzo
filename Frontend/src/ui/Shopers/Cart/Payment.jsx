// import { useState } from "react"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Label } from "@/components/ui/label"
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
// import { Badge } from "@/components/ui/badge"
// import { CreditCard, } from "lucide-react"

// const Payment = () => {
//     return (
//         <div>
//             <Card className="border-gray-200 shadow-sm">
//                 <CardHeader className="pb-4">
//                     <CardTitle className="text-lg flex items-center gap-2">
//                         <CreditCard className="w-5 h-5 text-amber-500" />
//                         Payment Method
//                     </CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                     <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-4">
//                         <div className="flex items-center space-x-3 border border-gray-200 rounded-lg p-4 hover:border-amber-300 transition-colors">
//                             <RadioGroupItem value="card" id="card" />
//                             <Label htmlFor="card" className="flex-1 cursor-pointer">
//                                 <div className="flex items-center justify-between">
//                                     <div>
//                                         <p className="font-medium">Credit/Debit Card</p>
//                                         <p className="text-sm text-gray-600">Pay securely with your card</p>
//                                     </div>
//                                     <div className="flex gap-2">
//                                         <Badge variant="outline" className="text-xs">Visa</Badge>
//                                         <Badge variant="outline" className="text-xs">Mastercard</Badge>
//                                     </div>
//                                 </div>
//                             </Label>
//                         </div>

//                         <div className="flex items-center space-x-3 border border-gray-200 rounded-lg p-4 hover:border-amber-300 transition-colors">
//                             <RadioGroupItem value="upi" id="upi" />
//                             <Label htmlFor="upi" className="flex-1 cursor-pointer">
//                                 <div className="flex items-center justify-between">
//                                     <div>
//                                         <p className="font-medium">UPI Payment</p>
//                                         <p className="text-sm text-gray-600">Fast and secure UPI payment</p>
//                                     </div>
//                                     <Badge variant="outline" className="text-xs">Popular</Badge>
//                                 </div>
//                             </Label>
//                         </div>

//                         <div className="flex items-center space-x-3 border border-gray-200 rounded-lg p-4 hover:border-amber-300 transition-colors">
//                             <RadioGroupItem value="cod" id="cod" />
//                             <Label htmlFor="cod" className="flex-1 cursor-pointer">
//                                 <div className="flex items-center justify-between">
//                                     <div>
//                                         <p className="font-medium">Cash on Delivery</p>
//                                         <p className="text-sm text-gray-600">Pay when you receive</p>
//                                     </div>
//                                 </div>
//                             </Label>
//                         </div>
//                     </RadioGroup>
//                 </CardContent>
//             </Card>

//         </div>
//     )
// }

// export default Payment