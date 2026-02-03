import JWT from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()


export function generateAccessToken(payload) {
    return JWT.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: "30m" });
}

export function generateRefreshToken(payload) {
    return JWT.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: "7d" });
}


export function verifyToken(payload) {
    try {
        let data = JWT.verify(payload, process.env.JWT_SECRET_KEY)
        return data
    } catch (error) {
        console.log(error);
    }
}

