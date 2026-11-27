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
  applicationName: "Rewang Desa",
  authors: [{ name: "Rewang Desa", url: "https://rewangdesa.com" }],
  creator: "Rewang Desa",
  publisher: "Rewang Desa",
  title: {
    default: "Rewang Desa - Bantu Desa Tanpa Harus Pergi ke Desa",
    template: "%s | Rewang Desa",
  },
  description:
    "Bantu desa tanpa harus pergi ke desa. Rewang Desa menghubungkan hasil bumi, produk pangan alami tanpa pengawet (Garam Jono Grobogan, Beras Merah Jampang, Kecap Kelapa, Gula Singkong, Madu Randu), dan kerajinan tangan petani serta UMKM desa langsung ke rumah Anda.",
  keywords: [
    "Rewang Desa",
    "rewangdesa",
    "bantu desa tanpa harus pergi ke desa",
    "produk desa alami",
    "hasil bumi desa",
    "garam jono grobogan",
    "kecap kelapa alami",
    "gula singkong manes",
    "beras merah jampang",
    "madu randu blitar",
    "keripik tempe banyumas",
    "kalehon drink honje",
    "kerajinan desa",
    "UMKM desa Indonesia",
    "pangan sehat alami tanpa pengawet",
    "belanja produk petani lokal",
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
      "Menghubungkan hasil bumi, produk pangan alami tanpa pengawet, dan kerajinan tangan petani serta UMKM desa langsung ke meja Anda.",
    images: [
      {
        url: "/hero-background.webp",
        width: 1920,
        height: 1071,
        alt: "Gerai Rewang Desa - Bantu Desa Tanpa Harus Pergi ke Desa",
      },
      {
        url: "/logo-google.png",
        width: 512,
        height: 512,
        alt: "Logo Rewang Desa - Dari Tangan Desa",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rewang Desa - Bantu Desa Tanpa Harus Pergi ke Desa",
    description:
      "Menghubungkan hasil bumi, produk pangan alami tanpa pengawet, dan kerajinan tangan petani serta UMKM desa langsung ke meja Anda.",
    images: ["/hero-background.webp"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon-48x48.png", sizes: "48x48", type: "image/png" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/favicon-144x144.png", sizes: "144x144", type: "image/png" },
      { url: "/favicon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/favicon.ico", sizes: "48x48" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

const siteJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["Organization", "OnlineStore"],
      "@id": "https://rewangdesa.com/#organization",
      name: "Rewang Desa",
      alternateName: [
        "Rewang Desa - Dari Tangan Desa",
        "Rewang Desa Indonesia",
        "rewangdesa.com",
      ],
      url: "https://rewangdesa.com",
      logo: {
        "@type": "ImageObject",
        "@id": "https://rewangdesa.com/#logo",
        url: "https://rewangdesa.com/logo-google.png",
        contentUrl: "https://rewangdesa.com/logo-google.png",
        width: 512,
        height: 512,
        caption: "Logo Rewang Desa - Dari Tangan Desa",
      },
      image: [
        "https://rewangdesa.com/logo-google.png",
        "https://rewangdesa.com/hero-background.webp",
      ],
      description:
        "Rewang Desa adalah toko dan platform pemberdayaan pangan lokal Indonesia dengan misi 'Bantu Desa Tanpa Harus Pergi ke Desa'. Menghubungkan hasil bumi alami tanpa pengawet dan kerajinan tangan petani serta UMKM sepuh dari Desa Jampang Sukabumi, Grobogan, Banyumas, Banjarnegara, Gunungkidul, hingga Blitar langsung ke konsumen.",
      email: "halo@rewangdesa.com",
      telephone: "+62-813-1753-3522",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Pondok Kelapa, Duren Sawit",
        addressLocality: "Jakarta Timur",
        addressRegion: "DKI Jakarta",
        addressCountry: "ID",
      },
      areaServed: {
        "@type": "Country",
        name: "Indonesia",
      },
      sameAs: [
        "https://instagram.com/rewangdesa",
        "https://instagram.com/rewang_desa",
      ],
      contactPoint: [
        {
          "@type": "ContactPoint",
          telephone: "+62-813-1753-3522",
          contactType: "customer service",
          areaServed: "ID",
          availableLanguage: ["Indonesian"],
        },
      ],
      knowsAbout: [
        "Produk pangan sehat alami Indonesia",
        "Hasil bumi petani desa",
        "Garam Jono Grobogan",
        "Beras Merah dan Beras Hitam Jampang",
        "Kecap Kelapa tanpa pengawet",
        "Gula Singkong dan Gula Aren",
        "Pemberdayaan UMKM desa dan petani lokal",
      ],
    },
    {
      "@type": "WebSite",
      "@id": "https://rewangdesa.com/#website",
      url: "https://rewangdesa.com/",
      name: "Rewang Desa",
      alternateName: [
        "Rewang Desa - Bantu Desa Tanpa Harus Pergi ke Desa",
        "rewangdesa.com",
      ],
      description:
        "Bantu desa tanpa harus pergi ke desa. Belanja hasil bumi, pangan alami, dan kerajinan tangan langsung dari petani desa Indonesia.",
      inLanguage: "id-ID",
      publisher: {
        "@id": "https://rewangdesa.com/#organization",
      },
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: "https://rewangdesa.com/shop?search={search_term_string}",
        },
        "query-input": "required name=search_term_string",
      },
    },
  ],
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
