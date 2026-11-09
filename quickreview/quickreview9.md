---
title: Quick Review 9
layout: default
parent: Quick Review
tampil: true
nav_order: 6
---

# Quick Review - Chapter 9

Recall singkat sebelum masuk ke study case. Fokusnya adalah menangani kegagalan secara terarah: menangkap exception yang memang diharapkan, membangkitkan exception saat kontrak dilanggar, dan menjaga state tetap benar setelah operasi gagal. Penjelasan lengkap ada pada [Chapter 9 - Exceptions and robust error handling]({{ '/readings-chapter9/' | relative_url }}).

## Main topics

1. **Exception dan traceback**
   - Exception adalah object yang mewakili kegagalan saat program berjalan. Syntax error dan logic error bukan sesuatu yang dapat ditangani dengan `try`.
   - Baca traceback dari bawah: jenis dan pesan exception, lalu lokasi terakhir, lalu urutan pemanggilan ke atas.
   - Exception membentuk hierarki: `KeyError` dan `IndexError` adalah `LookupError`; hampir semua error program adalah `Exception`.
   - `KeyboardInterrupt` dan `SystemExit` berada di bawah `BaseException`, bukan `Exception`.

2. **`try`, `except`, `else`, `finally`**
   - `except` dipilih dari atas ke bawah; blok pertama yang cocok yang dijalankan. Tulis subclass sebelum parent class.
   - `else` berjalan jika `try` berhasil; gunakan agar blok `try` hanya berisi operasi yang memang berisiko.
   - `finally` selalu berjalan, termasuk saat exception diteruskan atau function keluar dengan `return`.
   - Tangkap jenis yang spesifik. `except:` dan `except Exception: pass` dapat menyembunyikan bug.

3. **`raise` dan validasi**
   - Bangkitkan exception saat method tidak dapat memenuhi kontraknya; jangan mengembalikan `None` atau `-1` sebagai kode error.
   - `TypeError` untuk tipe yang salah, `ValueError` untuk nilai di luar aturan, `KeyError`/`LookupError` untuk data yang tidak ditemukan.
   - Validasi sebelum menyimpan nilai baru, sehingga nilai lama tetap utuh ketika validasi gagal.
   - `assert` hanya untuk asumsi internal; pemeriksaan ini dapat dinonaktifkan dengan `python -O`.

4. **Custom exception**
   - Turunkan dari `Exception`, lalu buat satu base exception domain, misalnya `PraktikumError`.
   - Simpan data penting sebagai attribute dan panggil `super().__init__(pesan)` agar `str(error)` jelas.
   - Pemanggil dapat menangkap subclass tertentu atau seluruh error domain melalui base class tanpa menangkap bug pemrograman.

5. **Meneruskan dan menerjemahkan**
   - `raise` tanpa argumen di dalam `except` meneruskan exception yang sama setelah, misalnya, mencatat log atau rollback.
   - `raise ErrorDomain(...) from error` menerjemahkan error teknis dan menyimpan penyebabnya di `__cause__`.
   - `raise ... from None` menyembunyikan rantai saat penyebab tidak relevan bagi pemakai.

6. **State dan sumber daya**
   - Operasi gagal tidak boleh meninggalkan perubahan setengah jalan.
   - Teknik 1: validasi seluruh data dahulu, ubah kemudian. Teknik 2: rollback langkah yang sudah terjadi, lalu `raise`.
   - `with` dan `finally` menjamin file, kunci, atau sesi tetap ditutup walaupun terjadi exception.
   - `__exit__()` yang mengembalikan nilai truthy menyembunyikan exception; kembalikan `False` jika exception harus diteruskan.

7. **Lapisan penanganan error**
   - Model dan service membangkitkan exception; CLI atau antarmuka menangkap error domain, menampilkan pesan, dan menentukan kode keluar.
   - Untuk pemrosesan banyak data, pilih kebijakan: hentikan pada error pertama, atau tangkap per item, catat, lalu lanjutkan.
   - Uji perilaku gagal dengan `assertRaises`/`assertRaisesRegex`, lalu periksa bahwa state tidak berubah.

### Empat bentuk `raise` yang jangan tertukar

| Bentuk                          | Arti                                                                        |
| :------------------------------ | :-------------------------------------------------------------------------- |
| `raise ValueError("pesan")`     | Membangkitkan exception baru                                                |
| `raise`                         | Di dalam `except`: meneruskan exception yang sedang ditangani               |
| `raise ErrorBaru(...) from e`   | Exception baru dengan penyebab eksplisit `__cause__ = e`                    |
| `raise ErrorBaru(...) from None` | Exception baru tanpa menampilkan rantai penyebab                           |

## Pro Tip

1. Sebelum menulis `except`, tanyakan: "Apa yang akan saya lakukan dengan error ini?" Jika jawabannya tidak ada, biarkan exception diteruskan.
2. Simpan blok `try` sesempit mungkin. Satu `try` yang membungkus seluruh function menyulitkan pencarian sumber error.
3. Tulis pesan error yang menyebut apa yang gagal, di mana, dan aturan apa yang dilanggar: `skor A03 harus 0..100, diterima 120`.
4. Saat memperbaiki error dari editor, baca baris terakhir traceback terlebih dahulu sebelum mengubah kode.
5. Untuk setiap operasi yang dapat ditolak, tulis satu test yang memeriksa exception-nya dan satu pemeriksaan bahwa state tetap sama.

