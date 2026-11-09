# Homework 7: Exceptions and robust error handling

**Tingkat:** Medium to Hard

Delapan varian melatih penanganan error pada situasi yang berbeda. Semua varian memakai hierarki exception domain dan mewajibkan bug pemrograman tetap diteruskan. Bacalah aturan varianmu dengan teliti; nama class, kebijakan error, serta bentuk input berbeda antarvarian.

## Cakupan varian

| Varian | Domain | Fokus tambahan |
| :-- | :-- | :-- |
| 1 | Impor data nilai | Error per baris dengan nomor dan kolom, deteksi duplikat, mode ketat dan longgar |
| 2 | Transaksi koperasi | Context manager untuk rollback, transaksi beberapa langkah, `raise ... from ...` |
| 3 | Sinkronisasi presensi | Percobaan ulang untuk gangguan sementara, penolakan permanen, `raise` ulang |
| 4 | Pembaruan profil | Validasi agregat dalam satu exception dan perubahan semua-atau-tidak |
| 5 | Mesin tumpukan | Penerjemahan `IndexError`, `ZeroDivisionError`, dan `ValueError` tanpa mengubah tumpukan |
| 6 | Sesi cetak | Kunci yang selalu dilepas dan `__exit__()` yang hanya menekan satu jenis error |
| 7 | Peminjaman buku | Pemetaan hierarki exception ke kode keluar dan `from None` |
| 8 | Sensor cadangan | Fallback, `__cause__`, `__context__`, dan penelusuran rantai exception |

## Aturan pengerjaan

- Masukkan NIM dan kelas yang benar. NIM yang sama mendapat varian yang sama selama konfigurasi assignment tetap.
- Lengkapi TODO; jangan mengubah nama class, signature, class yang sudah lengkap, program utama, input resmi, label output, atau test case.
- Tangkap jenis exception yang spesifik atau base exception domain. Jangan memakai `except:` atau `except Exception` untuk menyembunyikan error.
- Simpan data penting pada attribute exception dan panggil `super().__init__()` dengan pesan sesuai spesifikasi.
- Gunakan `from error`, `from None`, atau `raise` tanpa argumen tepat seperti yang diminta varian. Program utama memeriksa `__cause__` dan `__context__`.
- Operasi yang ditolak harus meninggalkan state seperti sebelum operasi dimulai, kecuali varian menyatakan lain.
- Model dan service tidak mencetak; kembalikan nilai atau bangkitkan exception.
- Gunakan Python standard library saja. Tidak perlu memecah kode menjadi module/package.

## Cara menguji dan mengumpulkan

Gunakan **Run Tests** untuk menjalankan delapan kasus input-output. Tombol **Run** tidak otomatis mengisi `input()`. Traceback yang muncul saat TODO belum selesai adalah petunjuk; baca dari baris terakhir untuk menemukan jenis dan lokasi error.

Setelah test lulus, gunakan **Save File** dan ikuti instruksi pengumpulan serta tenggat yang diberikan pengajar. Editor ini tidak otomatis mengirim jawaban.

## Penjelasan yang harus dapat kamu berikan

1. Exception mana yang merupakan error domain, dan mana yang dianggap bug?
2. Di bagian mana error ditangkap, dan mengapa bagian tersebut yang paling tepat?
3. Untuk setiap `from`, apa penyebab yang disimpan dan mengapa penyebab itu berguna atau disembunyikan?
4. State apa yang dijamin tidak berubah ketika operasi gagal, dan bagaimana kodemu menjaminnya?
5. Apa yang terjadi jika urutan blok `except` dibalik?

Lulus test bukan bukti bahwa desain sudah benar seluruhnya. Pengajar juga meninjau jenis exception, cakupan blok `try`, serta konsistensi state setelah kegagalan.
