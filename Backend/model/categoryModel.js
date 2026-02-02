import mongoose from "mongoose";

const attributeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
    },
    required: {
        type: Boolean,
        default: false
    },
});


const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },

    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },

    description: {
        type: String,
        default: ""
    },

    image: {
        url: {
            type: String,
            default: ""
        },
        public_id: {
            type: String,
            default: ""
        },
    },

    attributes: {
        type: [attributeSchema],
        default: []
    },

    active: {
        type: Boolean,
        default: true
    },
},
    { timestamps: true }
);

const Category = mongoose.model("Category", categorySchema);
export default Category;
