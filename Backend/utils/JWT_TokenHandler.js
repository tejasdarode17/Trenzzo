import JWT from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()


export function generateAccessToken(payload) {
    return JWT.sign(payload, process.env.JWT_ACCESS_KEY, { expiresIn: "15m" });
}

export function generateRefreshToken(payload) {
    return JWT.sign(payload, process.env.JWT_REFRESH_KEY, { expiresIn: "7d" });
}


export function verifyToken(token) {
    return JWT.verify(token, process.env.JWT_REFRESH_KEY);
}


