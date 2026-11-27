const STORE_INFO = {
  name: "Katalog Jajanan & Produk",
  tagline: "Pilih produk favoritmu, tentukan varian, dan kirim pesanan langsung lewat WhatsApp.",
  whatsappNumber: "6281222729155",
};

const PRODUCTS = [
  {
    id: "PRD-01",
    name: "Sistik Gurih",
    category: "Snack",
    unit: "Pouch",
    description: "Camilan sistik renyah dan gurih yang pas buat teman santai atau stok camilan harian di rumah.",
    image: "https://images.unsplash.com/photo-1599490659213-e2b9527bd087?auto=format&fit=crop&w=800&q=80",
    variants: [
      { id: "V1", label: "Original (200gr)", price: 10000, stock: 15 },
      { id: "V2", label: "Pedas Daun Jeruk (200gr)", price: 12000, stock: 10 },
    ],
  },
  {
    id: "PRD-02",
    name: "Kerupuk Seblak",
    category: "Snack",
    unit: "Pouch 150gr",
    description: "Kerupuk seblak dengan aroma kencur dan bumbu cabai yang nendang, tetap renyah saat disantap.",
    image: "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?auto=format&fit=crop&w=800&q=80",
    variants: [
      { id: "V1", label: "Pedas Sedang", price: 7000, stock: 20 },
      { id: "V2", label: "Ekstra Pedas", price: 8000, stock: 12 },
    ],
  },
  {
    id: "PRD-03",
    name: "Sushi Roll",
    category: "Makanan",
    unit: "Box",
    description: "Sushi gulung dibuat segar sesuai pesanan dengan nasi pulen, isian pilihan, dan saus pendamping.",
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=80",
    variants: [
      { id: "V1", label: "Tamago (Isi 6 pcs)", price: 15000, stock: 8 },
      { id: "V2", label: "Tamago (Isi 12 pcs)", price: 28000, stock: 5 },
      { id: "V3", label: "Samyang Roll (Isi 8 pcs)", price: 22000, stock: 6 },
    ],
  },
  {
    id: "PRD-04",
    name: "Gantungan Kunci Rajut",
    category: "Craft",
    unit: "1 Pcs",
    description: "Handmade crochet dari benang katun lembut, cocok untuk hiasan tas, pouch, atau kado kecil.",
    image: "https://images.unsplash.com/photo-1615486511484-92e172cc4fe0?auto=format&fit=crop&w=800&q=80",
    variants: [
      { id: "V1", label: "Bunga Daisy", price: 12000, stock: 7 },
      { id: "V2", label: "Karakter Mini", price: 18000, stock: 4 },
    ],
  },
];