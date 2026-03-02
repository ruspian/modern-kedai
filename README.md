# 🏪 ModernKedai POS (Point of Sale)

Aplikasi kasir (Point of Sale) modern berbasis web. Dibangun menggunakan ekosistem Next.js terbaru untuk memberikan performa super cepat, manajemen state yang reaktif, dan keamanan data tingkat tinggi.

## 🚀 Fitur Utama

- **🛒 Terminal Kasir (POS) Interaktif:** Pencarian produk _real-time_, manajemen keranjang belanja, dan pemotongan stok otomatis menggunakan Prisma Transactions.
- **📊 Dashboard Analitik:** Pantau pendapatan, jumlah transaksi, dan peringatan stok menipis secara _real-time_.
- **📦 Manajemen Inventaris:** CRUD produk lengkap dengan kategori, harga modal, dan harga jual untuk perhitungan profit yang akurat.
- **👥 Pelacakan Pelanggan:** Pencatatan otomatis riwayat belanja pelanggan dan total transaksinya.
- **🔐 Role-Based Access Control (RBAC):** Pemisahan akses aman antara **ADMIN** (Pemilik) dan **STAFF** (Kasir) menggunakan Middleware di Edge Runtime.
- **📜 Riwayat Transaksi:** Catatan detail setiap nota, nama kasir yang bertugas, dan metode pembayaran (Cash/QRIS/Transfer).

## 🛠️ Tech Stack

- **Framework:** [Next.js 14/15](https://nextjs.org/)
- **Authentication:** [Auth.js / NextAuth v5](https://authjs.dev/)
- **Database ORM:** [Prisma](https://www.prisma.io/)
- **Database:** PostgreSQL
- **Styling:** Tailwind CSS
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/) & Lucide Icons

## ⚙️ Cara Instalasi & Menjalankan Lokal

Ikuti langkah-langkah di bawah ini untuk menjalankan aplikasi di komputermu:

### 1. Clone Repository

```bash
git clone https://github.com/ruspianm/modernkedai-pos.git
cd modernkedai-pos
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Buat file `.env` di _root folder_ dan masukkan konfigurasi database serta _secret key_ untuk autentikasi:

```env
# URL Koneksi PostgreSQL kamu
DATABASE_URL="postgresql://user:password@localhost:5432/modernkedai_db?schema=public"

# Generate secret key dengan perintah: npx auth secret
AUTH_SECRET="rahasia_negara_123_ganti_dengan_yang_aman"
```

### 4. Setup Database (Prisma)

Jalankan perintah ini untuk melakukan sinkronisasi skema database:

```bash
npx prisma db push
```

_(Opsional)_ Buka Prisma Studio untuk menambahkan data User awal (Admin/Staff) secara manual:

```bash
npx prisma studio
```

### 5. Jalankan Aplikasi

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browsermu.

## 🧪 Akun Testing (Contoh)

Jika kamu sudah membuat akun di database, gunakan kredensial berikut untuk menguji _Role-Based Access Control_:

- **Admin Account:** `admin@modernkedai.com` | Akses penuh ke seluruh fitur (Dashboard & Produk).
- **Staff Account:** `kasir@modernkedai.com` | Hanya akses ke halaman POS, Riwayat, dan Pelanggan.

## 👨‍💻 Author

Dibuat dengan ☕ dan ❤️ oleh **Ruspian Majid**.

- GitHub: [@ruspianm](https://github.com/ruspianm)

---

_Project ini terbuka untuk masukan dan pengembangan lebih lanjut. Silakan buat issue atau pull request!_
