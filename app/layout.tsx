import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { AppProviders } from "@/contexts/AppProviders";

export const metadata: Metadata = {
  title: "Truth or Trap - Interactive Story Game",
  description:
    "Game interactive storytelling multiplayer dengan chat real-time, voting, timer, leaderboard, dan multiple ending.",
  keywords: ["interactive storytelling", "multiplayer", "websocket", "game", "Indonesia"],
  authors: [{ name: "Truth or Trap Team" }],
  openGraph: {
    title: "Truth or Trap",
    description: "Ambil keputusan bersama dan tentukan ending cerita.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>
        <AppProviders>{children}</AppProviders>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#fffdf2",
              color: "#111111",
              border: "3px solid #111111",
              borderRadius: "8px",
              boxShadow: "4px 4px 0 #111111",
              fontWeight: 800,
            },
            success: { iconTheme: { primary: "#47d16c", secondary: "#111111" } },
            error: { iconTheme: { primary: "#ef2d56", secondary: "#111111" } },
          }}
        />
      </body>
    </html>
  );
}
