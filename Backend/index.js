import express from "express";
import http from "http"
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import sellerRouter from "./routes/sellerRoutes.js"
import authRouter from "./routes/authRoutes.js"
import imageRouter from "./routes/imageRoutes.js"
import adminRouter from "./routes/adminRoutes.js"
import userRouter from "./routes/userRoutes.js"
import paymentRouter from "./routes/paymentRoutes.js"
import deliveryRouter from "./routes/deliveryPartnerRoute.js"
import cloudinaryConfig from "./config/cloudinary.js";
import { initSocket } from "./socket/socket.js";
import dbConnect from "./config/dbConnect.js"
import { createSuperAdminOnce } from "./controllers/adminControllers.js";
dotenv.config();

const app = express();

// “Trust the first reverse proxy(Vercel) to tell the truth about the original request.”
app.set("trust proxy", 1)

const server = http.createServer(app)
const PORT = process.env.PORT || 5000;

app.use(
    cors({
        origin: process.env.CLIENT_URL,
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: [
            "Content-Type",
            "Authorization",
            "Cache-Control",
            "Expires",
            "Pragma",
        ],
        credentials: true,
    })
)

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.use("/api/v1", authRouter)
app.use("/api/v1", imageRouter)
app.use("/api/v1", sellerRouter)
app.use("/api/v1", adminRouter)
app.use("/api/v1", userRouter)
app.use("/api/v1", paymentRouter)
app.use("/api/v1", deliveryRouter)


async function startServer() {
    await dbConnect()
    cloudinaryConfig()

    await createSuperAdminOnce();

    initSocket(server);

    server.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    })
}

startServer().catch(err => {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
})