## Playground: rekap skor yang tahan error

Playground ini menggabungkan base exception domain, penerjemahan error dengan `from`, penyimpanan setelah validasi, serta pemrosesan per baris dengan `try`/`except`/`else`/`finally`. Skor valid adalah integer `0..100`, dan setiap NIM hanya boleh dicatat satu kali.

{% capture qr9_starter %}class PraktikumError(Exception):
    """Dasar error domain praktikum."""


class SkorTidakValid(PraktikumError):
    def __init__(self, nim, teks):
        self.nim = nim
        super().__init__(f"skor {nim} tidak valid: {teks!r}")


class PesertaGanda(PraktikumError):
    def __init__(self, nim):
        self.nim = nim
        super().__init__(f"peserta {nim} sudah tercatat")


def parse_skor(nim, teks):
    try:
        skor = int(teks)
    except ValueError as error:
        raise SkorTidakValid(nim, teks) from error
    if not 0 <= skor <= 100:
        raise SkorTidakValid(nim, teks)
    return skor


class Rekap:
    def __init__(self):
        self._skor = {}

    def catat(self, nim, teks):
        if nim in self._skor:
            raise PesertaGanda(nim)
        # parse_skor() selesai lebih dulu, sehingga data gagal tidak pernah tersimpan
        self._skor[nim] = parse_skor(nim, teks)

    def ringkasan(self):
        return dict(self._skor)


rekap = Rekap()
data = [("A01", "80"), ("A02", "delapan"), ("A03", "120"), ("A01", "90"), ("A04", "75")]
diproses = 0
for nim, teks in data:
    try:
        rekap.catat(nim, teks)
    except PraktikumError as error:
        sebab = type(error.__cause__).__name__ if error.__cause__ else "-"
        print(f"GAGAL {type(error).__name__}: {error} | sebab: {sebab}")
    else:
        print("OK", nim)
    finally:
        diproses += 1

print("Skor:", rekap.ringkasan())
print("Diproses:", diproses)
{% endcapture %}
{% capture qr9_tests %}
@@OUTPUT@@
OK A01
GAGAL SkorTidakValid: skor A02 tidak valid: 'delapan' | sebab: ValueError
GAGAL SkorTidakValid: skor A03 tidak valid: '120' | sebab: -
GAGAL PesertaGanda: peserta A01 sudah tercatat | sebab: -
OK A04
Skor: {'A01': 80, 'A04': 75}
Diproses: 5
{% endcapture %}
{% include pyodide-exercise.html id="quickreview-ch9-playground" title="Chapter 9 - Exception domain dan pemrosesan per baris" prompt="Jalankan kode terlebih dahulu. Perhatikan baris mana yang memiliki sebab ValueError dan mana yang tidak. Lakukan eksperimen di bawah satu per satu, lalu gunakan Reset untuk kembali." starter=qr9_starter tests=qr9_tests %}

### Output awal

```text
OK A01
GAGAL SkorTidakValid: skor A02 tidak valid: 'delapan' | sebab: ValueError
GAGAL SkorTidakValid: skor A03 tidak valid: '120' | sebab: -
GAGAL PesertaGanda: peserta A01 sudah tercatat | sebab: -
OK A04
Skor: {'A01': 80, 'A04': 75}
Diproses: 5
```

### Coba dan jelaskan

1. Ganti `except PraktikumError` menjadi `except SkorTidakValid`. Mengapa program berhenti dengan traceback pada data `A01` kedua, dan mengapa `Skor:` tidak dicetak?
2. Hapus `from error` pada `parse_skor()`. Mengapa kolom sebab untuk `A02` berubah menjadi `-`, padahal exception tetap muncul?
3. Mengapa `A03` gagal dengan sebab `-`, sedangkan `A02` gagal dengan sebab `ValueError`?
4. Ubah `self._skor` di dalam `catat()` menjadi `self._skr`. Mengapa kesalahan ini tidak tercetak sebagai `GAGAL`, dan mengapa perilaku itu justru diinginkan?
5. Ubah isi `catat()` agar menyimpan `self._skor[nim] = teks` terlebih dahulu, baru memanggil `parse_skor()`. Data mana yang sekarang ikut tersimpan walaupun gagal?

## Checklist sebelum study case

- Tangkap jenis exception yang spesifik atau base exception domain, bukan seluruh `Exception`.
- Pastikan blok `try` hanya membungkus operasi yang memang diharapkan dapat gagal.
- Bangkitkan custom exception dengan pesan dan attribute yang jelas, dan panggil `super().__init__()`.
- Gunakan `from error` saat mengganti error teknis menjadi error domain.
- Validasi sebelum mengubah state; jika operasi bertahap gagal, lakukan rollback lalu `raise`.
- Gunakan `finally` atau `with` untuk pekerjaan yang harus selalu dijalankan.
- Biarkan bug pemrograman tetap terlihat. Error yang tidak dapat ditangani dengan benar sebaiknya diteruskan.
