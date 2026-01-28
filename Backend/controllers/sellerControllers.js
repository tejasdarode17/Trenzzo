import Seller from "../model/sellerModel.js";
import Product from "../model/productModel.js";
import { deleteImage, deleteImages } from "../utils/cloudinaryHandler.js";
import Category from "../model/categoryModel.js";
import slugify from "slugify";
import Order from "../model/orderModel.js";
import mongoose from "mongoose";
import DeliveryPartner from "../model/deliveryPartnerModel.js";
import Return from "../model/returnModel.js";
import bcrypt from "bcrypt"


export async function addProduct(req, res) {

    const { name, category, images, brand, highlights, description, stock, price, salePrice, attributes, } = req.body;
    const sellerID = req.user.id;

    try {
        if (!name || !category || !brand || !description || stock == null || price == null) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields",
            });
        }

        if (!images?.length) {
            return res.status(400).json({
                success: false,
                message: "At least one image is required",
            });
        }

        if (isNaN(stock) || Number(stock) < 0) {
            return res.status(400).json({ success: false, message: "Invalid stock value" });
        }

        if (isNaN(price) || Number(price) < 0) {
            return res.status(400).json({ success: false, message: "Invalid price value" });
        }

        if (salePrice && (isNaN(salePrice) || salePrice < 0 || salePrice > price)) {
            return res.status(400).json({
                success: false,
                message: "Invalid sale price",
            });
        }

        const seller = await Seller.findById(sellerID);
        if (!seller || seller.role !== "seller") {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to add a product",
            });
        }
        // -----------------------------------------------------------------------------------
        // cheking if any required attribute is not sent 
        const categoryDoc = await Category.findById(category);
        if (!categoryDoc) {
            return res.status(404).json({
                success: false,
                message: "Category not found",
            });
        }

        if (categoryDoc.attributes?.length) {
            const missing = categoryDoc.attributes.find(
                (attr) => attr.required && !attributes?.[attr.name]
            );

            if (missing) {
                return res.status(400).json({
                    success: false,
                    message: `Attribute "${missing.name}" is required`,
                });
            }
        }
        // --------------------------------------------------------------------------------------------------

        const productID = new mongoose.Types.ObjectId();
        const productSlug = slugify(`${brand}-${name}-${productID}`, {
            lower: true,
            strict: true,
        });

        const product = await Product.create(
            {
                _id: productID,
                name,
                category,
                brand,
                highlights,
                description,
                images,
                price: Number(price),
                salePrice: salePrice || 0,
                stock: Number(stock),
                attributes,
                seller: sellerID,
                slug: productSlug,
            },
        );

        seller.products.push(productID);
        await seller.save();
        const populated = await Product.findById(productID)
            .populate({ path: "seller", select: "username email role" })
            .populate({ path: "category", select: "name attributes" });

        return res.status(201).json({
            success: true,
            message: "Product added successfully",
            product: populated,
        });

    } catch (error) {
        if (images?.length) {
            const publicIDs = images.map(img => img.public_id);
            await deleteImages(publicIDs);
        }
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
}

