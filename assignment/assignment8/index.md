---
title: Assignment 8
layout: default
parent: Assignment
nav_order: 9
has_children: true
---

# Assignment 8

**File handling, CSV, JSON, dan serialisasi object:** [Live Practicum 8]({{ '/assignment/assignment8/studycase8/' | relative_url }}) (in-class) dan [Homework 8]({{ '/assignment/assignment8/homework/' | relative_url }}) (take-home).

Simpan data dari object ke file dan bangun kembali object saat file dibaca. Fokus latihan: `open()`, read/write, mode `r`/`w`/`a`, context manager `with`, CSV, JSON, serta serialisasi sederhana menggunakan dictionary dan list. Seluruh varian memakai file asli, Python standard library, dan satu file source Python.

- Live practicum menyediakan tiga varian setara untuk kelas 2025A, 2025B, dan 2025C.
- Homework menyediakan delapan varian berdasarkan NIM, dengan pengolahan file dan kebutuhan laporan yang berbeda.
- Setiap varian memiliki spesifikasi, starter code dengan TODO, contoh input-output, serta delapan test case resmi.

## Persiapan singkat

| Keperluan | Pola yang digunakan |
| :-- | :-- |
| Membaca teks | `with open(path, 'r', encoding='utf-8') as file:` lalu `file.read()` |
| Mengganti seluruh isi | Mode `'w'`; file lama dipotong saat dibuka |
| Menambah catatan | Mode `'a'`; `file.write(pesan + '\n')` menambahkan baris |
| Membaca CSV | `csv.DictReader(file)`; nilai kolom awalnya string |
| Menulis CSV | `csv.writer(file)` lalu `writerow(...)`; selalu sertakan header |
| Menangani newline CSV | `newline=''` pada `open()` untuk membaca dan menulis CSV |
| Menyimpan JSON | `json.dump(data, file, ensure_ascii=False, indent=2)` |
| Membaca JSON | `data = json.load(file)` |
| Menghubungkan object dan file | `ke_dict()` untuk serialisasi, `dari_dict()` untuk membentuk instance baru |

`with` menutup file ketika blok selesai, termasuk ketika terjadi exception. Mode `w` mengganti isi file, sedangkan `a` mempertahankan isi lama; jangan menambahkan beberapa dokumen JSON berurutan ke satu file dengan `json.dump()` karena hasilnya bukan satu dokumen JSON yang valid. `json.load()` menghasilkan dictionary/list dan nilai dasar, sehingga object model harus dibangun kembali secara eksplisit.

## Menjalankan latihan

Pilih kelas atau masukkan NIM dan kelas, lalu gunakan **Run Tests**. Program utama yang tersedia mengubah input resmi menjadi file di `TemporaryDirectory`, menjalankan kode yang kamu lengkapi, dan membaca kembali hasilnya. Pada website, file berada di filesystem Python dalam browser; pada komputer, file berada di folder sementara lokal. Tidak perlu upload file atau memasang library tambahan. Data sementara dibersihkan setelah run selesai.

Tombol **Run** tidak memasok `input()` secara otomatis. **Save File** mengunduh source Python; editor tidak mengirim tugas atau mencatat presensi. Untuk mencoba file unduhan di komputer, gunakan Python 3.10+ dan jalankan `python jawaban.py`, lalu masukkan salah satu contoh input.

## Jadwal pembukaan

Tanggal dan jam pembukaan disamakan dengan Assignment 7.

| Kelas | Live Practicum 8 | Homework 8 |
| :-- | :-- | :-- |
| 2025C | 11 November 2026, 09.30 WIB | 11 November 2026, 11.10 WIB |
| 2025A | 11 November 2026, 13.00 WIB | 11 November 2026, 14.40 WIB |
| 2025B | 13 November 2026, 13.00 WIB | 13 November 2026, 14.40 WIB |

Live dibuka saat kelas dimulai dan homework setelah kelas selesai. Tenggat pengumpulan dan ketentuan presensi mengikuti arahan pengajar; lulus test di editor tidak otomatis mencatat kehadiran atau mengirim tugas.
