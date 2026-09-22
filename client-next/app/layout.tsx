import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientLayout from "./ClientLayout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "https://codewithshivank.dev");

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Shivank Maurya — Full Stack Software Engineer",
    template: "%s | Shivank Maurya",
  },
  description:
    "Shivank Maurya is a Full Stack Software Engineer specializing in MERN stack (MongoDB, Express, React, Node.js), Firebase Authentication, and Cloud Firestore.",
  keywords: [
    "Shivank Maurya",
    "Full Stack Developer",
    "MERN Stack Developer",
    "React Developer",
    "Node.js Developer",
    "Software Engineer Portfolio",
  ],
  authors: [{ name: "Shivank Maurya", url: baseUrl }],
  creator: "Shivank Maurya",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: baseUrl,
    title: "Shivank Maurya — Full Stack Software Engineer",
    description:
      "Full Stack Software Engineer specializing in MERN stack, Firebase Authentication, and scalable web architecture.",
    siteName: "Shivank Maurya Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shivank Maurya — Full Stack Software Engineer",
    description:
      "Full Stack Software Engineer specializing in MERN stack, Firebase Authentication, and scalable web architecture.",
    creator: "@codewithshivank",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