export async function editProduct(req, res) {
    try {
        const { id } = req.params;
        const sellerID = req.user.id;
        const { name, images, brand, highlights, description, stock, price, salePrice, attributes } = req.body;

        const seller = await Seller.findById(sellerID);
        if (!seller || seller.role !== "seller") {
            return res.status(403).json({
                success: false,
                message: "You are not authorized"
            });
        }

        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        if (product.seller.toString() !== sellerID) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized"
            });
        }

        // --------------------------------------------------------------------------------------------------------
        // checking if any required attributes not sent 
        const categoryDoc = await Category.findById(product.category);
        if (!categoryDoc) {
            return res.status(400).json({
                success: false,
                message: "Category does not exist"
            });
        }
        if (categoryDoc.attributes?.length) {
            const missing = categoryDoc.attributes.find(
                (attr) => attr.required && !attributes?.[attr.name]
            );

            if (missing) {
                return res.status(400).json({
                    success: false,
                    message: `Attribute "${missing.name}" is required`
                });
            }
        }

        // -------------------------------------------------------------------------------------------------------------
        if (stock != null) {
            if (isNaN(stock) || Number(stock) < 0) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid stock value"
                });
            }
            product.stock = Number(stock);
        }

        if (price != null) {
            if (isNaN(price) || Number(price) < 0) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid price value"
                });
            }
            product.price = Number(price);
        }

        if (salePrice != null) {
            if (
                isNaN(salePrice) ||
                Number(salePrice) < 0 ||
                Number(salePrice) > (price ?? product.price)
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid sale price"
                });
            }
            product.salePrice = Number(salePrice);
        }


        if (name) product.name = name.trim();
        if (brand) product.brand = brand.trim();
        if (highlights) product.highlights = highlights;
        if (description) product.description = description;
        if (attributes) product.attributes = attributes;

        if (images?.length) {
            const incomingPublicIds = images.map((img) => img.public_id);
            const toDelete = product.images.filter(
                (img) => !incomingPublicIds.includes(img.public_id)
            );

            for (const img of toDelete) {
                try {
                    await deleteImage(img.public_id);
                } catch (err) {
                    console.error("Image deletion failed:", err.message);
                }
            }

            product.images = images;
        }


        if (name || brand) {
            product.slug = slugify(
                `${product.brand}-${product.name}-${id}`,
                { lower: true, strict: true }
            );
        }

        await product.save();
        await product.populate([
            { path: "seller", select: "username email role" },
            { path: "category", select: "name attributes _id" }
        ]);

        return res.status(200).json({
            success: true,
            message: "Product updated successfully",
            product
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
}

export async function deleteProduct(req, res) {
    try {
        const { id } = req.params;
        const sellerID = req.user.id;

        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        if (product.seller.toString() !== sellerID) {
            return res.status(403).json({ success: false, message: "Unauthorized" });
        }

        if (product.images?.length > 0) {
            const publicIDs = product.images.map(img => img.public_id);
            await deleteImages(publicIDs);
        }

        await Product.findByIdAndDelete(id);
        await Seller.findByIdAndUpdate(sellerID, { $pull: { products: id } });

        return res.status(200).json({
            success: true,
            message: "Product deleted successfully",
            productId: id
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
}

export async function getAllSellerProducts(req, res) {
    try {
        const sellerId = req.user.id;
        let { category = "all", status = "all", search = "", page = 1 } = req.query;

        if (req.user.role !== "seller") {
            return res.status(403).json({
                success: false,
                message: "You are not authorized"
            });
        }

        page = Number(page);
        const limit = 10

        const filterQuery = { seller: sellerId };

        if (status && status !== "all") {
            filterQuery.active = status === "active";
        }

        if (category && category !== "all") {
            filterQuery.category = category;
        }

        if (search.trim() !== "") {
            filterQuery.name = { $regex: search, $options: "i" };
        }

        const filteredTotal = await Product.countDocuments(filterQuery);
        const totalProducts = await Product.countDocuments({ seller: sellerId });
        const products = await Product.find(filterQuery)
            .populate("category", "name _id")
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        return res.status(200).json({
            success: true,
            message: "Products fetched successfully",
            products,
            totalProducts,
            filteredTotal,
            page,
            pages: Math.ceil(filteredTotal / limit),
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
}

export async function getSellerSingleProduct(req, res) {
    try {
        const sellerID = req.user.id;
        const { id } = req.params;

        if (req.user.role !== "seller") {
            return res.status(403).json({
                success: false,
                message: "You are not authorized"
            });
        }

        const product = await Product.findById(id)
            .populate("category", "name _id");

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        if (product.seller.toString() !== sellerID) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Product fetched successfully",
            product
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
}

export async function toggleProductStatus(req, res) {
    try {
        const sellerID = req.user.id;
        const { id } = req.params;
        const { newStatus } = req.body;

        if (req.user.role !== "seller") {
            return res.status(403).json({
                success: false,
                message: "You are not authorized"
            });
        }

        if (typeof newStatus !== "boolean") {
            return res.status(400).json({
                success: false,
                message: "newStatus must be true or false"
            });
        }

        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        if (product.seller.toString() !== sellerID) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized"
            });
        }

        product.active = newStatus;
        await product.save();

        return res.status(200).json({
            success: true,
            message: "Product status updated",
            status: product.active
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
}

// --------Orders Apis----------------------------------
export async function fetchSellerOrders(req, res) {
    try {
        const sellerID = req.user.id;
        const { page = 1, range = "all", search = "" } = req.query;

        if (!sellerID) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized"
            });
        }

        const limit = 10;
        const skip = (page - 1) * limit;

        let dateFilter = {};
        if (range === "today") {
            const start = new Date();
            start.setHours(0, 0, 0, 0);

            const end = new Date();
            end.setHours(23, 59, 59, 999);

            dateFilter = { createdAt: { $gte: start, $lte: end } };
        }

        if (range === "thisMonth") {
            const now = new Date();
            const start = new Date(now.getFullYear(), now.getMonth(), 1);
            const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

            dateFilter = { createdAt: { $gte: start, $lte: end } };
        }

        const query = { "items.seller": sellerID, ...dateFilter };
        const totalOrders = await Order.countDocuments(query);

        let orders = await Order.find(query)
            .populate("customer", "username email addresses email")
            .populate("items.product", "name price images")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        let formattedOrders = orders.map(order => {
            const sellerItems = order.items.filter(it => it.seller.toString() === sellerID.toString());
            const sellerTotalAmount = sellerItems.reduce((sum, it) => sum + it.sellerAmount, 0);
            return {
                _id: order._id,
                customer: order.customer,
                items: sellerItems,
                sellerTotalAmount,
                paymentMode: order.paymentMode,
                paymentStatus: order.paymentStatus,
                address: order.address,
                createdAt: order.createdAt,
                updatedAt: order.updatedAt,
            }
        });

        if (search.trim()) {
            const lowerSearch = search.toLowerCase();
            formattedOrders = formattedOrders.filter(order =>
                order.customer.username.toLowerCase().includes(lowerSearch) ||
                order.customer.email.toLowerCase().includes(lowerSearch) ||
                order.items.some(item =>
                    item.product?.name?.toLowerCase().includes(lowerSearch)
                )
            );
        }

        return res.status(200).json({
            success: true,
            orders: formattedOrders,
            page: Number(page),
            totalOrders,
            totalPages: Math.ceil(totalOrders / limit),
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
}

export async function fetchSellerOrderDetails(req, res) {
    try {

        const orderID = req.params.id
        const sellerID = req.user.id;

        if (!sellerID) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized"
            });
        }

        if (!orderID) {
            return res.status(404).json({
                success: false,
                message: "Order ID is required"
            });
        }

        const order = await Order.findById(orderID)
            .populate("customer", "username email addresses email")
            .populate("items.product", "name price images")

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        const sellerItems = order.items.filter(it => it.seller.toString() === sellerID.toString());
        const sellerTotalAmount = sellerItems.reduce((sum, it) => sum + it.sellerAmount, 0);

        const orderDetails = {
            _id: order._id,
            customer: order.customer,
            items: sellerItems,
            sellerTotalAmount,
            paymentMode: order.paymentMode,
            paymentStatus: order.paymentStatus,
            address: order.address,
            createdAt: order.createdAt,
            updatedAt: order.updatedAt,
        }


        return res.status(200).json({
            success: true,
            order: orderDetails,
            message: "Order Details Fetched"
        });


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
}

export async function fetchRecetTenOrders(req, res) {
    try {
        const sellerID = req.user.id;

        if (!sellerID) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized",
            });
        }

        const orders = await Order.find({ "items.seller": sellerID })
            .sort({ createdAt: -1 })
            .limit(5);

        const sellerActualOrders = orders.map((order) => {
            const sellerItems = order.items.filter((it) => it.seller.toString() === sellerID.toString());
            const sellerTotalAmount = sellerItems.reduce((sum, it) => sum + it.sellerAmount, 0);
            return {
                _id: order._id,
                customer: order.customer,
                items: sellerItems,
                sellerTotalAmount,
                paymentMode: order.paymentMode,
                paymentStatus: order.paymentStatus,
                address: order.address,
                createdAt: order.createdAt,
                updatedAt: order.updatedAt,
            };
        });

        return res.status(200).json({
            success: true,
            message: "Fetched Recent Orders",
            orders: sellerActualOrders,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
}

export async function fetchSellerStats(req, res) {
    try {
        const sellerID = req.user.id;

        if (!sellerID) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized"
            });
        }

        const orders = await Order.find({ "items.seller": sellerID })
            .populate("items.product", "name price")
            .sort({ createdAt: -1 });


        const products = await Product.countDocuments({ seller: sellerID });

        let totalRevenue = 0;
        let monthRevenue = 0;
        let yearRevenue = 0;
        let sellerOrderCountDelivered = 0;
        let sellerOrderCount = 0;

        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth();

        const monthStart = new Date(currentYear, currentMonth, 1);
        const monthEnd = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59);

        const yearStart = new Date(currentYear, 0, 1);
        const yearEnd = new Date(currentYear, 11, 31, 23, 59, 59);

        const monthlyBreakdown = Array(12).fill(0);

        orders.forEach(order => {
            const sellerItems = order.items.filter(it => it.seller.toString() === sellerID.toString());
            const validItems = sellerItems.filter(it => it.status !== "cancelled" && it.status !== "returned");

            if (sellerItems) sellerOrderCount++
            if (validItems.length > 0) sellerOrderCountDelivered++;

            const sellerTotal = validItems.reduce((sum, it) => sum + it.sellerAmount, 0);

            totalRevenue += sellerTotal;

            const orderMonth = new Date(order.createdAt).getMonth();
            const orderYear = new Date(order.createdAt).getFullYear();

            // monthly breakdown (regardless of year)
            if (orderYear === currentYear) {
                monthlyBreakdown[orderMonth] += sellerTotal;
            }

            if (order.createdAt >= monthStart && order.createdAt <= monthEnd) {
                monthRevenue += sellerTotal;
            }

            if (order.createdAt >= yearStart && order.createdAt <= yearEnd) {
                yearRevenue += sellerTotal;
            }
        });

        return res.status(200).json({
            success: true,
            totalRevenue,
            monthRevenue,
            yearRevenue,
            totalOrdersDelivered: sellerOrderCountDelivered,
            totalOrders: sellerOrderCount,
            totalProducts: products,
            monthlyBreakdown
        })

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
}

export async function changeOrderStatus(req, res) {
    try {
        const sellerID = req.user.id;
        const { orderID, itemID, newStatus } = req.body;

        const order = await Order.findById(orderID)
            .populate("customer", "username email addresses")
            .populate("items.product", "name price images");

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        const item = order.items.find(i => i._id.toString() === itemID);
        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }

        if (item.seller.toString() !== sellerID) {
            return res.status(403).json({ message: "Item does not belong to seller" });
        }

        item.status = newStatus;
        await order.save();

        return res.status(200).json({
            success: true,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: error.message });
    }
}

export async function assignOrderToDeliveryPartner(req, res) {

    try {
        const sellerID = req.user.id;
        const { orderID, itemID, partnerID } = req.body;

        const partner = await DeliveryPartner.findById(partnerID);
        if (!partner) {
            return res.status(404).json({ success: false, message: "Invalid partner" });
        }

        const order = await Order.findById(orderID)
            .populate("customer", "username email addresses")
            .populate("items.product", "name price images");

        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        const item = order.items.find(i => i._id.toString() === itemID);
        if (!item) {
            return res.status(404).json({ success: false, message: "Item not found." });
        }

        if (item.seller.toString() !== sellerID) {
            return res.status(403).json({ success: false, message: "Unauthorized seller" });
        }

        if (item.deliveryPartner) {
            return res.status(403).json({
                success: false,
                message: "This product is already assigned to a delivery partner"
            });
        }

        // Assign delivery partner
        item.deliveryPartner = partnerID;
        item.deliveryStatus = "assigned";
        await order.save();

        // Add to partner's order list
        partner.orders.push({
            orderId: orderID,
            itemId: itemID
        });

        await partner.save();

        return res.status(200).json({
            success: true,
            message: "Delivery Partner Assigned",
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: error.message });
    }
}

export async function fetchAllDeliveryPartners(req, res) {

    try {
        const sellerId = req.user.id

        if (!sellerId) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized"
            });
        }

        const deliveyPartners = await DeliveryPartner.find()

        if (!deliveyPartners) {
            return res.status(403).json({
                success: false,
                message: "No partners found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "All delivery Partner Fetched",
            partners: deliveyPartners
        });


    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
}


// --------Return Apis----------------------------------------------------------------------------------------------
export async function fetchAllReturnRequests(req, res) {
    try {
        const sellerId = req.user.id;
        const { filter = "all", page = 1 } = req.query;

        if (!sellerId) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized"
            });
        }

        const limit = 10;
        const skip = (page - 1) * limit;


        let dateFilter = {};
        if (filter === "today") {
            const start = new Date();
            start.setHours(0, 0, 0, 0);

            const end = new Date();
            end.setHours(23, 59, 59, 999);

            dateFilter.createdAt = { $gte: start, $lte: end };
        }

        if (filter === "month") {
            const start = new Date();
            start.setDate(1);
            start.setHours(0, 0, 0, 0);

            const end = new Date();
            end.setHours(23, 59, 59, 999);

            dateFilter.createdAt = { $gte: start, $lte: end };
        }


        const returnQuery = { seller: sellerId, ...dateFilter };
        const returns = await Return.find(returnQuery)
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip(skip)
            .populate("customer", "username email");

        const data = [];
        for (let returnItem of returns) {
            const order = await Order.findById(returnItem.orderId)
                .populate("items.product", "name price images")
                .populate("customer", "username email");

            if (!order) continue;

            const item = order.items.id(returnItem.itemId);
            if (!item) continue;

            data.push({
                returnRequest: returnItem,
                orderId: order._id,
                product: item.product,
                quantity: item.quantity,
                lockedPrice: item.lockedPrice,
                subtotal: item.subtotal,
                returnStatus: item.returnStatus,
                customer: order.customer,
                address: order.address
            });
        }


        const total = await Return.countDocuments(returnQuery)
        return res.status(200).json({
            success: true,
            message: "Return Request Fetched",
            items: data,
            total,
            pages: Math.ceil(total / limit)
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
}

export async function assignReturnOrderToDeliveryPartner(req, res) {
    try {
        const sellerID = req.user.id;
        const { returnID, orderID, itemID, partnerID } = req.body;

        if (!sellerID) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized"
            });
        }

        const returnProduct = await Return.findById(returnID);
        if (!returnProduct) {
            return res.status(404).json({
                success: false,
                message: "Return product not found"
            });
        }

        if (returnProduct.seller.toString() !== sellerID.toString()) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized seller"
            });
        }

        const partner = await DeliveryPartner.findById(partnerID);
        if (!partner) {
            return res.status(404).json({
                success: false,
                message: "Partner not found"
            });
        }

        const order = await Order.findById(orderID);
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        const item = order.items.find(i => i._id.toString() === itemID);
        if (!item) {
            return res.status(404).json({
                success: false,
                message: "Item not found"
            });
        }

        item.returnStatus = "in-transit";
        returnProduct.returnStatus = "in-transit";
        returnProduct.deliveryPartner = partnerID;

        partner.returnOrders.push({
            returnRequestId: returnID,
            orderId: orderID,
            itemId: itemID
        });

        await order.save();
        await returnProduct.save();
        await partner.save();

        return res.status(200).json({
            success: true,
            message: "Return order assigned to delivery partner successfully"
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
}

export async function updateReturnStatusForSeller(req, res) {
    try {
        const sellerID = req.user.id;
        const { returnID, orderID, itemID, nextStatus } = req.body;

        if (!sellerID) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized"
            });
        }

        if (!returnID || !orderID || !itemID || !nextStatus) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields"
            });
        }

        const allowed = ["received", "approved", "refunded"];
        if (!allowed.includes(nextStatus)) {
            return res.status(400).json({
                success: false,
                message: "Invalid next status"
            });
        }

        const returnProduct = await Return.findById(returnID);
        if (!returnProduct) {
            return res.status(404).json({
                success: false,
                message: "Return product not found"
            });
        }

        if (returnProduct.seller.toString() !== sellerID.toString()) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized seller"
            });
        }

        const current = returnProduct.returnStatus;
        const transitions = {
            pickedUp: "received",
            received: "approved",
            approved: "refunded"
        };

        if (transitions[current] !== nextStatus) {
            return res.status(400).json({
                success: false,
                message: `Invalid transition from ${current} to ${nextStatus}`
            });
        }

        const order = await Order.findById(orderID);
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        const item = order.items.id(itemID);
        if (!item) {
            return res.status(404).json({
                success: false,
                message: "Item not found"
            });
        }

        if (nextStatus == "refunded") {
            item.status = "returned"
        }
        item.returnStatus = nextStatus;
        returnProduct.returnStatus = nextStatus;

        if (nextStatus === "refunded") {
            returnProduct.refundStatus = "processed";
        }

        await order.save();
        await returnProduct.save();

        return res.status(200).json({
            success: true,
            message: "Return status updated successfully",
            returnProduct
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
}

// --------------------------------------------------------------------------
//seller Account related Apis 
export async function sellerChangePassword(req, res) {

    try {
        const { currentPassword, newPassword } = req.body
        const sellerID = req.user.id

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Current Password or new password not provided"
            });
        }

        const seller = await Seller.findById(sellerID)
        if (!seller) {
            return res.status(404).json({
                success: false,
                message: "Seller not found"
            });
        }

        const isMatch = await bcrypt.compare(currentPassword, seller.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Current password is incorrect"
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        seller.password = hashedPassword;
        await seller.save();

        return res.status(200).json({
            success: true,
            message: "Password changed successfully"
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
}

export async function sellerPersonalInfoChange(req, res) {

    try {

        const sellerId = req.user.id
        const { name, email, address } = req.body

        const seller = await Seller.findById(sellerId)
        if (!seller) {
            return res.status(404).json({
                success: false,
                message: "Seller not found"
            });
        }

        if (name) seller.username = name
        if (email) seller.email = name
        if (address) seller.businessAddress = address
        await seller.save();

        return res.status(200).json({
            success: true,
            message: "Profile Updated Sucessfully"
        });


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }

}




