import razorpay from "../config/razorpay.js";
import Order from "../model/orderModel.js";
import crypto from "crypto";
import { getIO } from "../socket/socket.js";
import Checkout from "../model/checkoutModel.js";

export async function createOrder(req, res) {
    try {
        const userID = req.user.id;

        const checkout = await Checkout.findOne({
            user: userID,
            status: "pending",
            expiresAt: { $gt: new Date() },
        }).populate("items.product");

        if (!checkout || !checkout.items.length) {
            return res.status(404).json({ success: false, message: "No active checkout found" });
        }

        for (let item of checkout.items) {
            const product = item.product;
            if (!product) {
                return res.status(400).json({ success: false, message: "Product not found" });
            }
            if (product.stock < item.quantity) {
                return res.status(400).json({ success: false, message: `${product.name} is out of stock` });
            }
            if (!item.lockedPrice || item.lockedPrice <= 0) {
                return res.status(400).json({ success: false, message: `Invalid price for ${product.name}` });
            }
        }

        const recalculatedTotal = checkout.items.reduce((sum, item) => sum + item.lockedPrice * item.quantity, 0)
        const finalPayable = recalculatedTotal + checkout.platformFees;

        if (Math.abs(finalPayable - checkout.finalPayable) > 1) {
            return res.status(400).json({
                success: false,
                message: "Price mismatch detected. Please refresh checkout."
            });
        }

        const receipt = `ord_${Date.now().toString().slice(-8)}`;
        const razorpayOrder = await razorpay.orders.create({
            amount: checkout.finalPayable * 100,
            currency: "INR",
            receipt,
        });

        return res.status(200).json({
            success: true,
            message: "Razorpay order created",
            order: razorpayOrder,
            amount: checkout.finalPayable,
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

        // Verify Razorpay signature
        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_API_KEY_SECRET)
            .update(body)
            .digest("hex");

        if (expectedSignature !== razorpay_signature) {
            return res.status(400).json({ success: false, message: "Payment verification failed" });
        }

        // Fetch pending checkout
        const checkout = await Checkout.findOne({
            user: userID,
            status: "pending",
            expiresAt: { $gt: new Date() }
        }).populate("items.product");

        if (!checkout || !checkout.items.length) {
            return res.status(404).json({ success: false, message: "No active checkout found" });
        }

        // Validate stock
        for (let item of checkout.items) {
            const product = item.product;
            if (!product) {
                return res.status(400).json({ success: false, message: "Product not found" });
            }
            if (product.stock < item.quantity) {
                return res.status(400).json({ success: false, message: `${product.name} is out of stock` });
            }
            if (!item.lockedPrice || item.lockedPrice <= 0) {
                return res.status(400).json({ success: false, message: `Invalid price for ${product.name}` });
            }
        }

        // Used map here cuz order,items and checkout.items have schema mismatch
        const items = checkout.items.map(item => ({
            product: item.product._id,
            seller: item.product.seller,
            quantity: item.quantity,
            lockedPrice: item.lockedPrice,
            subtotal: item.lockedPrice * item.quantity,
            sellerAmount: item.lockedPrice * item.quantity
        }));

        // Create Order
        const newOrder = await Order.create({
            customer: userID,
            items,
            amount: checkout.finalPayable,
            currency: "INR",
            razorpay: {
                orderId: razorpay_order_id,
                paymentId: razorpay_payment_id,
                signature: razorpay_signature
            },
            platformFees: checkout.platformFees,
            address,
            paymentStatus: "paid",
            paymentMode: "prepaid",
        });

        // Deduct stock
        for (let item of checkout.items) {
            item.product.stock -= item.quantity;
            await item.product.save();
        }

        // Mark checkout as completed
        checkout.status = "completed";
        checkout.items = [];
        checkout.itemTotal = 0;
        checkout.platformFees = 0;
        checkout.finalPayable = 0;
        await checkout.save();

        // Socket notifications to sellers (unique seller only)
        const io = getIO();
        const sellerIds = [...new Set(items.map(item => item.seller.toString()))];
        sellerIds.forEach(sellerId => {
            io.to(`seller_${sellerId}`).emit("new-order", { newOrder });
        });

        return res.status(200).json({
            success: true,
            message: "Payment verified & order placed ✅",
            order: newOrder,
        });

    } catch (err) {
        console.error("VERIFY PAYMENT ERROR:", err);
        return res.status(500).json({
            message: "Server error",
            error: err.message
        });
    }
}
