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
  metadataBase: new URL("https://rewangdesa.com"),
  title: {
    default: "Rewang Desa - Bantu Desa Tanpa Harus Pergi ke Desa",
    template: "%s | Rewang Desa",
  },
  description:
    "Bantu desa tanpa harus pergi ke desa. Rewang Desa menghubungkan hasil bumi, produk pangan alami, dan kerajinan tangan petani serta pengrajin desa langsung ke tangan Anda.",
  keywords: [
    "Rewang Desa",
    "produk desa",
    "hasil bumi desa",
    "garam jono",
    "kecap kelapa",
    "gula singkong",
    "beras merah",
    "kerajinan desa",
    "UMKM desa",
    "pangan sehat alami",
  ],
  alternates: {
    canonical: "/",
  },
  verification: {
    google: "3YCAq4rvwC8yz08onwfc_15bCvbiRhArTVBfgFf8o08",
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://rewangdesa.com",
    siteName: "Rewang Desa",
    title: "Rewang Desa - Bantu Desa Tanpa Harus Pergi ke Desa",
    description:
      "Menghubungkan hasil bumi, produk pangan alami, dan kerajinan tangan desa langsung ke meja Anda.",
    images: [
      {
        url: "/hero-background.webp",
        width: 1920,
        height: 1071,
        alt: "Gerai Rewang Desa - Bantu Desa Tanpa Harus Pergi ke Desa",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rewang Desa - Bantu Desa Tanpa Harus Pergi ke Desa",
    description:
      "Menghubungkan hasil bumi, produk pangan alami, dan kerajinan tangan desa langsung ke meja Anda.",
    images: ["/hero-background.webp"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
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


