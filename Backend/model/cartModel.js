import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },

        items: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                    required: true,
                },

                quantity: {
                    type: Number,
                    required: true,
                    min: 1,
                },

                priceAtTheTime: {
                    type: Number,
                    required: true,
                },

                unavailable: {
                    type: Boolean,
                    default: false,
                },

                stockIssue: {
                    type: Boolean,
                    default: false,
                },

                attributes: {
                    type: Object,
                    default: {},
                },

                lockedPrice: {
                    type: Number,
                    default: null,
                },
            },
        ],

        issues: { type: Boolean, default: false },
        itemTotal: { type: Number, default: 0, required: true },
        platformFees: { type: Number, default: 0, required: true },

        totalAmmount: { type: Number, default: 0, required: true },

        finalPayable: {
            type: Number,
            default: null,
        },

    },
    { timestamps: true }
);

const Cart = mongoose.model("Cart", cartSchema);
export default Cart;
