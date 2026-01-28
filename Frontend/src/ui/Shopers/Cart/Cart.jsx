import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingCart, ArrowLeft, CheckCircle, AlertTriangle, Receipt, Sparkles, Shield, } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import EmptyCart from "./EmptyCart";
import CartSkeleton from "./CartSkeleton";
import { useCart } from "@/hooks/shopper/useCart";
import { useAddToCart } from "@/hooks/shopper/useAddToCart";
import { clearCartAPI, decreaseCartQuantityAPI, removeItemFromCartAPI, } from "@/api/shopper.api";
import { useInitCheckout } from "@/hooks/shopper/useInitCheckout";

const Cart = () => {
  const { isAuthenticated } = useSelector((s) => s.auth);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading } = useCart();
  const cart = data?.cart;

  const { mutate: addToCart, isPending: addLoading } = useAddToCart();

  //below functonalities custom hook is not created cuz this functonilities is limited to this component only
  const { mutate: decreaseQty } = useMutation({
    mutationFn: decreaseCartQuantityAPI,
    onSuccess: () => queryClient.invalidateQueries(["cart"]),
  });

  const { mutate: removeItem } = useMutation({
    mutationFn: removeItemFromCartAPI,
    onSuccess: () => queryClient.invalidateQueries(["cart"]),
  });

  const { mutate: clearCart, isPending: clearing } = useMutation({
    mutationFn: clearCartAPI,
    onMutate: async () => {
      await queryClient.cancelQueries(["cart"]);
      const previousCart = queryClient.getQueryData(["cart"]);

      queryClient.setQueryData(["cart"], {
        cart: {
          items: [],
          itemTotal: 0,
          platformFees: 0,
          totalAmmount: 0,
        },
      });
      return { previousCart };
    },

    onError: (_err, _vars, ctx) => {
      queryClient.setQueryData(["cart"], ctx?.previousCart);
    },

    onSettled: () => {
      queryClient.invalidateQueries(["cart"]);
    }
  })

  const { mutate: initCheckout, isPending: checkoutLoading } = useInitCheckout();
  function handleInitCheckout() {
    initCheckout({ source: "cart" })
    navigate("/checkout")
  }

  if (!isAuthenticated) return <Navigate to="/user/auth/login" replace />;
  if (isLoading) return <CartSkeleton />;
  if (!cart?.items?.length) return <EmptyCart />;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header - Only on mobile */}
      <div className="lg:hidden sticky top-0 z-10 bg-white border-b px-4 py-3 shadow-sm">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="-ml-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>

          <div className="text-center">
            <h1 className="text-lg font-semibold">My Cart</h1>
            <p className="text-xs text-gray-500">{cart.items.length} items</p>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="text-red-600 hover:text-red-700"
            disabled={clearing}
            onClick={() => clearCart()}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:block bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => navigate("/")}
                className="flex items-center gap-2 text-sm hover:bg-gray-100"
              >
                <ArrowLeft className="h-4 w-4" />
                Continue Shopping
              </Button>
            </div>



            <Button
              variant="destructive"
              size="sm"
              disabled={clearing}
              onClick={() => clearCart()}
              className="flex items-center gap-2 text-sm"
            >
              <Trash2 className="h-4 w-4" />
              Clear All
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6 lg:py-8">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Cart Items - Left Column */}
          <div className="flex-1">
            <div className="bg-white rounded-xl shadow-sm border p-4 lg:p-6">
              <div className="hidden lg:flex items-center justify-between mb-6 pb-4 border-b">
                <h2 className="text-lg font-bold text-gray-900">Cart Items</h2>
                <span className="text-sm text-gray-600">{cart.items.length} items</span>
              </div>

              <div className="space-y-4">
                {cart.items.map((p) => (
                  <div
                    key={p.product._id}
                    className="flex gap-4 p-3 lg:p-4 border border-gray-100 rounded-lg hover:border-gray-200 transition-colors"
                  >
                    {/* Product Image */}
                    <div className="flex-shrink-0">
                      <img
                        src={p.product.images?.[0]?.url}
                        alt={p.product.name}
                        className="w-20 h-20 lg:w-24 lg:h-24 object-contain bg-gray-50 rounded-lg"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-2">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 text-sm lg:text-sm">
                            {p.product.brand} {p.product.name}
                          </h3>
                          <p className="text-xs text-gray-500 mt-1">
                            Seller: {p.product.seller?.username}
                          </p>

                          {/* Stock Status */}
                          <div className="mt-2">
                            {p.product.stock < 5 ? (
                              <div className="inline-flex items-center px-2 py-1 rounded-md bg-orange-50 text-orange-700 text-xs">
                                <AlertTriangle className="w-3 h-3 mr-1" />
                                Only {p.product.stock} left
                              </div>
                            ) : (
                              <div className="inline-flex items-center px-2 py-1 rounded-md bg-green-50 text-green-700 text-xs">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                In Stock
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Desktop Price */}
                        <div className="hidden lg:block text-right">
                          <p className="text-lg font-bold text-gray-900">
                            ₹{(p.product.price * p.quantity).toLocaleString("en-IN")}
                          </p>
                          {p.quantity > 1 && (
                            <p className="text-xs text-gray-500 mt-1">
                              ₹{p.product.price.toLocaleString("en-IN")} each
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Quantity Controls & Mobile Price */}
                      <div className="mt-4 flex items-center justify-between">
                        <div className="lg:hidden">
                          <p className="font-bold text-base text-gray-900">
                            ₹{(p.product.price * p.quantity).toLocaleString("en-IN")}
                          </p>
                          {p.quantity > 1 && (
                            <p className="text-xs text-gray-500">
                              ₹{p.product.price.toLocaleString("en-IN")} each
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1 bg-gray-50 rounded-lg p-1">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7"
                              disabled={p.quantity === 1}
                              onClick={() =>
                                decreaseQty({
                                  productID: p.product._id,
                                  attributes: p.product.attributes,
                                })
                              }
                            >
                              <Minus className="w-3 h-3" />
                            </Button>

                            <span className="px-2 min-w-[28px] text-center font-medium text-sm">
                              {p.quantity}
                            </span>

                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7"
                              disabled={addLoading || p.quantity >= p.product.stock}
                              onClick={() =>
                                addToCart({
                                  productID: p.product._id,
                                  quantity: 1,
                                  attributes: p.product.attributes,
                                })
                              }
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                          </div>

                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-red-600 hover:bg-red-50"
                            onClick={() =>
                              removeItem({
                                productID: p.product._id,
                                attributes: p.product.attributes,
                              })
                            }
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Mobile Continue Shopping Button */}
              <div className="mt-6 lg:hidden">
                <Button
                  variant="outline"
                  onClick={() => navigate("/")}
                  className="w-full border-gray-300 text-sm"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Continue Shopping
                </Button>
              </div>
            </div>
          </div>

          {/* Order Summary - Right Column */}
          <div className="lg:w-96 hidden lg:block ">
            <div className="bg-white rounded-xl shadow-sm border sticky top-6">
              {/* Header */}
              <div className="p-4 lg:p-6 border-b">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Receipt className="w-5 h-5 text-amber-500" />
                  Order Summary
                </h2>
              </div>

              {/* Price Details */}
              <div className="p-4 lg:p-6 space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Items ({cart.items.length})</span>
                  <span className="font-medium">₹{cart.itemTotal?.toLocaleString("en-IN")}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Platform Fee</span>
                  <span className="font-medium">₹{cart.platformFees?.toLocaleString("en-IN")}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Delivery</span>
                  <span className="font-medium text-green-600">FREE</span>
                </div>

                <div className="border-t pt-4"></div>

                <div className="flex justify-between text-base font-bold">
                  <span>Total Amount</span>
                  <span>₹{cart.totalAmmount?.toLocaleString("en-IN")}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <div className="p-4 lg:p-6 border-t bg-gray-50">
                <Button
                  className="w-full bg-amber-500 hover:bg-amber-600 text-white h-12 text-base font-semibold"
                  disabled={checkoutLoading}
                  onClick={handleInitCheckout}
                  size="lg"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  {checkoutLoading ? "Processing..." : "Proceed to Checkout"}
                </Button>

                {/* Security Info */}
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-center gap-2 text-xs text-green-600">
                    <Sparkles className="w-3 h-3" />
                    <span>Secure checkout guaranteed</span>
                  </div>

                  <div className="flex items-center justify-center gap-2 text-xs text-blue-600">
                    <Shield className="w-3 h-3" />
                    <span>Safe & Secure Payments</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Order Summary - Sticky Bottom */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Receipt className="h-5 w-5 text-amber-500" />
              <span className="font-medium text-sm">Order Summary</span>
            </div>
            <div className="text-right">
              <p className="font-bold text-lg">₹{cart.totalAmmount?.toLocaleString("en-IN")}</p>
              <p className="text-xs text-gray-500">Total ({cart.items.length} items)</p>
            </div>
          </div>

          <Button
            className="w-full bg-amber-500 hover:bg-amber-600 text-white h-12 text-base font-semibold rounded-lg"
            disabled={checkoutLoading}
            onClick={handleInitCheckout}
          >
            <ShoppingCart className="w-5 h-5 mr-2" />
            {checkoutLoading ? "Processing..." : `Place Order`}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Cart;