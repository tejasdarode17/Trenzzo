import JWT from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()


//we use verifyUser all over the app just to get the "user" that verifUser should use for protecting routes only :) like verify seller verify admin and all 
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


//this middleware will give us a user if user is loggedin 
// app.use(tryAuth)
// app.use(guestSession) 
//if user in not loggedin it will go to gentate guestSessionID 
export function tryAuth(req, res, next) {
    const token = req?.cookies?.accessToken;
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


// !token -> guestSessionID -> genrateGuestSessionID
// if token is available then it will attach a user to the request and will go to the guestSessionId 
//after that explaination is written in guestSessionID








