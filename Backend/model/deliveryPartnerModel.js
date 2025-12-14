import mongoose from "mongoose";

const deliveryPartnerSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true
    },

    phone: {
        type: String,
        unique: true
    },

    email: {
        type: String,
        unique: true,
        sparse: true
    },

    password: {
        type: String,
        required: true
    },

    role: {
        type: String,
        default: 'deliveryPartner'
    },

    vehicleType: {
        type: String,
        enum: ["bike", "miniTruck", "truck"],
        default: "bike",
        required: true
    },

    isActive: {
        type: Boolean,
        default: true
    },

    isVerified: {
        type: Boolean,
        default: false
    },

    orders: [
        {
            orderId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Order"
            },
            itemId: {
                type: mongoose.Schema.Types.ObjectId
            }
        }
    ],

    returnOrders: [
        {
            returnRequestId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Return"
            },
            orderId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Order"
            },
            itemId: {
                type: mongoose.Schema.Types.ObjectId
            }
        }
    ],

}, { timestamps: true });

const DeliveryPartner = mongoose.model("DeliveryPartner", deliveryPartnerSchema);

export default DeliveryPartner
