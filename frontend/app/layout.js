import { Geist, Geist_Mono } from "next/font/google";
import { Great_Vibes, Playfair_Display } from "next/font/google"
import "./globals.css";
import { AuthProvider } from "../context/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
// const greatVibes = Great_Vibes({ subsets: ["latin"], weight: "400" });
// const playfair = Playfair_Display({ subsets: ["latin"], weight: "400", style: "italic" });

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Food Donation App",
  description: "A platform to facilitate food donations to those in need.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        
        <AuthProvider>
        {children}
        </AuthProvider>
      </body>
    </html>
  );
}
