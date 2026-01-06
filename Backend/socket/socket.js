import { Server } from "socket.io";

let io = null
export function initSocket(server) {

    io = new Server(server, {
        cors: {
            origin: process.env.CLIENT_URL,
            credentials: true,
        },
    });


    io.on("connection", (socket) => {
        const { userId, role } = socket.handshake.auth;

        if (!userId || !role) {
            socket.disconnect();
            return;
        }

        socket.userId = userId;
        socket.role = role;

        if (role === "seller") {
            socket.join(`seller_${userId.toString()}`);
        }

        socket.on("disconnect", () => {
            console.log(`Socket disconnected`);
        })

    })

}

export function getIO() {
    if (!io) {
        throw new Error("Socket.io not initialized");
    }
    return io;
}

