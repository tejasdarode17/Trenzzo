import User from "../model/userModel.js";
import Seller from "../model/sellerModel.js";
import bcrypt from "bcrypt"
import Admin from "../model/adminModel.js";
import DeliveryPartner from "../model/deliveryPartnerModel.js";
import { generateOTP, sendEmailOtp } from "../utils/OtpHandler.js";
import EmailOtp from "../model/emailOtpModel.js";
import { generateAccessToken, generateRefreshToken, verifyToken } from "../utils/JWT_TokenHandler.js";
import sendMailFromResend from "../config/resend.js";

//user (shopper)
export async function registerUser(req, res) {
    try {
        const { name, email, password } = req.body

        const safeEmail = email.toLowerCase()
        if (!name || !safeEmail || !password) {
            return res.status(400).json({
                success: false,
                message: "Something is missing"
            })
        }

        const existingUser = await User.findOne({ email: safeEmail })
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "This email is already registred with another account please try with diffrent email"
            })
        }

        const hashPassword = await bcrypt.hash(password, 10)
        //plylod containing all the feilds which are needed during the user creation
        const payload = {
            username: name,
            email: safeEmail,
            password: hashPassword,
        }

        await sendEmailOtp({ email: safeEmail, role: "user", payload });

        return res.status(201).json({
            success: true,
            message: "Registration successful. Please verify your email using OTP.",
        })

    } catch (error) {
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

        const accessToken = generateAccessToken({ id: user._id, role: user.role, email: user.email })
        const refreshToken = generateRefreshToken({ id: user._id, role: user.role, email: user.email });

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 1000 * 60 * 15,
            path: "/"
        });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 1000 * 60 * 60 * 24 * 7,
            path: "/"
        });

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
        const payload = {
            username: name,
            email: email,
            password: hashPassword,
            businessAddress: address
        }

        await sendEmailOtp({ email, role: "seller", payload })

        return res.status(200).json({
            success: true,
            message: "Registration successful. Please verify your email using OTP.",
        })

    } catch (error) {
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


        const accessToken = generateAccessToken({ id: seller._id, role: seller.role, email: seller.email })
        const refreshToken = generateRefreshToken({ id: seller._id, role: seller.role, email: seller.email });

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 1000 * 60 * 15,
            path: "/"
        });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
            path: "/"
        });

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
        const payload = {
            username: name,
            email: email,
            phone: phone,
            vehicleType: vehicle,
            password: hashedPassword
        }

        await sendEmailOtp({ email, role: "deliveryPartner", payload })

        return res.status(200).json({
            success: true,
            message: "Registration successful. Please verify your email using OTP.",
        })

    } catch (error) {
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

        const accessToken = generateAccessToken({ id: partner._id, role: partner.role, email: partner.email });
        const refreshToken = generateRefreshToken({ id: partner._id, role: partner.role, email: partner.email });

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 1000 * 60 * 15,
            path: "/"
        });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
            path: "/"
        });


        return res.status(200).json({
            success: true,
            message: "Delivery partner logged in successfully",
            user: partner
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
}



//common for all the users 
export async function verifyEmailOtp(req, res) {

    try {
        const { email, otp, } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ message: "Missing fields" });
        }

        //  (preventing race condition)
        const record = await EmailOtp.findOneAndUpdate(
            {
                email: email.toLowerCase(),
                isUsed: false,
                expiresAt: { $gt: new Date() },
            },
            { $inc: { attempts: 1 }, },
            { new: true }
        );

        if (!record) {
            return res.status(400).json({ message: "OTP expired or invalid" });
        }

        if (record.attempts > 5) {
            await EmailOtp.deleteOne({ _id: record._id });
            return res.status(429).json({ message: "Too many attempts. Please resend OTP." });
        }

        const isValid = await bcrypt.compare(otp, record.otpHash);
        if (!isValid) {
            return res.status(400).json({ message: "Invalid OTP" });
        }

        let existingAccount;
        if (record.role === "user") {
            existingAccount = await User.findOne({ email });
        } else if (record.role === "seller") {
            existingAccount = await Seller.findOne({ email });
        } else if (record.role === "deliveryPartner") {
            existingAccount = await DeliveryPartner.findOne({ email });
        }

        if (existingAccount) {
            await EmailOtp.deleteOne({ _id: record._id });
            return res.status(400).json({ message: "Account already exists" });
        }

        let account;
        if (record.role === "user") {
            account = await User.create({
                ...record.payload,
                isVerified: true,
            });
        } else if (record.role === "seller") {
            account = await Seller.create({
                ...record.payload,
                isVerified: true,
            });
        } else if (record.role === "deliveryPartner") {
            account = await DeliveryPartner.create({
                ...record.payload,
                isVerified: true,
            });
        } else {
            return res.status(400).json({ message: "Invalid role" });
        }

        record.isUsed = true;
        await record.save();


        const accessToken = generateAccessToken({ id: account._id, role: account.role, email: account.email })
        const refreshToken = generateRefreshToken({ id: account._id, role: account.role, email: account.email });

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 1000 * 60 * 15,
            path: "/"
        });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
            path: "/"
        });

        return res.status(200).json({
            success: true,
            message: "Email verified successfully",
            user: {
                _id: account._id,
                username: account.username,
                email: account.email,
                role: account.role,
            },
        });

    } catch (err) {
        return res.status(500).json({ message: "Server error" });
    }
}

