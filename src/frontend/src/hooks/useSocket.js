import { useEffect, useRef } from "react";
import { io } from "socket.io-client";

export default function useSocket({ url = "http://localhost:3000", auth } = {}) {
    const socketRef = useRef(null);

    useEffect(() => {
        if (socketRef.current) return;
        socketRef.current = io(url, { auth: auth ? { apiKey: auth } : undefined, transports: ["websocket"] });

        const s = socketRef.current;
        s.on("connect", () => console.log("socket connected", s.id));
        s.on("connect_error", (err) => console.warn("socket connect_error", err));

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
            }
        };
    }, [url, auth]);

    return socketRef;
}