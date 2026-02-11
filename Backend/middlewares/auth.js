import JWT from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()


export function verifyUser(req, res, next) {

    const token = req.cookies.accessToken

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "User is not authenticated"
        })
    }

    try {
        let decoded = JWT.verify(token, process.env.JWT_ACCESS_KEY)
        req.user = decoded
        next()

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid token or token expired",
        })
    }
}



//it attaches "user" if token exist if not then it will jump to guestSessionID genration
//we use verifyUser all over the app just to get the "user" that verifUser should use for protecting routes only :) like verify seller verify admin and all 



//this middleware will give us a user if user is loggedin no need to write it in between path and controller cuz
//accessToken is available meaning user is loggedin
// we use
// app.use(tryAuth)
// app.use(guestSession) 
//if user in not loggedin it will go to gentate guestSessionID 
export function tryAuth(req, res, next) {
    const token = req.cookies?.accessToken;

    if (!token) {
        return next();
    }

    try {
        const decoded = JWT.verify(token, process.env.JWT_ACCESS_KEY);
        req.user = decoded;
    } catch (error) {
        console.log(error);
    }
    next();
}









