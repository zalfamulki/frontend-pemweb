import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Truth or Trap — Fake News Detection Game",
  description:
    "Interactive multiplayer game where you detect fake news, discuss in realtime, and build your digital literacy. Can you tell Truth from Trap?",
  keywords: ["fake news", "game", "education", "digital literacy", "Indonesia"],
  authors: [{ name: "Truth or Trap Team" }],
  openGraph: {
    title: "Truth or Trap",
    description: "Can you detect fake news in realtime?",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className="bg-mesh">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#16161f",
              color: "#e8e8f0",
              border: "1px solid #ffffff20",
              borderRadius: "12px",
              fontSize: "0.875rem",
            },
            success: { iconTheme: { primary: "#00b894", secondary: "#16161f" } },
            error:   { iconTheme: { primary: "#e74c3c", secondary: "#16161f" } },
          }}
        />
      </body>
    </html>
  );
}