export async function resendEmailOtp(req, res) {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Missing email or role" });
        }

        const safeEmail = email.toLowerCase();

        // Find existing OTP record
        const record = await EmailOtp.findOne({
            email: safeEmail,
            isUsed: false,
        });

        if (!record) {
            return res.status(404).json({
                message: "No pending registration found. Please register again.",
            });
        }

        const lastSent = record.updatedAt || record.createdAt;
        const diff = Date.now() - new Date(lastSent).getTime();

        if (diff < 30 * 1000) {
            return res.status(429).json({
                message: "Please wait before requesting OTP again.",
            });
        }

        const otp = generateOTP();
        const otpHash = await bcrypt.hash(otp, 10);

        record.otpHash = otpHash;
        record.expiresAt = new Date(Date.now() + 10 * 60 * 1000);
        record.attempts = 0;
        record.isUsed = false;

        await record.save();

        await sendMailFromResend({
            to: safeEmail,
            subject: "Verify your email",
            html: `
                <h2>Email Verification</h2>
                <p>Your OTP is <strong>${otp}</strong></p>
                <p>This OTP is valid for 10 minutes.</p>
            `,
        });

        return res.status(200).json({
            success: true,
            message: "OTP resent successfully",
        });

    } catch (err) {
        return res.status(500).json({ message: "Server error" });
    }
}

export async function checkAuth(req, res) {
    try {
        const authUser = req.user;
        if (!authUser) {
            return res.status(400).json({
                success: false,
                message: "Authentication problem",
            });
        }

        let model = ""
        if (authUser.role === "seller") {
            model = Seller;
        } else if (authUser.role === "user") {
            model = User;
        } else if (authUser.role === "admin") {
            model = Admin;
        } else if (authUser.role === "deliveryPartner") {
            model = DeliveryPartner;
        } else {
            return res.status(400).json({
                success: false,
                message: "Invalid role",
            });
        }

        const userData = await model.findById(authUser.id).select("-password");

        if (!userData) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Authenticated user",
            user: userData,
        });


    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
}

export async function logout(req, res) {
    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/"
    });

    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/"
    });
    return res.status(200).json({ success: false, message: "Logged out successfully" });
}

export async function getRefreshToken(req, res) {

    const token = req.cookies.refreshToken;
    if (!token) return res.sendStatus(401);


    try {
        const decoded = verifyToken(token)
        const newAccessToken = generateAccessToken({
            id: decoded.id,
            role: decoded.role,
            email: decoded.email
        });

        res.cookie("accessToken", newAccessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 1000 * 60 * 15,
            path: "/"
        });

        return res.status(200).json({ success: true });

    } catch (err) {
        return res.sendStatus(401);
    }
}

