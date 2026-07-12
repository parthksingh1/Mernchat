import { X, Video } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import { useCallStore } from "../store/useCallStore";

const ChatHeader = () => {
    const { selectedUser, setSelectedUser } = useChatStore();
    const { onlineUsers } = useAuthStore();
    const { startCall } = useCallStore();

    return (
        <div className="p-2.5 border-b border-base-300">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div className="avatar">
                        <div className="size-10 rounded-full relative">
                            <img src={selectedUser.profilePic || "/avatar.png"} alt={selectedUser.fullName} />
                        </div>
                    </div>

                    {/* User info */}
                    <div>
                        <h3 className="font-medium">{selectedUser.fullName}</h3>
                        <p className="text-xs text-base-content/70">
                            {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
                        </p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                    {/* Video Call Button */}
                    <button onClick={startCall} className="btn btn-sm btn-ghost btn-circle" title="Video Call">
                        <Video size={20} />
                    </button>

                    {/* View Profile Button */}
                    <button
                        className="btn btn-sm btn-ghost btn-circle"
                        title="View Profile"
                        onClick={() => document.getElementById('profile_modal').showModal()}
                    >
                        <div className="size-5 rounded-full border border-current flex items-center justify-center">?</div>
                    </button>

                    {/* Close button */}
                    <button onClick={() => setSelectedUser(null)}>
                        <X />
                    </button>
                </div>

                {/* Profile Modal */}
                <dialog id="profile_modal" className="modal">
                    <div className="modal-box text-center">
                        <form method="dialog">
                            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                        </form>
                        <h3 className="font-bold text-lg mb-4">User Profile</h3>
                        <div className="flex flex-col items-center gap-4">
                            <img
                                src={selectedUser.profilePic || "/avatar.png"}
                                alt={selectedUser.fullName}
                                className="size-32 rounded-full object-cover border-4"
                            />
                            <div className="text-left w-full pl-8">
                                <p className="text-sm text-base-content/70">Full Name</p>
                                <p className="font-medium text-lg mb-2">{selectedUser.fullName}</p>

                                <p className="text-sm text-base-content/70">Email</p>
                                <p className="font-medium text-lg mb-2">{selectedUser.email}</p>

                                <p className="text-sm text-base-content/70">Member Since</p>
                                <p className="font-medium text-lg">{selectedUser.createdAt?.split("T")[0]}</p>
                            </div>
                        </div>
                    </div>
                    <form method="dialog" className="modal-backdrop">
                        <button>close</button>
                    </form>
                </dialog>
            </div>
        </div>
    );
};
export default ChatHeader;
