import {ClerkProvider} from "@clerk/nextjs";
import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Montserrat, DM_Sans, Plus_Jakarta_Sans, Poppins, Inter } from "next/font/google";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-montserrat",
})

const dmSans = DM_Sans({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dmSans",
})

const plusJakartaSans = Plus_Jakarta_Sans({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-plusJakartaSans",
})

const poppins = Poppins({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
})

const inter = Inter({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false, // Prevents accidental page zooming inside the app container
};

export const metadata: Metadata = {
  title: "Rentrospect",
  description: "Rent Smarter. Track Better. Earn More.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Rentrospect",
  },
  icons: {
    apple: "/apple-touch-icon.png",
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
      className={`${geistSans.variable} ${geistMono.variable} ${dmSans.variable} ${plusJakartaSans.variable} ${poppins.variable} ${inter.variable} h-full antialiased bg-nearWhiteBg`}
    >
      <body className={`min-h-full flex flex-col ${montserrat.variable} bg-nearWhiteBg`}>
        <ServiceWorkerRegister />
        <ClerkProvider>
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}