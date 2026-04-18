import type { Metadata } from "next";
import { Syne, DM_Sans } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";

const syne = Syne({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const dmSans = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

export const metadata: Metadata = {
  title: "IoT4ALL ISSATM",
  description: "Futuristic portal for the IoT4ALL ISSATM Club",
  icons: {
    icon: [
      {
        url: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><defs><radialGradient id='grad' cx='50%' cy='50%'><stop offset='0%' style='stop-color:%23C8F135;stop-opacity:1' /><stop offset='100%' style='stop-color:%2390C525;stop-opacity:1' /></radialGradient></defs><rect fill='%23000000' width='100' height='100'/><circle cx='50' cy='50' r='48' fill='url(%23grad)'/><circle cx='50' cy='50' r='40' fill='%23000000'/><circle cx='50' cy='50' r='36' fill='none' stroke='%23C8F135' stroke-width='2'/><circle cx='50' cy='50' r='26' fill='none' stroke='%23C8F135' stroke-width='1.5'/><rect x='43' y='22' width='14' height='12' fill='%23C8F135' rx='2'/><rect x='43' y='66' width='14' height='12' fill='%23C8F135' rx='2'/><rect x='22' y='43' width='12' height='14' fill='%23C8F135' rx='2'/><rect x='66' y='43' width='12' height='14' fill='%23C8F135' rx='2'/><circle cx='50' cy='50' r='7' fill='%23C8F135'/></svg>",
        type: "image/svg+xml",
      },
    ],
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
      suppressHydrationWarning
      className={`${syne.variable} ${dmSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col grain font-body transition-colors">
        <ThemeProvider attribute="class" defaultTheme="dark" disableTransitionOnChange={false}>
          <AuthProvider>
            <Navbar />
            <div className="flex-1 w-full flex flex-col relative z-10 pt-24">
              {children}
            </div>
            <Footer />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
