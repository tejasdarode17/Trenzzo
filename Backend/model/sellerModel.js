import mongoose from "mongoose"

const sellerSchema = new mongoose.Schema({

    username: {
        type: String,
        required: true,
        unique: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true,
        unique: true
    },

    businessAddress: {
        type: String,
        required: true
    },

    status: {
        type: String,
        enum: ["pending", "approved", "suspended", "banned", "rejected"],
        default: "pending"
    },

    role: {
        type: String,
        default: 'seller'
    },

    products: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
        }
    ],

    razorpayAccountId: {
        type: String,
        default: null
    },

    financialStatus: {
        type: String,
        enum: ["created", "active", "inactive", "suspended", "closed"],
        default: "created"
    },
    
}, { timestamps: true })


const Seller = mongoose.model('Seller', sellerSchema)

export default Seller



