import mongoose from "mongoose"

const userSchema = new mongoose.Schema({

    username: {
        type: String,
        required: true,
    },

    email: {
        type: String,
        required: true,
        unique: true
    },


    isVerified: {
        type: Boolean,
        default: false,
    },


    password: {
        type: String,
        required: true,
    },

    addresses: [
        {
            name: { type: String, required: true },
            phoneNumber: { type: String },
            pinCode: { type: String, required: true },
            locality: { type: String, required: true },
            address: { type: String, required: true },
            city: { type: String, required: true },
            state: { type: String, required: true },
            landmark: { type: String, required: true },
            label: { type: String, default: "Home" },
            isDefault: { type: Boolean, default: false },
        },
    ],

    role: {
        type: String,
        default: 'user'
    },

    wishlist: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product"
        }
    ],

})


const User = mongoose.model('User', userSchema)

export default User