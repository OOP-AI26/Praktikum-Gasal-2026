# Homework 8: File handling, CSV, JSON, dan object data

**Tingkat:** Medium

Delapan varian melatih penyimpanan dan pemuatan object melalui file dengan kebutuhan laporan berbeda. Semua varian mencakup pembacaan, penulisan, context manager, CSV, JSON, serialisasi sederhana, dan log append. Beberapa varian menambahkan pembaruan dari file kedua atau data bersarang.

## Cakupan varian

| Varian | Domain | Fokus tambahan |
| :-- | :-- | :-- |
| 1 | Arsip nilai praktikum | Komponen nilai asli pada JSON, nilai akhir dan status pada CSV |
| 2 | Pembaruan stok koperasi | JSON masukan dan perubahan stok berurutan dari CSV terpisah |
| 3 | Arsip peminjaman bersarang | Object Anggota di dalam Pinjaman dan ekspor satu baris per buku |
| 4 | Rekap presensi | Pengelompokan NIM, hitungan status, dan persentase integer |
| 5 | Buku kas kegiatan | Rekap kategori berdasarkan urutan kemunculan pertama |
| 6 | Daftar tugas persisten | Boolean JSON, pembaruan CSV, filter tugas aktif dan urutan prioritas |
| 7 | Peringkat omzet | Ekspor subtotal menurun dengan urutan stabil ketika nilainya sama |
| 8 | Riwayat sensor | List bacaan, data kosong, nilai negatif, dan ringkasan CSV |

## Aturan pengerjaan

- Masukkan NIM dan kelas yang benar. NIM yang sama memperoleh varian yang sama selama konfigurasi assignment tetap.
- Lengkapi TODO; jangan mengubah class/method yang sudah lengkap, signature, program utama, label output, atau test.
- Semua pembacaan/penulisan file memakai `with open(...)`, `encoding='utf-8'`, dan `newline=''` khusus CSV.
- Gunakan `csv.DictReader` dan `csv.writer`, bukan pemisahan manual berdasarkan koma.
- Gunakan `json.load()` dan `json.dump()` pada file. Object diserialisasikan melalui dictionary/list; jangan memakai `eval()`, `pickle`, atau library eksternal.
- Mode `w` mengganti arsip/laporan lama. Mode `a` hanya untuk log teks; JSON harus tetap satu dokumen valid.
- Pertahankan string kode/NIM, tipe angka dan boolean, Unicode, spasi, serta urutan yang ditentukan varian.
- File sumber tidak boleh berubah. Method ekspor/ringkasan tidak boleh mengubah object atau urutan data. Hanya method pembaruan yang diminta pada varian 2 dan 6 yang boleh mengubah attribute model.
- Data masukan dijamin valid. Tidak perlu GUI, database, custom exception/context manager, atau pemecahan package.

## Cara menguji dan mengumpulkan

Gunakan **Run Tests** untuk menjalankan delapan kasus input-output. Input resmi disediakan melalui stdin hanya agar program utama dapat membuat file masukan yang sebenarnya di folder sementara. TODO harus membaca/menulis file, bukan mengambil data langsung dari stdin. Kasus memeriksa data normal dan kosong, tipe data, Unicode, quoting CSV, penulisan ulang, log append, dan aturan khusus setiap varian.

Program memakai satu file source dengan Python 3.10+ dan standard library. Pada browser, file berada di filesystem Python browser; pada komputer, di folder sementara lokal. `TemporaryDirectory` membersihkan file data setelah run. **Run** tidak memasok input otomatis, dan **Save File** mengunduh source Python saja. Ikuti petunjuk pengajar untuk pengumpulan dan tenggat; editor tidak otomatis mengirim jawaban.

## Penjelasan yang harus dapat kamu berikan

1. Mengapa arsip/laporan memakai `w`, sedangkan log memakai `a`?
2. Kapan file ditutup oleh `with`, termasuk bila terjadi exception?
3. Mengapa CSV memerlukan parser dan mengapa kode/NIM tidak diubah menjadi integer?
4. Apa perbedaan object model, dictionary hasil serialisasi, dan teks JSON di disk?
5. Bagaimana object dimuat ulang dengan tipe dan urutan yang benar?
6. Bagaimana ekspor laporan menjaga data arsip asli, termasuk list atau object bersarang pada varian terkait?

Lulus test memeriksa perilaku yang terlihat. Pengajar juga meninjau penggunaan file asli, context manager, mode, dan pemisahan model dari operasi I/O.
