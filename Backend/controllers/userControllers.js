import Cart from "../model/cartModel.js";
import Order from "../model/orderModel.js";
import Product from "../model/productModel.js";
import Return from "../model/returnModel.js";
import Review from "../model/reviewModel.js";
import User from "../model/userModel.js";
import bcrypt from "bcrypt"
import { deleteImage } from "../utils/cloudinaryHandler.js";

export async function fetchSearchSuggestions(req, res) {
    try {
        let search = req.query.search?.trim();
        if (!search || search.length < 2) {
            return res.json({ success: true, products: [] });
        }

        const products = await Product.find({
            $or: [
                { name: { $regex: search, $options: "i" } },
                { brand: { $regex: search, $options: "i" } },
            ],
        }).limit(10).select("name brand slug")
        return res.json({ success: true, products });
    } catch (error) {
        console.error("Error in fetchSearchSuggestions:", error);
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
}

export async function fetchSearchProducts(req, res) {
    try {
        const { search, page = 1, sort = "relevance" } = req.query;
        const limit = 5

        if (!search) {
            return res.json({ success: false, products: [] });
        }

        const query = {
            active: true,
            // outOfStock: false,
            $or: [
                { name: { $regex: search, $options: "i" } },
                { brand: { $regex: search, $options: "i" } },
            ]
        };

        let sortOptions = {}
        if (sort === "price_high_to_low") sortOptions = { price: -1 }
        if (sort === "price_low_to_high") sortOptions = { price: 1 }
        if (sort === "latest") sortOptions = { createdAt: -1 }

        const skip = (Number(page) - 1) * Number(limit)

        const products = await Product.find(query)
            .sort(sortOptions)
            .skip(skip)
            .limit(limit)
            .populate("seller")
            .populate("category")

        const total = await Product.countDocuments(query);

        if (!products.length) {
            return res.json({
                success: true,
                products: [],
                total: 0,
                currentPage: Number(page),
                totalPages: 0,
                message: "No products found",
            });
        }

        return res.json({
            success: true,
            products,
            total,
            currentPage: Number(page),
            totalPages: Math.ceil(total / limit),
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
}

export async function fetchProductDetails(req, res) {
    try {
        const userID = req?.user?.id
        const slug = req.params.slug;

        if (!userID) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized request"
            });
        }

        if (!slug) {
            return res.status(400).json({
                success: false,
                message: "Slug is required"
            });
        }

        const product = await Product.findOne({ slug })
            .populate("seller")
            .populate("category");

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        return res.json({
            success: true,
            message: "Product details fetched",
            product
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

export async function addAddress(req, res) {

    try {
        const userID = req.user.id
        const { name, phoneNumber, pinCode, locality, address, city, state, landmark, label, isDefault } = req.body

        const user = await User.findById(userID)

        if (!user) {
            return res.status(404).json({ success: false, message: "Unauthorized request" })
        }

        if (!name || !phoneNumber || !pinCode || !address || !city || !state) {
            return res.status(400).json({
                success: false,
                message: "Please fill in all required fields.",
            });
        }
        const newAddress = {
            name,
            phoneNumber,
            pinCode,
            locality,
            address,
            city,
            state,
            landmark,
            label: label || "Home",
            isDefault: isDefault || false,
        };


        if (user.addresses.length === 0) {
            newAddress.isDefault = true;
        }
        if (newAddress.isDefault) {
            user.addresses.forEach((addr) => (addr.isDefault = false));
        }

        user.addresses.push(newAddress);
        await user.save();

        return res.status(201).json({
            success: true,
            message: "Address added successfully!",
            address: newAddress,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
}

export async function editAddress(req, res) {
    try {
        const userId = req.user.id
        const addressId = req.params.id
        const { name, phoneNumber, pinCode, locality, address, city, state, landmark, label, isDefault } = req.body

        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        if (!addressId) {
            return res.status(404).json({ success: false, message: "AddressID not sent" });
        }

        const existingAddress = user.addresses.find(addr => addr._id.toString() === addressId);
        if (!existingAddress) {
            return res.status(404).json({ success: false, message: "Address not found" });
        }


        if (name) existingAddress.name = name;
        if (phoneNumber) existingAddress.phoneNumber = phoneNumber;
        if (pinCode) existingAddress.pinCode = pinCode;
        if (locality) existingAddress.locality = locality;
        if (address) existingAddress.address = address;
        if (city) existingAddress.city = city;
        if (state) existingAddress.state = state;
        if (landmark) existingAddress.landmark = landmark;
        if (label) existingAddress.label = label;

        if (isDefault !== undefined) {
            existingAddress.isDefault = isDefault;

            //rest need to marked false
            if (isDefault === true) {
                user.addresses.forEach(addr => {
                    if (addr._id.toString() !== addressId) {
                        addr.isDefault = false;
                    }
                });
            }
        }

        await user.save()

        return res.status(200).json({
            success: true,
            message: "Address updated successfully",
            address: existingAddress
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
}


// --------Cart and checkOut -----------------------------------

export async function addCart(req, res) {
    try {
        const userId = req.user.id
        const { productID, quantity = 1, attributes } = req.body

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        const product = await Product.findById(productID);
        if (!product) return res.status(404).json({ message: "Product not found" });

        if (product.stock <= 0) {
            return res.status(404).json({ message: "Sorry this product is out of stock" });
        }

        const priceAtTheTime = product.salePrice > 0 ? product.salePrice : product.price;

        let cart = await Cart.findOne({ user: userId })

        if (!cart) {
            cart = await Cart.create({ user: userId, items: [] });
        }

        const existingItem = cart.items.find((item) => item.product == productID && JSON.stringify(item.attributes) === JSON.stringify(attributes || {}))

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.items.push({
                product: productID,
                quantity,
                priceAtTheTime,
                attributes: attributes || {}
            });
        }

        let itemTotalAmmount = cart.items.reduce((sum, item) => sum + item.quantity * item?.priceAtTheTime, 0);
        let platformFees = 100

        cart.itemTotal = itemTotalAmmount
        cart.platformFees = platformFees
        cart.totalAmmount = itemTotalAmmount + platformFees

        await cart.save()
        const populatedCart = await cart.populate("items.product");

        return res.status(200).json({
            success: true,
            message: "Item Added",
            cart: populatedCart
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
}


export async function decreaseCartQuantity(req, res) {

    try {
        const userId = req.user.id
        const { productID, attributes } = req.body

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        const product = await Product.findById(productID);
        if (!product) return res.status(404).json({ message: "Product not found" });

        let cart = await Cart.findOne({ user: userId })
        if (!cart) return res.status(404).json({ message: "Cart Not found. Please add any item in cart" });

        const item = cart.items.find((item) => item.product == productID && JSON.stringify(item.attributes) === JSON.stringify(attributes || {}))
        if (!item) return res.status(404).json({ message: "This Item is no more exist in cart" });

        if (item.quantity > 1) {
            item.quantity -= 1
        } else {
            return res.status(404).json({ message: "Please use another button for removing this item" });
        }

        let itemTotalAmmount = cart.items.reduce((sum, item) => sum + item.quantity * item?.priceAtTheTime, 0);
        cart.itemTotal = itemTotalAmmount
        cart.totalAmmount = itemTotalAmmount + cart.platformFees

        await cart.save()
        const populatedCart = await cart.populate("items.product");

        return res.status(200).json({
            success: true,
            message: "Quantity Decrease",
            cart: populatedCart
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
}

export async function removeItemFromCart(req, res) {

    try {
        const userId = req.user.id
        const { productID, attributes } = req.body

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        const product = await Product.findById(productID);
        if (!product) return res.status(404).json({ message: "Product not found" });

        let cart = await Cart.findOne({ user: userId })
        if (!cart) return res.status(404).json({ message: "Cart Not found. Please add any item in cart" });

        const item = cart.items.find((item) => item.product == productID && JSON.stringify(item.attributes) === JSON.stringify(attributes || {}))
        if (!item) return res.status(404).json({ message: "This Item is no more exist in cart" });

        if (item) cart.items = cart.items.filter((item) => item.product.toString() !== productID.toString())

        let itemTotalAmmount = cart.items.reduce((sum, item) => sum + item.quantity * item?.priceAtTheTime, 0);
        cart.itemTotal = itemTotalAmmount
        cart.totalAmmount = itemTotalAmmount + cart.platformFees

        await cart.save()
        const populatedCart = await cart.populate("items.product");

        return res.status(200).json({
            success: true,
            message: "Item Removed",
            cart: populatedCart
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
}





export async function deleteCart(req, res) {
    try {
        const userId = req.user.id;

        const cart = await Cart.findOne({ user: userId });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found",
            });
        }

        await cart.deleteOne();

        return res.status(200).json({
            success: true,
            message: "Cart deleted successfully",
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
}

export async function fetchCart(req, res) {
    try {
        const userId = req.user.id;

        const cart = await Cart.findOne({ user: userId })
            .populate({
                path: "items.product",
                options: { strictPopulate: false }
            });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found",
            });
        }

        cart.items.forEach(item => {

            if (!item.product) {
                item.unavailable = true;
                item.stockIssue = false;
                item.lockedPrice = null;
                return;
            }

            if (item.product.stock < item.quantity) {
                item.unavailable = true;
                item.stockIssue = true;
                item.lockedPrice = null;
                cart.issues = true
                return;
            }

            item.unavailable = false;
            item.stockIssue = false;
            cart.issues = false

        });

        //as soon as user refresh the totalAmmount will always comes from latest price 
        let itemTotal = cart.items.reduce((sum, item) => {
            if (item.unavailable) return sum;
            const currentPrice = item.product.salePrice > 0 ? item.product.salePrice : item.product.price;
            return sum + item.quantity * currentPrice
        }, 0);

        cart.itemTotal = itemTotal
        cart.totalAmmount = itemTotal + cart.platformFees
        cart.save()

        return res.status(200).json({
            success: true,
            message: "Cart Fetched",
            cart,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
}

export async function checkOut(req, res) {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        const cart = await Cart.findOne({ user: userId }).populate("items.product");
        if (!cart) return res.status(404).json({ message: "Cart not found" });

        let hasIssues = false;

        cart.items.forEach(item => {

            if (!item.product) {
                item.unavailable = true;
                item.stockIssue = false;
                item.lockedPrice = null;
                hasIssues = true;
                return;
            }

            if (item.product.stock < item.quantity) {
                item.unavailable = true;
                item.stockIssue = true;
                item.lockedPrice = null;
                hasIssues = true;
                return;
            }

            item.unavailable = false;
            item.stockIssue = false;

            const frozenPrice = item.product.salePrice > 0 ? item.product.salePrice : item.product.price;
            item.lockedPrice = frozenPrice;
        });

        await cart.save();

        if (hasIssues) {
            return res.status(400).json({
                success: false,
                message: "Some items need your attention",
            });
        }

        let total = cart.items.reduce((sum, item) => sum + item.lockedPrice * item.quantity, 0);
        cart.itemTotal = total

        cart.platformFees = 100

        const finalAmount = total + cart.platformFees
        cart.totalAmmount = finalAmount
        cart.finalPayable = finalAmount
        await cart.save();

        return res.status(200).json({
            success: true,
            message: "Checkout ready",
            cart
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: err.message,
        });
    }
}

export async function buyNow(req, res) {
    try {
        const userId = req.user.id
        const { productID, quantity = 1, attributes } = req.body

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        const product = await Product.findById(productID);
        if (!product) return res.status(404).json({ message: "Product not found" });

        if (product.stock < quantity) {
            return res.status(400).json({ message: "Product out of stock" })
        }

        const lockedPrice = product.salePrice > 0 ? product.salePrice : product.price;
        const total = lockedPrice * quantity
        let platformFees = 100
        let finalPayable = total + platformFees

        const buyNowItem = {
            productID: product._id,
            product,
            name: product.name,
            image: product.images[0]?.url,
            brand: product.brand,
            attributes,
            itemTotal: lockedPrice,
            platformFees,
            quantity,
            finalPayable
        };

        return res.status(200).json({
            success: true,
            message: "Buy now item ready",
            item: buyNowItem,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
}

export async function getAllOrders(req, res) {
    try {
        const userId = req.user.id;
        let { search = "", page = 1 } = req.query;

        page = Number(page);
        const limit = 10;
        const skip = (page - 1) * limit;

        const baseQuery = { customer: userId };

        let productFilter = {};
        if (search.trim()) {
            const matchingProducts = await Product.find({ name: { $regex: search, $options: "i" } }).select("_id");
            const productIDs = matchingProducts.map(p => p._id);
            productFilter = { "items.product": { $in: productIDs } };
        }

        const finalQuery = search.trim() ? { ...baseQuery, ...productFilter } : baseQuery;

        const orders = await Order.find(finalQuery)
            .populate("items.product")
            .populate("items.seller", "username")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const filteredTotal = await Order.countDocuments(finalQuery);
        const totalOrders = await Order.countDocuments(baseQuery);

        res.status(200).json({
            success: true,
            orders,
            totalOrders,
            filteredTotal,
            page,
            pages: Math.ceil(filteredTotal / limit),
            limit,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
}


// ---return and review  ----------------
export async function userReturnRequest(req, res) {
    try {
        const userId = req.user.id;
        const { itemId, orderId, reason } = req.body;

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        if (order.customer.toString() !== userId.toString()) {
            return res.status(403).json({ success: false, message: "You are not authorized" });
        }

        const item = order.items.find(i => i._id.toString() === itemId);
        if (!item) {
            return res.status(404).json({ success: false, message: "Order item not found" });
        }

        if (item.deliveryStatus !== "delivered") {
            return res.status(400).json({ success: false, message: "Item is not delivered yet" });
        }


        const existing = await Return.findOne({ orderId, itemId });
        if (existing) {
            return res.status(400).json({ success: false, message: "Return already requested" });
        }


        const returnReq = await Return.create({
            orderId,
            itemId,
            seller: item.seller,
            customer: order.customer,
            reason,
            refundAmount: item.lockedPrice,
        });

        item.returnStatus = "requested"
        await order.save();

        res.status(200).json({
            success: true,
            message: "Return request submitted successfully",
            returnReq
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
}

export async function addProductReview(req, res) {
    try {
        const { productID, review, rating, image } = req.body
        const userId = req.user.id

        const product = await Product.findById(productID)
            .populate("reviews")

        if (!product) {
            return res.status(404).json({ success: false, message: "Product Not Found" });
        }

        const existingReview = product.reviews.find((r) => r.user.toString() === userId.toString())

        if (existingReview) {
            return res.status(400).json({ success: false, message: "You alrady reviewd you can edit that review only" });
        }


        const newReview = await Review.create({
            product: productID,
            user: userId,
            rating: rating,
            comment: review,
            image: image
        })

        product.reviews.push(newReview._id)

        product.totalReviews = product.reviews.length;

        const allRatings = await Review.find({ product: productID });
        const avg = allRatings.reduce((sum, r) => sum + r.rating, 0) / allRatings.length;

        //toFixed format number to only one decimal place 4.1666 = 4.2 but it returns string.
        product.avgRating = Number(avg.toFixed(1));
        await product.save()

        res.status(200).json({
            success: true,
            message: "Review Posted Successfully",
            review: newReview
        });

    } catch (error) {
        await deleteImage(req?.body?.image?.public_id)
        res.status(500).json({ success: false, message: "Server error" });
    }
}

export async function deleteReview(req, res) {

    try {

        const userID = req.user.id;
        const reviewID = req.params.id;
        const { productID } = req.body;

        if (!userID || !reviewID || !productID) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields",
            });
        }

        const review = await Review.findById(reviewID);

        if (!review) {
            return res.status(404).json({ success: false, message: "Review not found" });
        }

        if (review.user.toString() !== userID.toString()) {
            return res.status(403).json({
                success: false,
                message: "This review was not posted by you",
            });
        }


        if (review.image?.public_id) {
            await deleteImage(review.image.public_id);
        }

        await Product.findByIdAndUpdate(productID, { $pull: { reviews: reviewID } });
        await Review.findByIdAndDelete(reviewID);

        return res.status(200).json({
            success: true,
            message: "Review deleted successfully"
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
}

export async function getUserReviews(req, res) {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: UserID missing"
            });
        }

        const userReviews = await Review.find({ user: userId })
            .populate("product", "name images slug")
            .lean();

        if (!userReviews || userReviews.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No reviews found",
                reviews: []
            });
        }

        return res.status(200).json({
            success: true,
            count: userReviews.length,
            reviews: userReviews
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
}

// ----password and personal information ------------------


export async function userChangePassword(req, res) {

    try {
        const { currentPassword, newPassword } = req.body
        const userID = req.user.id

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Current Password or new password not provided"
            });
        }

        const user = await User.findById(userID)
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Seller not found"
            });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Current password is incorrect"
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        user.password = hashedPassword;
        await user.save();

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

export async function userPersonalInfoChange(req, res) {

    try {

        const userID = req.user.id
        const { username, email, } = req.body

        const user = await User.findById(userID)
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Seller not found"
            });
        }

        if (username) user.username = username
        if (email) user.email = email
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Profile Updated Sucessfully. Please Refresh"
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





// ------------------------------------------------------------------
//this api used by seller as well as user 
export async function fetchReviewsForProduct(req, res) {
    try {
        const userID = req.user.id;
        const { productID } = req.query;

        if (!userID || !productID) {
            return res.status(400).json({ success: false, message: "Something is missing" });
        }

        const reviews = await Review.find({ product: productID })
            .populate("user", "username")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            message: "Reviews fetched successfully",
            reviews
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
}
