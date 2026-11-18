import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import "./global.css";
import { Great_Vibes, Plus_Jakarta_Sans } from "next/font/google";

export const metadata: Metadata = {
  title: "Pinecone coffee house",
  description: "Just a click away.",
};

const greatVibes = Great_Vibes({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-script",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${greatVibes.variable} ${jakarta.variable}`}>
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
