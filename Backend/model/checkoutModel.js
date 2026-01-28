import mongoose from "mongoose";

const checkoutSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        source: {
            type: String,
            enum: ["cart", "buy_now"],
            required: true,
        },

        items: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                    required: true,
                },

                seller: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Seller",
                    required: true,
                },

                quantity: {
                    type: Number,
                    required: true,
                    min: 1,
                },

                lockedPrice: {
                    type: Number,
                    required: true,
                },

                subtotal: {
                    type: Number,
                    required: true,
                },

                attributes: {
                    type: Object,
                    default: {},
                },
            },
        ],

        itemTotal: {
            type: Number,
            required: true,
        },

        platformFees: {
            type: Number,
            required: true,
        },

        finalPayable: {
            type: Number,
            required: true,
        },

        currency: {
            type: String,
            default: "INR",
        },

        razorpay: {
            orderId: String,
        },

        status: {
            type: String,
            enum: ["pending", "paid", "expired", "cancelled", "completed"],
            default: "pending",
        },

        expiresAt: {
            type: Date,
            required: true,
        },
    },
    { timestamps: true }
);

const Checkout = mongoose.model("Checkout", checkoutSchema);
export default Checkout;
