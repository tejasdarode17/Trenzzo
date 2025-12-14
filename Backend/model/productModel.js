import mongoose from "mongoose";

const productSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        trim: true,
    },

    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },

    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true,
    },

    attributes: {
        type: Map,
        of: [String],
    },

    brand: {
        type: String,
        required: true,
        trim: true,
    },

    images: [
        {
            url: { type: String, required: true },
            public_id: { type: String, required: true },
        },
    ],

    stock: {
        type: Number,
        required: true,
        min: 0
    },

    price: {
        type: Number,
        required: true,
        min: 0,
    },

    salePrice: {
        type: Number,
        default: 0,
        min: 0,
    },

    highlights: [
        {
            type: String,
            trim: true,
        },
    ],

    description: {
        type: String,
        default: "",
    },

    active: {
        type: Boolean,
        default: true,
    },

    outOfStock: {
        type: Boolean,
        default: false,
    },

    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Seller",
        required: true,
    },

    offers: {
        type: String,
    },

    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Review",
        }
    ],

    averageRating: {
        type: Number,
        default: 0
    },

    totalReviews: {
        type: Number,
        default: 0
    },

},
    { timestamps: true }
);


productSchema.pre("save", function (next) {
    this.outOfStock = this.stock <= 0;
    next();
});

const Product = mongoose.model("Product", productSchema);
export default Product;




