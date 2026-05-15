"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Socket } from "socket.io-client";
import { initSocket } from "@/lib/socket";
import { useAuthStore } from "@/lib/store";

type SocketContextValue = {
  socket: Socket | null;
  connected: boolean;
};

const SocketContext = createContext<SocketContextValue>({ socket: null, connected: false });

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const { token, isAuthenticated } = useAuthStore();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const authToken = token || (typeof window !== "undefined" ? localStorage.getItem("tot_token") : null);
    if (!isAuthenticated || !authToken) {
      queueMicrotask(() => {
        setSocket(null);
        setConnected(false);
      });
      return;
    }

    const nextSocket = initSocket(authToken);
    queueMicrotask(() => {
      setSocket(nextSocket);
      setConnected(nextSocket.connected);
    });

    const handleConnect = () => setConnected(true);
    const handleDisconnect = () => setConnected(false);
    nextSocket.on("connect", handleConnect);
    nextSocket.on("disconnect", handleDisconnect);

    return () => {
      nextSocket.off("connect", handleConnect);
      nextSocket.off("disconnect", handleDisconnect);
    };
  }, [isAuthenticated, token]);

  const value = useMemo(() => ({ socket, connected }), [socket, connected]);

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
}

export function useSocket() {
  return useContext(SocketContext);
}
