import crypto from "crypto";

// if tryAuth attachd a user then return next() meaning go to the controller without genrating the guestID meaning the user is login

export function guestSession(req, res, next) {
    if (req.user) return next();
    let sessionId = req.cookies?.sessionId;

    if (!sessionId) {
        sessionId = "sess_" + crypto.randomUUID();

        res.cookie("sessionId", sessionId, {
            httpOnly: true,
            sameSite: "lax",
            secure: false,
            path: "/",
            maxAge: 30 * 24 * 60 * 60 * 1000,
        });
    }
    req.guestSessionId = sessionId;
    next();
}


