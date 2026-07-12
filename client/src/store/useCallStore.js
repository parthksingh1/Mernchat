import { create } from "zustand";

export const useCallStore = create((set) => ({
    isCalling: false,
    isReceivingCall: false,
    caller: null,
    callerSignal: null,
    callAccepted: false,
    callEnded: false,
    name: "",

    startCall: () => set({ isCalling: true }),
    endCall: () => set({
        isCalling: false,
        isReceivingCall: false,
        callAccepted: false,
        callEnded: false,
        callerSignal: null
    }),
    setReceivingCall: (data) => set({
        isReceivingCall: true,
        caller: data.from,
        name: data.name,
        callerSignal: data.signal
    }),
    setCallAccepted: (status) => set({ callAccepted: status })
}));
