"use client";

import "./globals.css";
import { Inter } from "next/font/google";
import { PrivyProvider } from "@privy-io/react-auth";
import { AuthProvider } from "@/providers/AuthProvider";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <PrivyProvider
          appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ""}
          config={{
            loginMethods: ["email", "wallet"],
            appearance: {
              theme: "light",
              accentColor: "#3B82F6",
              logo: "https://your-logo-url.com/logo.png",
            },
            embeddedWallets: {
              createOnLogin: "users-without-wallets",
              noPromptOnSignature: false,
            },
          }}
        >
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </PrivyProvider>
      </body>
    </html>
  );
}

