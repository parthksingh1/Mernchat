import { useEffect, useRef, useState } from "react";
import Peer from "simple-peer";
import { Phone, PhoneOff, Video, Mic, MicOff, Camera, CameraOff } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useCallStore } from "../store/useCallStore";
import { useChatStore } from "../store/useChatStore";
import toast from "react-hot-toast";

const CallComponent = () => {
    // Call Component with WebRTC logic
    const { authUser, socket } = useAuthStore();
    const { selectedUser } = useChatStore();
    const {
        isCalling, isReceivingCall, caller, callerSignal,
        endCall, setReceivingCall, callAccepted, setCallAccepted,
        name, callEnded
    } = useCallStore();

    const [stream, setStream] = useState(null);
    const [isMicOn, setIsMicOn] = useState(true);
    const [isCameraOn, setIsCameraOn] = useState(true);

    const myVideo = useRef();
    const userVideo = useRef();
    const connectionRef = useRef();

    if (!socket) return null;

    useEffect(() => {
        if (!socket) return;
        socket.on("callUser", (data) => {
            setReceivingCall(data);
        });

        return () => {
            socket.off("callUser");
        };
    }, [socket, setReceivingCall]);

    useEffect(() => {
        if (!socket) return;
        const needsMedia = isCalling || (isReceivingCall && callAccepted);

        if (needsMedia && !stream) {
            navigator.mediaDevices.getUserMedia({ video: true, audio: true })
                .then((currentStream) => {
                    setStream(currentStream);
                    if (myVideo.current) {
                        myVideo.current.srcObject = currentStream;
                    }

                    // Caller Logic: Initiate Call once stream is ready
                    if (isCalling && !callAccepted && !connectionRef.current) {
                        initiatePeerCall(currentStream);
                    }

                    // Receiver Logic: If we just answered and now got the stream, signal answer
                    // Note: answerCall button sets callAccepted=true, which triggers this effect.
                    // We need to pass this stream to the answer signal logic.
                    // But wait, answerCall function creates the peer.
                    // Let's separate "User clicked Answer" from "Signaling Answer".
                    if (isReceivingCall && callAccepted && !connectionRef.current) {
                        answerCallWithStream(currentStream);
                    }

                })
                .catch((err) => {
                    console.error("Failed to get media:", err);
                    toast.error("Could not access camera/microphone");
                    endCall();
                });
        } else if (!needsMedia && stream) {
            // Clean up if we stop calling
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
    }, [isCalling, isReceivingCall, callAccepted, stream, socket]);
    // stream dependency added to ensure we react if it is cleared
    // But be careful: setting stream inside will trigger this again. 
    // The !stream check prevents infinite loop.

    const initiatePeerCall = (currentStream) => {
        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream: currentStream,
        });

        peer.on("signal", (data) => {
            socket.emit("callUser", {
                userToCall: selectedUser._id,
                signalData: data,
                from: authUser._id,
                name: authUser.fullName,
            });
        });

        peer.on("stream", (remoteStream) => {
            if (userVideo.current) {
                userVideo.current.srcObject = remoteStream;
            }
        });

        socket.on("callAccepted", (signal) => {
            setCallAccepted(true);
            peer.signal(signal);
        });

        connectionRef.current = peer;
    };

    const answerCallWithStream = (currentStream) => {
        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream: currentStream,
        });

        peer.on("signal", (data) => {
            socket.emit("answerCall", { signal: data, to: caller });
        });

        peer.on("stream", (remoteStream) => {
            if (userVideo.current) {
                userVideo.current.srcObject = remoteStream;
            }
        });

        peer.signal(callerSignal);
        connectionRef.current = peer;
    };

    const handleAnswer = () => {
        setCallAccepted(true);
        // This updates state -> triggers useEffect -> gets media -> calls answerCallWithStream
    };

    const leaveCall = () => {
        endCall();
        if (connectionRef.current) connectionRef.current.destroy();
        window.location.reload(); // Simple way to clean up for now
    };

    const toggleMic = () => {
        setIsMicOn(!isMicOn);
        stream.getAudioTracks()[0].enabled = !isMicOn;
    };

    const toggleCamera = () => {
        setIsCameraOn(!isCameraOn);
        stream.getVideoTracks()[0].enabled = !isCameraOn;
    };

    // Render Logic
    // 1. Not in call, but receiving one
    if (isReceivingCall && !callAccepted) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
                <div className="bg-base-100 p-8 rounded-xl flex flex-col items-center gap-4">
                    <h2 className="text-2xl font-semibold mb-4">{name} is calling...</h2>
                    <div className="flex gap-4">
                        <button onClick={handleAnswer} className="btn btn-success btn-circle btn-lg text-white">
                            <Phone size={32} />
                        </button>
                        <button onClick={() => setReceivingCall(false)} className="btn btn-error btn-circle btn-lg text-white">
                            <PhoneOff size={32} />
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // 2. Not in call and not receiving (Do not render anything global unless prompted)
    // Wait, we need a trigger to start the call.
    // This component needs to be embedded in ChatContainer or managed globally.

    // For simplicity, let's allow this component to just render the active call UI
    // and we will trigger `callUser` from the parent.

    return (
        <div className={`fixed inset-0 z-40 bg-black flex flex-col ${callAccepted || stream ? '' : 'hidden'}`}>
            <div className="flex-1 relative">
                {/* Remote Video */}
                {callAccepted && !callEnded && (
                    <video playsInline ref={userVideo} autoPlay className="w-full h-full object-cover" />
                )}

                {/* My Video (Picture in Picture) */}
                {stream && (
                    <div className="absolute top-4 right-4 w-32 h-48 bg-gray-900 rounded-lg overflow-hidden border-2 border-primary shadow-lg">
                        <video playsInline muted ref={myVideo} autoPlay className="w-full h-full object-cover" />
                    </div>
                )}

                {/* Controls */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-gray-900/50 p-4 rounded-full backdrop-blur">
                    <button onClick={toggleMic} className={`btn btn-circle ${!isMicOn ? 'btn-error' : 'btn-ghost text-white'}`}>
                        {isMicOn ? <Mic /> : <MicOff />}
                    </button>

                    <button onClick={toggleCamera} className={`btn btn-circle ${!isCameraOn ? 'btn-error' : 'btn-ghost text-white'}`}>
                        {isCameraOn ? <Camera /> : <CameraOff />}
                    </button>

                    <button onClick={leaveCall} className="btn btn-circle btn-error text-white">
                        <PhoneOff />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CallComponent;
