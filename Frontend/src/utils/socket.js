import { io } from "socket.io-client";

let socket
export const connectSocket = ({ userId, role }) => {
    if (!socket) {
        socket = io(import.meta.env.VITE_SOCKET_URL, {
            withCredentials: true,
            auth: {
                userId,
                role,
            },
        });
    }
    return socket;
}

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};

export const getSocket = () => socket;
