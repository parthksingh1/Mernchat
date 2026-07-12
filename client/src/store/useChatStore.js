import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,
    typingUsers: [], // Array to store user IDs currently typing

    unreadMessages: {}, // Object to store unread counts { userId: count }

    getUsers: async () => {
        set({ isUsersLoading: true });
        try {
            const res = await axiosInstance.get("/messages/users");
            set({ users: res.data });
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isUsersLoading: false });
        }
    },

    getMessages: async (userId) => {
        set({ isMessagesLoading: true });
        try {
            const res = await axiosInstance.get(`/messages/${userId}`);
            set({ messages: res.data });

            // Clear unread messages for this user when chat is opened
            set(state => ({
                unreadMessages: {
                    ...state.unreadMessages,
                    [userId]: 0
                }
            }));
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isMessagesLoading: false });
        }
    },
    sendMessage: async (messageData) => {
        const { selectedUser, messages } = get();
        try {
            const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
            set({ messages: [...messages, res.data] });
        } catch (error) {
            toast.error(error.response.data.message);
        }
    },

    sendTypingStatus: (isTyping) => {
        const { selectedUser } = get();
        const socket = useAuthStore.getState().socket;
        if (!selectedUser || !socket) return;

        if (isTyping) {
            socket.emit("typing", { receiverId: selectedUser._id });
        } else {
            socket.emit("stopTyping", { receiverId: selectedUser._id });
        }
    },

    markMessagesAsRead: async (senderId) => {
        try {
            await axiosInstance.put(`/messages/read/${senderId}`);
        } catch (error) {
            console.log("Error in markMessagesAsRead store action:", error);
        }
    },

    subscribeToMessages: () => {
        const { selectedUser } = get();
        const socket = useAuthStore.getState().socket;
        if (!socket) return;

        socket.on("newMessage", (newMessage) => {
            const isMessageSentFromSelectedUser = selectedUser && newMessage.senderId === selectedUser._id;

            if (!isMessageSentFromSelectedUser) {
                // Play notification sound
                const sound = new Audio("https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3");
                sound.play().catch(e => console.log("Sound play failed", e));

                // Provide visual toast notification
                toast(`New message from ${newMessage.senderId}`);

                // Update unread count
                set(state => ({
                    unreadMessages: {
                        ...state.unreadMessages,
                        [newMessage.senderId]: (state.unreadMessages[newMessage.senderId] || 0) + 1
                    }
                }));
                return;
            }

            // Immediately mark as read on the backend
            get().markMessagesAsRead(selectedUser._id);
            newMessage.isRead = true;

            set({
                messages: [...get().messages, newMessage],
            });
        });

        socket.on("typing", ({ senderId }) => {
            if (selectedUser && selectedUser._id === senderId) {
                set((state) => {
                    if (!state.typingUsers.includes(senderId)) {
                        return { typingUsers: [...state.typingUsers, senderId] };
                    }
                    return {};
                });
            }
        });

        socket.on("stopTyping", ({ senderId }) => {
            set((state) => ({
                typingUsers: state.typingUsers.filter((id) => id !== senderId),
            }));
        });

        socket.on("messagesRead", ({ readBy }) => {
            if (selectedUser && selectedUser._id === readBy) {
                set((state) => ({
                    messages: state.messages.map((msg) =>
                        msg.receiverId === readBy ? { ...msg, isRead: true } : msg
                    ),
                }));
            }
        });
    },

    unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket;
        if (!socket) return;
        socket.off("newMessage");
        socket.off("typing");
        socket.off("stopTyping");
        socket.off("messagesRead");
    },

    setSelectedUser: (selectedUser) => {
        set({ selectedUser, typingUsers: [] });
        if (selectedUser) {
            set(state => ({
                unreadMessages: {
                    ...state.unreadMessages,
                    [selectedUser._id]: 0
                }
            }));
        }
    },
}));
