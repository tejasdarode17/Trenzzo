import { mongoose } from "mongoose";


const returnRequestSchema = new mongoose.Schema({
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
        required: true
    },

    itemId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },

    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Seller",
        required: true
    },

    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    reason: {
        type: String,
    },

    returnStatus: {
        type: String,
        enum: ["requested", "in-transit", "pickedUp", "received", "approved", "rejected", "refunded"],
        default: "requested"
    },

    refundAmount: {
        type: Number,
        required: true
    },

    refundStatus: {
        type: String,
        enum: ["pending", "processed"],
        default: "pending"
    },

    deliveryPartner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "DeliveryPartner",
        default: null
    },

    pickupDate: {
        type: Date
    }

}, { timestamps: true });


const Return = mongoose.model("Return", returnRequestSchema);
export default Return
