import type {Metadata} from "next";
import {Geist, Geist_Mono} from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Providers from "@/components/Providers";
import { Analytics } from "@vercel/analytics/react"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SKICTF - Capture The Flag Competition | Sekolah Kristen Immanuel",
  description:
    "SKICTF is a Capture the Flag event for the Sekolah Kristen Immanuel held by SMK Kristen Immanuel. Join us to test your cybersecurity skills and compete with other students.",
  keywords: [
    "CTF",
    "Capture The Flag",
    "Cybersecurity",
    "Competition",
    "Sekolah Kristen Immanuel",
    "SMK Kristen Immanuel",
    "SKICTF",
    "SKI CTF",
    "CTF SKI",
  ],
  authors: [{name: "SMK Kristen Immanuel"}],
  openGraph: {
    title: "SKICTF - Capture The Flag Competition | Sekolah Kristen Immanuel",
    description:
      "SKICTF is a Capture the Flag event for the Sekolah Kristen Immanuel held by SMK Kristen Immanuel. Join us to test your cybersecurity skills and compete with other students.",
    type: "website",
    locale: "en_US",
    url: "https://skictf.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "SKICTF - Capture The Flag Competition | Sekolah Kristen Immanuel",
    description:
      "SKICTF is a Capture the Flag event for the Sekolah Kristen Immanuel held by SMK Kristen Immanuel. Join us to test your cybersecurity skills and compete with other students.",
  },
  verification: {
    google: "verification_token",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <Navbar />
          {children}
          <Analytics />
        </Providers>
      </body>
    </html>
  );
}
