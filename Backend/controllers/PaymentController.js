import razorpay from "../config/razorpay.js";
import Cart from "../model/cartModel.js";
import Order from "../model/orderModel.js";
import crypto from "crypto";
import { getIO } from "../socket/socket.js";


export async function createOrder(req, res) {
    try {
        const userID = req.user.id;

        const cart = await Cart.findOne({ user: userID }).populate("items.product");

        if (!cart) {
            return res.status(404).json({ success: false, message: "Cart not found" });
        }

        if (cart.issues) {
            return res.status(400).json({
                success: false,
                message: "Cart contains unavailable items. Please refresh checkout."
            });
        }

        let recalculatedItemTotal = 0;
        for (let item of cart.items) {

            if (!item.product || item.product.stock < item.quantity) {
                return res.status(400).json({
                    success: false,
                    message: "Some items are out of stock"
                });
            }

            const price = item.lockedPrice;
            if (!price || price <= 0) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid product price detected"
                });
            }

            recalculatedItemTotal += price * item.quantity;
        }

        const backendFinalPayable = recalculatedItemTotal + cart.platformFees;

        // Comparing with cart.finalPayable stored earlier
        if (backendFinalPayable !== cart.finalPayable) {
            return res.status(400).json({
                success: false,
                message: "Price mismatch detected. Please refresh checkout."
            });
        }

        const receipt = `ord_${Date.now().toString().slice(-8)}`;

        const options = {
            amount: cart.finalPayable * 100,
            currency: "INR",
            receipt,
        };

        const razorpayOrder = await razorpay.orders.create(options);

        return res.status(200).json({
            success: true,
            order: razorpayOrder,
            amount: cart.finalPayable
        });

    } catch (err) {
        console.error("CREATE ORDER ERROR:", err);

        return res.status(500).json({
            success: false,
            message: "Payment order creation failed",
            error: err.message,
        });
    }
}


export async function verifyPayment(req, res) {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, address } = req.body;
        const userID = req.user.id;

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({ message: "Missing payment details" });
        }

        // Verifing signature
        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_API_KEY_SECRET)
            .update(body)
            .digest("hex");

        if (expectedSignature !== razorpay_signature) {
            return res.status(400).json({
                success: false,
                message: "Payment verification failed"
            });
        }

        const cart = await Cart.findOne({ user: userID }).populate("items.product");
        if (!cart) return res.status(404).json({ message: "Cart not found" });

        //cart.items and order.itms has a schema mismatch thats y i used map here 
        const items = cart.items.map(item => ({
            product: item.product._id,
            seller: item.product.seller,
            quantity: item.quantity,
            lockedPrice: item.lockedPrice,
            subtotal: (item.lockedPrice) * item.quantity,
            sellerAmount: (item.lockedPrice * item.quantity)
        }));


        const newOrder = await Order.create({
            customer: userID,
            items,
            amount: cart?.finalPayable,
            currency: "INR",
            razorpay: {
                orderId: razorpay_order_id,
                paymentId: razorpay_payment_id,
                signature: razorpay_signature
            },
            platformFees: cart.platformFees,
            address,
            paymentStatus: "paid",
            paymentMode: "prepaid",
        });

        // stock deduct
        for (let item of cart.items) {
            item.product.stock -= item.quantity;
            await item.product.save();
        }


        cart.items = [];
        cart.itemTotal = 0;
        cart.platformFees = 0;
        cart.totalAmmount = 0;
        cart.finalPayable = 0;
        await cart.save();

        //socket.io live notification
        const io = getIO()
        //only one notification should be sent if oder has two product from same seller 
        const sellerIds = [...new Set(items.map(item => item.seller.toString()))]
        sellerIds.forEach((sellerId) => {
            io.to(`seller_${sellerId.toString()}`).emit("new-order", { newOrder })
        });

        return res.status(200).json({
            success: true,
            message: "Payment verified & order placed ✅",
            order: newOrder,
        });

    } catch (err) {
        console.error("VERIFY PAYMENT ERROR:", err);
        res.status(500).json({
            message: "Server error",
            error: err.message
        });
    }
}
