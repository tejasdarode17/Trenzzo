import JWT from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()


export function verifyUser(req, res, next) {

    const token = req.cookies.accessToken

    console.log(token);
    

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "User is not authenticated"
        })
    }

    try {
        let decoded = JWT.verify(token, process.env.JWT_SECRET_KEY)
        req.user = decoded
        next()

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid token or token expired",
        })
    }
}






