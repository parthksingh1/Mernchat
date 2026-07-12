import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: [
            "http://localhost:5173",
            "https://mer-nchat.vercel.app",
            "https://mernchat-flax.vercel.app"
        ],
        credentials: true,
    },
});

export const getReceiverSocketId = (userId) => {
    const sockets = userSocketMap[userId];
    return sockets && sockets.length > 0 ? sockets[sockets.length - 1] : null;
};

const userSocketMap = {}; // {userId: [socketId1, socketId2]}

io.on("connection", (socket) => {
    console.log("A user connected", socket.id);

    const userId = socket.handshake.query.userId;
    if (userId) {
        if (!userSocketMap[userId]) {
            userSocketMap[userId] = [];
        }
        if (!userSocketMap[userId].includes(socket.id)) {
            userSocketMap[userId].push(socket.id);
        }
    }

    // io.emit() is used to send events to all the connected clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    // Call Events
    socket.on("callUser", (data) => {
        const receiverSocketId = getReceiverSocketId(data.userToCall);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("callUser", {
                signal: data.signalData,
                from: data.from,
                name: data.name
            });
        }
    });

    socket.on("answerCall", (data) => {
        const receiverSocketId = getReceiverSocketId(data.to);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("callAccepted", data.signal);
        }
    });

    // Typing Events
    socket.on("typing", (data) => {
        const receiverSocketId = getReceiverSocketId(data.receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("typing", { senderId: userId });
        }
    });

    socket.on("stopTyping", (data) => {
        const receiverSocketId = getReceiverSocketId(data.receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("stopTyping", { senderId: userId });
        }
    });

    socket.on("disconnect", () => {
        console.log("A user disconnected", socket.id);
        if (userId && userSocketMap[userId]) {
            userSocketMap[userId] = userSocketMap[userId].filter(id => id !== socket.id);
            if (userSocketMap[userId].length === 0) {
                delete userSocketMap[userId];
            }
        }
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});

export { io, app, server };
