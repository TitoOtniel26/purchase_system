# Purchase Management System

Aplikasi web untuk mengelola data produk, stok, dan transaksi pembelian. Project ini dibangun menggunakan Node.js, Express.js, EJS, dan MySQL dengan pendekatan arsitektur MVC agar struktur kode lebih mudah dipelihara dan dikembangkan.

## Fitur Utama

* Dashboard dengan ringkasan data produk, stok, dan pembelian.
* Manajemen produk (tambah, ubah, lihat, dan hapus produk).
* Manajemen transaksi pembelian.
* Update stok otomatis saat pembelian dibuat atau dibatalkan.
* Logging aktivitas dan error menggunakan Winston.
* Validasi input dan penerapan basic security middleware.

## Teknologi yang Digunakan

### Backend

* Node.js
* Express.js
* MySQL2
* Winston

### Frontend

* EJS
* CSS3
* Font Awesome

### Tools & Security

* Dotenv
* Helmet
* CORS
* Method Override
* Express Validator

## Struktur Database

Project ini menggunakan MySQL sebagai database utama.

Terdapat dua file database pada folder `database/`:

* `schema.sql` → Berisi struktur tabel dan relasi database.
* `seeds.sql` → Berisi data sample untuk kebutuhan testing dan development.

### Tabel Utama

#### Products

Menyimpan informasi produk seperti nama, harga, dan kategori.

#### Stock

Menyimpan jumlah stok setiap produk.

#### Purchases

Menyimpan data transaksi pembelian beserta status transaksi.

## Struktur Project

```text
purchase-system/
├── config/
├── controllers/
├── models/
├── services/
├── routes/
├── middleware/
├── views/
├── public/
├── utils/
├── database/
│   ├── schema.sql
│   └── seeds.sql
├── logs/
├── app.js
├── server.js
├── package.json
└── README.md
```

## Instalasi

### 1. Clone Repository

```bash
git clone <repository-url>
cd purchase-system
```

### 2. Install Dependency

```bash
npm install
```

### 3. Setup Database

Buat database baru:

```sql
CREATE DATABASE purchase_system;
```

Import struktur database:

```bash
mysql -u root -p purchase_system < database/schema.sql
```

(Optional) Import data sample:

```bash
mysql -u root -p purchase_system < database/seeds.sql
```

### 4. Konfigurasi Environment

Buat file `.env`:

```env
PORT=3000

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=purchase_system
```

### 5. Jalankan Aplikasi

```bash
npm run dev
```

atau

```bash
npm start
```

Aplikasi akan berjalan pada:

```text
http://localhost:3000
```

## Modul Aplikasi

### Dashboard

Menampilkan ringkasan data dan aktivitas pembelian terbaru.

### Produk

Digunakan untuk mengelola data produk beserta informasi harga dan kategori.

### Pembelian

Digunakan untuk mencatat transaksi pembelian dan mengelola perubahan stok.

## Alur Pembelian

1. Admin memilih produk.
2. Admin mengisi jumlah pembelian.
3. Sistem menghitung total harga.
4. Data pembelian disimpan.
5. Stok produk diperbarui secara otomatis.

## API Endpoint

| Method | Endpoint              |
| ------ | --------------------- |
| GET    | /products             |
| POST   | /products             |
| GET    | /products/:id         |
| POST   | /products/update/:id  |
| POST   | /products/delete/:id  |
| GET    | /purchases            |
| POST   | /purchases            |
| PUT    | /purchases/:id/cancel |

## Keamanan

Beberapa langkah keamanan yang diterapkan:

* Parameterized Query untuk mengurangi risiko SQL Injection.
* Input Validation menggunakan Express Validator.
* Security Header menggunakan Helmet.
* Konfigurasi sensitif disimpan pada file `.env`.

## Pengembangan Selanjutnya

Beberapa pengembangan yang dapat ditambahkan:

* Authentication dan Authorization.
* Export laporan ke Excel atau PDF.
* Dashboard analitik yang lebih detail.
* Notifikasi stok minimum.

## Developer

**Tito Otniel**
Full Stack Developer

* Email: [titootniel26@gmail.com](mailto:titootniel26@gmail.com)
* Telepon: +62 857 4264 5203

---

© 2026 Purchase Management System
