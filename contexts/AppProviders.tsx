"use client";

import { SocketProvider } from "./SocketContext";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return <SocketProvider>{children}</SocketProvider>;
}
