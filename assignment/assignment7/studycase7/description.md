# Live Practicum 7: Exceptions and robust error handling

**Tingkat:** Easy to Medium

Ketiga kelas mengerjakan domain berbeda dengan struktur dan beban pengerjaan yang sama: object dengan batas bawah dan batas atas, wadah yang mencari object berdasarkan kode, operasi pemindahan antarobject, serta pemroses perintah teks yang dapat rusak. Pembacaan input, dispatch perintah, dan program utama sudah disediakan agar fokus pengerjaan berada pada penanganan exception.

## Tujuan pembelajaran

- Melengkapi custom exception yang menyimpan data penting sebagai attribute dan memanggil `super().__init__()`.
- Membangkitkan exception ketika operasi melanggar aturan, dengan validasi sebelum perubahan state.
- Menerjemahkan `KeyError` dan `ValueError` menjadi error domain menggunakan `raise ... from ...`.
- Melakukan rollback pada operasi dua langkah, lalu meneruskan exception yang sama dengan `raise`.
- Menggunakan `try`/`except`/`else`/`finally` per baris tanpa menelan bug pemrograman.

## Cara mengerjakan

1. Pilih kelas 2025A, 2025B, atau 2025C sesuai kelasmu.
2. Baca spesifikasi, format input, dan program utama sampai selesai.
3. Lengkapi bagian `TODO`. Jangan mengubah class yang sudah lengkap, `proses_baris()`, atau program utama.
4. Gunakan **Run Tests** untuk memasok input resmi secara otomatis. Tombol **Run** menjalankan kode apa adanya dan tidak menyediakan input untuk `input()`.
5. Setelah seluruh test lulus, unduh file melalui **Save File** dan ikuti instruksi pengumpulan/presensi dari pengajar.

## Aturan desain

- Tangkap base exception domain, bukan `Exception`. Bug seperti `AttributeError` harus tetap terlihat.
- Operasi yang ditolak tidak boleh mengubah state. Periksa aturan sebelum mengubah nilai.
- Gunakan EAFP dan `from error` saat mencari kode di dictionary; jangan menggantinya dengan pemeriksaan `in` saja.
- Pemindahan mencari kedua object terlebih dahulu. Jika langkah kedua gagal, kembalikan langkah pertama lalu gunakan `raise` tanpa argumen.
- Jangan mencetak dari model atau wadah. Hanya program utama yang mencetak.
- Gunakan Python standard library saja.

## Checklist sebelum mengumpulkan

- Apakah setiap baris perintah menghasilkan tepat satu log, baik berhasil maupun gagal?
- Apakah jumlah yang bukan bilangan bulat memiliki cause `ValueError`, sedangkan nol atau negatif tidak memiliki cause?
- Apakah kode yang tidak terdaftar memiliki cause `KeyError`?
- Apakah pemindahan yang gagal di tujuan mengembalikan nilai asal seperti semula?
- Apakah `finally` tetap menghitung baris yang menimbulkan bug, sementara bug tersebut diteruskan?

Test otomatis memeriksa perilaku. Pengajar tetap meninjau pemilihan jenis exception, lokasi penanganan error, serta konsistensi state pada kode.
