import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Toaster } from "@/components/ui/toast";
import { ScrollToTop } from "@/components/layout/ScrollToTop";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "PropGroup - Smart Real Estate Investment Platform",
    template: "%s | PropGroup"
  },
  description: "Your gateway to international real estate investment opportunities with data-driven insights and expert guidance",
  keywords: ["real estate", "investment", "property", "international", "golden visa", "ROI", "portfolio"],
  authors: [{ name: "PropGroup" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://propgroup.com",
    title: "PropGroup - Smart Real Estate Investment Platform",
    description: "Your gateway to international real estate investment opportunities",
    siteName: "PropGroup",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "PropGroup",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PropGroup - Smart Real Estate Investment Platform",
    description: "Your gateway to international real estate investment opportunities",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${plusJakarta.variable}`}>
      <body className="font-plus-jakarta antialiased min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <AuthProvider>
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
          <ScrollToTop />
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
