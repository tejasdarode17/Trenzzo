import mongoose from "mongoose";
import dotenv from "dotenv"
dotenv.config()

async function dbConnect() {
    try {
        await mongoose.connect(process.env.DB_URL)
    } catch (error) {
        console.log(error);
    }

}


export default dbConnect