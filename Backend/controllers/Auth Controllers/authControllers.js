import User from "../../model/userModel.js";
import Seller from "../../model/sellerModel.js";
import bcrypt from "bcrypt"
import { genrateToken } from "../../utils/genrateToken.js";
import Admin from "../../model/adminModel.js";
import DeliveryPartner from "../../model/deliveryPartnerModel.js";


//user (shopper)
export async function registerUser(req, res) {

    const { name, email, password } = req.body

    try {

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Something is missing"
            })
        }

        const existingUser = await User.findOne({ email })

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "This email is already registred with another account please try with diffrent email"
            })
        }

        const hashPassword = await bcrypt.hash(password, 10)

        const newUser = await User.create({
            username: name,
            email: email,
            password: hashPassword
        })

        const accessToken = genrateToken({ id: newUser._id, role: newUser.role, email: newUser.email })

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: false, // true in production
            sameSite: "Lax",
            path: "/",
        });

        const safeUser = {
            _id: newUser._id,
            username: newUser.username,
            email: newUser.email,
            role: newUser.role,
            addresses: newUser.addresses,
        };

        return res.status(200).json({
            success: true,
            message: "User registered successfully",
            user: safeUser
        })

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
}

export async function loginUser(req, res) {

    const { email, password } = req.body

    try {

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "All the feilds are mandatory"
            })
        }

        const user = await User.findOne({ email }) || await Admin.findOne({ email })

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not exist with this email"
            })
        }

        const matchPassword = await bcrypt.compare(password, user.password)

        if (!matchPassword) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        const accessToken = genrateToken({ id: user._id, role: user.role, email: user.email })

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: false,
            sameSite: "Lax",
            path: "/"
        })

        if (user.role === "admin") {
            return res.status(200).json({
                success: true,
                message: "User Logged in Success",
                user: user
            })
        }

        if (user.role === "user") {
            const safeUser = {
                _id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                addresses: user.addresses
            };

            return res.status(200).json({
                success: true,
                message: "User Logged in Success",
                user: safeUser
            })
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
}

//seller 
export async function registerSeller(req, res) {

    try {
        const { name, email, address, password } = req.body

        if (!name || !email || !address || !password) {
            return res.status(400).json({
                success: false,
                message: "All the feilds are required"
            })
        }

        const existingSeller = await Seller.findOne({ email })

        if (existingSeller) {
            return res.status(400).json({
                success: false,
                message: "this email is already taken by another seller please use diffrent email"
            })
        }

        const hashPassword = await bcrypt.hash(password, 10)

        const newSeller = await Seller.create({
            username: name,
            email: email,
            businessAddress: address,
            password: hashPassword
        })

        const accessToken = genrateToken({ id: newSeller._id, role: newSeller.role, email: newSeller.email })

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: false,
            sameSite: "Lax",
            path: "/"
        })

        const safeUser = {
            _id: newSeller._id,
            username: newSeller.username,
            email: newSeller.email,
            role: newSeller.role,
            status: newSeller.status,
            businessAddress: newSeller.businessAddress,
            razorpayAccountId: newSeller.razorpayAccountId,
            products: newSeller.products
        };

        return res.status(200).json({
            success: true,
            message: "Seller Registred Successfully",
            user: safeUser
        })


    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
}

export async function loginSeller(req, res) {

    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "All the feilds are required"
            })
        }

        const seller = await Seller.findOne({ email })
        if (!seller) {
            return res.status(400).json({
                success: false,
                message: "seller does not exist with this email"
            })
        }

        const matchPassword = await bcrypt.compare(password, seller.password)
        if (!matchPassword) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }


        const accessToken = genrateToken({ id: seller._id, role: seller.role, email: seller.email })

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: false,
            sameSite: "Lax",
            path: "/"
        })

        const safeUser = {
            _id: seller._id,
            username: seller.username,
            email: seller.email,
            role: seller.role,
            status: seller.status,
            businessAddress: seller.businessAddress,
            razorpayAccountId: seller.razorpayAccountId,
            products: seller.products
        };

        return res.status(200).json({
            success: true,
            message: "Seller loggedin Successfully",
            user: safeUser
        })


    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }

}

//delivery partner
export async function registerDeliveryPartner(req, res) {
    try {
        const { name, email, password, phone, vehicle } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const existingPartner = await DeliveryPartner.findOne({ email });

        if (existingPartner) {
            return res.status(400).json({
                success: false,
                message: "This email is already registered by another delivery partner"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newPartner = await DeliveryPartner.create({
            username: name,
            email,
            phone: phone,
            vehicleType: vehicle,
            password: hashedPassword
        });

        const accessToken = genrateToken({
            id: newPartner._id,
            role: newPartner.role,
            email: newPartner.email
        });

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: false,
            sameSite: "Lax",
            path: "/"
        });

        return res.status(200).json({
            success: true,
            message: "Delivery Partner registered successfully",
            user: newPartner
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

export async function loginDeliveryPartner(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const partner = await DeliveryPartner.findOne({ email });

        if (!partner) {
            return res.status(400).json({
                success: false,
                message: "Delivery partner does not exist with this email"
            });
        }

        const isMatch = await bcrypt.compare(password, partner.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const accessToken = genrateToken({
            id: partner._id,
            role: partner.role,
            email: partner.email
        });

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: false,
            sameSite: "Lax",
            path: "/"
        });

        return res.status(200).json({
            success: true,
            message: "Delivery partner logged in successfully",
            user: partner
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


//logout this is common for all the users 
export async function logout(req, res) {
    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: false,
        sameSite: "Lax",
        path: "/"
    });
    return res.status(200).json({ success: false, message: "Logged out successfully" });
}


