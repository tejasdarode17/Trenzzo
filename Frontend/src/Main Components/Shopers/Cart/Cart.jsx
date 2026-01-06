import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { addToCartThunk, checkOut, clearCart, decreaseCartQuantity, removeItemFromCart } from "@/Redux/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import EmptyCart from "./EmptyCart";
import CartFooter from "./CartFooter";
import { Minus, Plus, Trash2, ShoppingCart, ArrowLeft, CheckCircle, AlertTriangle, Receipt, Truck, Sparkles, Shield } from "lucide-react";
import { Navigate, useNavigate } from "react-router-dom";
import axios from "axios";

const Cart = () => {
  const { cart, loading } = useSelector((store) => store.cart);
  const { isAuthenticated } = useSelector((store) => store.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  if (!isAuthenticated) { return <Navigate to="/user/auth/login" replace /> }
  if (!cart?.items?.length) { return <EmptyCart></EmptyCart> }

  function placeOrder() {
    navigate("/checkout")
  }



  async function deleteCart() {
    try {
      const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/delete-cart`,
        { withCredentials: true, }
      )
      if (response.data.success) {
        dispatch(clearCart())
      }
    } catch (error) {
      console.log(error);
      return rejectWithValue(
        error.response?.data?.message || "Something went wrong on server"
      );
    }
  }





  return (
    <div className="relative flex flex-col">

      {loading && (
        <div className="absolute inset-0 bg-white/70 z-50 flex items-center justify-center">
          <div className="h-8 w-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      <div className="max-w-6xl mx-auto mt-6 flex flex-col flex-1 lg:flex-row gap-6 px-4">
        {/* Left Side – Cart Items */}
        <div className="flex-1">
          <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100">
            {/* Cart Header */}
            <div className="flex justify-between items-center p-6 border-b bg-gradient-to-r from-gray-50 to-white">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
                <p className="text-gray-600 mt-1 text-sm">
                  {cart?.items?.length} item{cart?.items?.length !== 1 ? 's' : ''} in your cart
                </p>
              </div>
              {cart?.items?.length > 0 && (
                <Button
                  onClick={() => deleteCart()}
                  variant="outline"
                  className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear All
                </Button>
              )}
            </div>

            {/* Cart Items List */}
            <div className="divide-y divide-gray-100">
              {(cart?.items || []).map((p) => (
                <div key={p?.product?._id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                  <div className="flex flex-col sm:flex-row gap-6">
                    {/* Product Image */}
                    <div className="flex-shrink-0">
                      <div className="w-32 h-32 bg-gray-100 rounded-lg p-3 border border-gray-200">
                        <img
                          src={p?.product?.images?.[0]?.url}
                          alt={p?.name}
                          className="w-full h-full object-contain transition-transform hover:scale-105"
                        />
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-center gap-3 mt-4">
                        <Button
                          disabled={p?.quantity === 1}
                          onClick={() => dispatch(decreaseCartQuantity({ productID: p.product._id, attributes: p.product.attributes }))}
                          variant="outline"
                          size="sm"
                          // disabled={p?.quantity <= 1}
                          className="h-9 w-9 rounded-full border-2 hover:border-amber-500 transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </Button>

                        <div className="min-w-12 text-center">
                          <span className="text-lg font-semibold text-gray-900 px-3 py-1 border-2 border-amber-500 rounded-lg bg-amber-50">
                            {p?.quantity}
                          </span>
                        </div>

                        <Button
                          onClick={() => dispatch(addToCartThunk({ productID: p.product._id, quantity: 1, attributes: p.product.attributes }))}
                          variant="outline"
                          size="sm"
                          disabled={p?.quantity >= p?.product?.stock}
                          className="h-9 w-9 rounded-full border-2 hover:border-amber-500 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 text-lg leading-tight mb-2">
                            {p?.product?.brand} {p?.product?.name} {p?.product?.storage} {p?.product?.colour}
                          </h3>

                          <div className="flex items-center gap-3 mb-3">
                            <p className="text-gray-600 text-sm flex items-center gap-2">
                              Seller:
                              <span className="font-medium text-gray-800">
                                {p?.product?.seller?.username}
                              </span>
                            </p>
                            <Badge variant="secondary" className="bg-green-600 text-white px-2 py-1 text-xs">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Assured
                            </Badge>
                          </div>

                          {/* Stock Status */}
                          <div className="mb-3">
                            {p?.product?.outOfStock ? (
                              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                                Out of Stock
                              </Badge>
                            ) : p?.product?.stock < 5 ? (
                              <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                                <AlertTriangle className="w-3 h-3 mr-1" />
                                Hurry! Only {p?.product?.stock} left
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                In Stock
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* Price and Remove */}
                        <div className="text-right flex flex-col items-end gap-3">
                          <p className="font-bold text-xl text-gray-900">
                            ₹{(p?.product.price * p?.quantity).toLocaleString("en-IN")}
                          </p>
                          {p.quantity > 1 && (
                            <p className="text-sm text-gray-500">
                              ₹{p?.product.price?.toLocaleString("en-IN")} each
                            </p>
                          )}
                          <Button
                            onClick={() => dispatch(removeItemFromCart({ productID: p.product._id, attributes: p.product.attributes }))}
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 mt-2"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Remove
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Sticky Bottom Bar */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 flex justify-between items-center p-6 shadow-lg z-10">
              <Button
                variant="outline"
                className="text-gray-700 border-gray-300 hover:bg-gray-50 font-medium"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Continue Shopping
              </Button>
              <div className="flex items-center gap-4">
                <p className="text-gray-600 font-medium">
                  Total: <span className="text-lg font-bold text-gray-900 ml-2">₹{cart?.totalAmmount?.toLocaleString("en-IN")}</span>
                </p>
                <Button disabled={cart?.issues} onClick={() => placeOrder()} className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-8 py-2.5 shadow-lg hover:shadow-xl transition-all duration-200 min-w-[180px]">
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Place Order
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side – Price Details */}
        <div className="w-full lg:w-96">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 sticky top-6 transition-all duration-200 hover:shadow-xl">
            {/* Header */}
            <div className="border-b border-gray-200 px-6 py-4 bg-gradient-to-r from-gray-50 to-white rounded-t-xl">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Receipt className="w-5 h-5 text-amber-500" />
                Price Breakdown
              </h2>
            </div>

            {/* Body */}
            <div className="px-6 py-5 space-y-4">
              <div className="flex justify-between items-center py-2">
                <p className="text-gray-600">
                  Price ({cart?.items?.length} item{cart?.items?.length > 1 ? 's' : ''})
                </p>
                <p className="font-medium">₹{cart?.itemTotal?.toLocaleString("en-IN")}</p>
              </div>


              <div className="flex justify-between items-center py-2">
                <p className="text-gray-600">Platform Fee</p>
                <p className="font-medium">₹{cart?.platformFees.toLocaleString("en-IN")}</p>
              </div>


              <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <p className="text-lg font-bold text-gray-900">Total Amount</p>
                <p className="text-xl font-bold text-gray-900">₹{cart?.totalAmmount?.toLocaleString("en-IN")}</p>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 px-6 py-4 bg-green-50 rounded-b-xl">
              <div className="flex items-center justify-between">
                <p className="text-green-700 font-medium text-sm flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  You will save ₹0 on this order
                </p>
              </div>
            </div>

            {/* Secure Checkout Note */}
            <div className="px-6 py-4 border-t border-gray-200 bg-blue-50">
              <div className="flex items-center justify-center gap-2 text-sm text-blue-700">
                <Shield className="w-4 h-4" />
                Safe and Secure Payments
              </div>
            </div>
          </div>
        </div>
      </div>

      <CartFooter />
    </div >

  );
};

export default Cart;

