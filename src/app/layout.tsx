import type { Metadata } from "next";
import { Tenor_Sans, Poppins } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const tenorSans = Tenor_Sans({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const mistrully = localFont({
  src: "../../public/fonts/Mistrully.ttf",
  variable: "--font-mistrully",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Rewang Desa - Dari Tangan Desa",
  description: "Menghubungkan hasil bumi, produk lokal, dan cerita dari desa langsung ke tangan Anda.",
  icons: {
    icon: [
      { url: "/icon.png", type: "image/png" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${tenorSans.variable} ${poppins.variable} ${mistrully.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-body bg-[#fffaf5] text-[#33241b]">
        {children}
      </body>
    </html>
  );
}


