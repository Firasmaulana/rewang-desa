export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  rating: number;
  image: string;
  isDiscounted: boolean;
  description: string;
}

export const products: Product[] = [
  {
    id: '1',
    name: 'Gula Aren Cair Asli 1 Liter',
    category: 'Gula Aren',
    price: 45000,
    originalPrice: 50000,
    rating: 4.8,
    image: '[Gambar Gula Aren Cair]',
    isDiscounted: true,
    description: 'Gula aren cair murni tanpa pengawet buatan, diproses langsung dari nira aren pilihan petani lokal. Sangat cocok untuk kopi susu, cendol, dan berbagai pemanis kue.',
  },
  {
    id: '2',
    name: 'Beras Merah Organik Pulen 2kg',
    category: 'Beras Merah',
    price: 35000,
    rating: 4.9,
    image: '[Gambar Beras Merah]',
    isDiscounted: false,
    description: 'Beras merah organik hasil panen desa yang ditanam tanpa pestisida kimia. Lebih pulen, kaya serat, dan sangat baik untuk diet serta menjaga kadar gula darah.',
  },
  {
    id: '3',
    name: 'Gula Kelapa Cetak (Batok) 1kg',
    category: 'Gula Kelapa',
    price: 22000,
    rating: 4.5,
    image: '[Gambar Gula Kelapa Cetak]',
    isDiscounted: false,
    description: 'Gula kelapa cetak tradisional dengan wangi karamel yang khas. Kualitas ekspor, tekstur kokoh namun mudah diiris.',
  },
  {
    id: '4',
    name: 'Jahe Merah Bubuk Murni 250g',
    category: 'Rempah Tradisional',
    price: 30000,
    originalPrice: 35000,
    rating: 4.7,
    image: '[Gambar Jahe Merah]',
    isDiscounted: true,
    description: 'Jahe merah bubuk murni tanpa campuran gula. Menghangatkan badan, meningkatkan imunitas, dan bisa diseduh langsung atau dicampur dengan minuman lain.',
  },
  {
    id: '5',
    name: 'Gula Semut Aren 500g',
    category: 'Gula Aren',
    price: 25000,
    rating: 4.6,
    image: '[Gambar Gula Semut Aren]',
    isDiscounted: false,
    description: 'Gula aren versi kristal (semut) yang lebih praktis untuk diseduh. Mudah larut dan takarannya lebih mudah diatur.',
  },
  {
    id: '6',
    name: 'Kunyit Putih Bubuk 200g',
    category: 'Rempah Tradisional',
    price: 20000,
    rating: 4.4,
    image: '[Gambar Kunyit Putih]',
    isDiscounted: false,
    description: 'Kunyit putih segar yang dikeringkan dan digiling halus. Berkhasiat untuk membantu mengatasi masalah pencernaan dan inflamasi.',
  },
  {
    id: '7',
    name: 'Gula Kelapa Bubuk 500g',
    category: 'Gula Kelapa',
    price: 24000,
    rating: 4.7,
    image: '[Gambar Gula Kelapa Bubuk]',
    isDiscounted: false,
    description: 'Gula kelapa organik dalam bentuk bubuk halus. Alternatif pemanis sehat dengan indeks glikemik rendah untuk penderita diabetes.',
  },
  {
    id: '8',
    name: 'Beras Hitam Organik 1kg',
    category: 'Beras Merah', // Grouped in Beras
    price: 28000,
    originalPrice: 32000,
    rating: 4.9,
    image: '[Gambar Beras Hitam]',
    isDiscounted: true,
    description: 'Beras hitam organik, superfood lokal dengan kandungan antioksidan (antosianin) tertinggi dibandingkan jenis beras lainnya.',
  }
];

