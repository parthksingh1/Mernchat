const MessageSkeleton = () => {
    return (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Sender - Left aligned */}
            <div className="chat chat-start">
                <div className="chat-image avatar">
                    <div className="size-10 rounded-full skeleton"></div>
                </div>
                <div className="chat-header mb-1">
                    <div className="skeleton h-4 w-16"></div>
                </div>
                <div className="chat-bubble bg-transparent p-0">
                    <div className="skeleton h-16 w-[200px]"></div>
                </div>
            </div>

            {/* User - Right aligned */}
            <div className="chat chat-end">
                <div className="chat-image avatar">
                    <div className="size-10 rounded-full skeleton"></div>
                </div>
                <div className="chat-header mb-1">
                    <div className="skeleton h-4 w-16"></div>
                </div>
                <div className="chat-bubble bg-transparent p-0">
                    <div className="skeleton h-16 w-[200px]"></div>
                </div>
            </div>
        </div>
    );
};

export default MessageSkeleton;
