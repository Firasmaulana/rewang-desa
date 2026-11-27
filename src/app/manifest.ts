import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Rewang Desa - Bantu Desa Tanpa Harus Pergi ke Desa",
    short_name: "Rewang Desa",
    description:
      "Menghubungkan hasil bumi, produk pangan alami tanpa pengawet, dan kerajinan tangan petani serta pengrajin desa langsung ke tangan Anda.",
    start_url: "/",
    display: "standalone",
    background_color: "#fffaf5",
    theme_color: "#8a5225",
    lang: "id",
    icons: [
      {
        src: "/favicon-48x48.png",
        sizes: "48x48",
        type: "image/png",
      },
      {
        src: "/favicon-96x96.png",
        sizes: "96x96",
        type: "image/png",
      },
      {
        src: "/favicon-144x144.png",
        sizes: "144x144",
        type: "image/png",
      },
      {
        src: "/favicon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/logo-google.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
