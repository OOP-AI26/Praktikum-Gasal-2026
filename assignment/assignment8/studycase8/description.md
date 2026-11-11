# Live Practicum 8: File handling dan serialisasi object

**Tingkat:** Easy to Medium

Ketiga kelas mengerjakan domain berbeda dengan struktur dan beban yang sama. Baca CSV menjadi object, simpan representasinya ke JSON, muat kembali sebagai object baru, lalu ekspor CSV dan tambahkan log teks. Pembacaan stdin, pembuatan folder sementara, serta pemeriksaan hasil sudah disediakan.

## Tujuan pembelajaran

- Memilih mode `r`, `w`, dan `a` sesuai tujuan pembacaan atau penulisan.
- Menggunakan `with open(...)` agar file ditutup saat blok selesai.
- Membaca dan menulis CSV dengan module `csv`, termasuk field berisi koma atau tanda kutip.
- Mengubah object menjadi dictionary/list yang dapat disimpan dengan `json.dump()`.
- Membangun instance model baru setelah membaca dictionary/list dengan `json.load()`.
- Menjaga tipe integer, kode dengan nol di depan, urutan data, serta teks Unicode.

## Pembagian kelas

| Kelas | Varian | Data numerik |
| :-- | :-- | :-- |
| 2025A | Inventaris Alat Laboratorium | Jumlah alat |
| 2025B | Koleksi Buku Pojok Baca | Jumlah eksemplar |
| 2025C | Pendaftaran Workshop Kampus | Jumlah peserta |

## Cara mengerjakan

1. Pilih kelasmu dan baca kontrak pada varian sampai selesai.
2. Lengkapi seluruh TODO tanpa mengubah signature atau program utama.
3. Gunakan **Run Tests** untuk memasok delapan input resmi secara otomatis. **Run** tidak memasok `input()`.
4. Setelah test lulus, gunakan **Save File** lalu ikuti petunjuk pengumpulan pengajar.

Semua operasi file wajib memakai `with open(...)` dan `encoding='utf-8'`. Khusus CSV, tambahkan `newline=''` dan gunakan `csv.DictReader`/`csv.writer`; jangan memisahkan CSV dengan `split(',')`. Data dan file masukan valid. Tidak perlu membuat exception atau context manager sendiri, menggunakan database, maupun menyusun package.

## Checklist sebelum mengumpulkan

- CSV kosong dengan header menghasilkan list object kosong dan ekspor yang tetap memiliki header.
- JSON berisi representasi data dasar; hasil muat ulang berisi instance model, bukan dictionary mentah.
- Penulisan ulang JSON/CSV mengganti seluruh isi lama; log justru mempertahankan baris sebelumnya.
- Koma, tanda kutip, spasi, Unicode, serta nol di depan kode tetap terjaga.
- File sumber tidak berubah dan semua handle file ditutup oleh context manager.

File hasil latihan berada dalam folder sementara yang dibersihkan setelah run. **Save File** menyimpan source Python, bukan arsip data. Lulus test tidak otomatis mengirim jawaban atau mencatat presensi; penggunaan context manager dan pemilihan mode tetap ditinjau melalui kode.
