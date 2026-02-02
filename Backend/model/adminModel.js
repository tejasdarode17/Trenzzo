import mongoose from "mongoose";


const adminSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },

    password: {
        type: String,
        required: true,
        minlength: 6
    },

    role: {
        type: String,
        enum: ["superadmin", "admin"],
        default: "admin"
    }

})

const Admin = mongoose.model("Admin", adminSchema)

export default Admin