---
title: Assignment 6
layout: default
parent: Assignment
nav_order: 7
has_children: true
---

# Assignment 6

**Chapter 8 - Modular programming, packages, and maintainable project structure:** [Live Practicum 6]({{ '/assignment/assignment6/studycase6/' | relative_url }}) (in-class) dan [Homework 6]({{ '/assignment/assignment6/homework/' | relative_url }}) (take-home).

Bangun package Python yang memisahkan model data, aturan perhitungan, service, formatter, dan CLI. Lengkapi relative import, public API, serta entry point agar kode dapat diimpor tanpa menjalankan aplikasi dan dapat dijalankan melalui `python -m nama_package`.

- Live practicum menyediakan tiga study case, satu untuk setiap kelas: 2025A, 2025B, dan 2025C.
- Homework menyediakan delapan varian yang dipilih secara konsisten berdasarkan NIM.
- Setiap varian memiliki spesifikasi, starter code dengan TODO, dan delapan test case resmi.

Pelajari [Chapter 8]({{ '/readings-chapter8/' | relative_url }}) dan [Quick Review 8]({{ '/quickreview/quickreview8/' | relative_url }}) sebelum mengerjakan.

## Proyek beberapa file di editor browser

Editor menerima satu file Python. Karena tugas ini melatih package dengan beberapa module, starter menyimpan isi setiap file dalam dictionary `FILES`. Lengkapi TODO **di dalam string isi file**. Harness yang disediakan akan membuat package sebenarnya di filesystem sementara dan memeriksa import, service, serta kedua entry point.

Setelah selesai, unduh bundle melalui **Save File**, lalu jalankan `python jawaban.py --export folder_baru`. Folder hasil ekspor berisi package, README, contoh input/output, `.gitignore`, dan tiga unit test. Jalankan perintah tersebut dari terminal di komputer, dengan nama file unduhanmu sebagai pengganti `jawaban.py`.

## Jadwal pembukaan

| Kelas | Live Practicum 6 | Homework 6 |
| :-- | :-- | :-- |
| 2025C | 4 November 2026, 09.30 WIB | 4 November 2026, 11.10 WIB |
| 2025A | 4 November 2026, 13.00 WIB | 4 November 2026, 14.40 WIB |
| 2025B | 6 November 2026, 13.00 WIB | 6 November 2026, 14.40 WIB |

Live dibuka saat kelas dimulai dan homework setelah kelas selesai, mengikuti Week 10. Jadwal pengumpulan dan ketentuan presensi mengikuti arahan pengajar; lulus test tidak otomatis mencatat kehadiran atau mengirim tugas.
