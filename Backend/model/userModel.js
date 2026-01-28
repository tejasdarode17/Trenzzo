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

    // "E11000 duplicate key error collection: ecom.users index: phoneNumber_1 dup key: { phoneNumber: null }"
    //above error was coming cuz more than one user cant have the same phone number one already have null new user cannot have null phone number :)
    //so i added sparse 
    // phoneNumber: {
    //     type: Number,
    //     unique: true,
    //     sparse: true,
    // },

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

    viewedProducts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product"
        }
    ],

    wishlist: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product"
        }
    ],

})


const User = mongoose.model('User', userSchema)

export default User