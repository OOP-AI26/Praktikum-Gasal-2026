---
title: Chapter 9
layout: default
parent: Readings
printtitle: Modul 9 - Exceptions and Robust Error Handling
nav_order: 9
---

# MODUL 9

## EXCEPTIONS AND ROBUST ERROR HANDLING

Pada [Chapter 8]({{ '/readings-chapter8/' | relative_url }}), rekap nilai praktikum sudah dipisahkan menjadi model, kebijakan, service, dan CLI. Program tersebut berjalan baik selama datanya benar. Di dunia nyata, data sering tidak rapi: skor ditulis dengan huruf, NIM tidak terdaftar, kelas sudah penuh, atau file belum tersedia. Program yang **robust** tetap berperilaku jelas ketika menghadapi kondisi tersebut: menolak data yang salah, menjaga state tetap konsisten, membersihkan sumber daya, dan memberi pesan yang dapat ditindaklanjuti.

Modul ini membahas exception di Python, mulai dari membaca traceback, menangani exception dengan `try`, membangkitkan exception dengan `raise`, membuat hierarki exception untuk domain aplikasi, hingga menyusun penanganan error yang tidak merusak data. Contoh tetap memakai konteks rekap nilai praktikum. Chapter 9 merupakan materi untuk pertemuan **Week 10**.

**Cara belajar:** baca contoh secara berurutan. Enam latihan memiliki `TODO`; lengkapi, lalu gunakan **Run Tests**. Latihan terakhir adalah playground pengujian yang sudah lengkap. Saat latihan belum diselesaikan, editor dapat menampilkan traceback; itu bagian dari proses belajar membaca error. Gunakan Python **3.10 atau lebih baru** dengan standard library.

---

## A. CAPAIAN PEMBELAJARAN

Setelah mempelajari modul ini, mahasiswa diharapkan mampu:

1. Membedakan syntax error, exception saat program berjalan, dan logic error.
2. Membaca traceback untuk menemukan jenis exception, pesan, dan baris penyebab.
3. Menggunakan `try`, `except`, `else`, dan `finally` sesuai perannya.
4. Menangkap exception yang spesifik dan menjelaskan hierarki exception bawaan.
5. Membangkitkan exception dengan jenis dan pesan yang tepat, termasuk dari constructor dan property setter.
6. Membuat custom exception yang membentuk hierarki error domain dan menyimpan informasi tambahan.
7. Menerjemahkan error tingkat rendah menjadi error domain dengan `raise ... from ...`, serta meneruskan exception dengan `raise`.
8. Menjaga state tetap konsisten ketika operasi gagal, termasuk melalui validasi sebelum perubahan dan rollback.
9. Membersihkan sumber daya dengan `finally`, `with`, dan context manager buatan sendiri.
10. Menempatkan penanganan error pada lapisan yang tepat dan menguji exception dengan `unittest`.

### Peta belajar

| Bagian | Pertanyaan utama                                                          |
| :----- | :------------------------------------------------------------------------ |
| B-C    | Apa itu exception dan bagaimana membaca traceback?                        |
| D      | Bagaimana menangkap exception tanpa menyembunyikan bug?                   |
| E-F    | Kapan membangkitkan exception dan bagaimana merancang exception sendiri?  |
| G      | Bagaimana meneruskan dan menerjemahkan exception tanpa kehilangan sebab?  |
| H-I    | Bagaimana menjaga state dan sumber daya tetap aman ketika operasi gagal?  |
| J-K    | Di lapisan mana error ditangani, dan bagaimana perilakunya diuji?         |
| L-M    | Kesalahan umum dan pemeriksaan pemahaman                                  |

---

## B. PENDAHULUAN: KETIKA DATA TIDAK SESUAI HARAPAN

Perhatikan function berikut. Function ini benar untuk data yang rapi.

```python
def rata_rata(daftar_teks):
    total = 0
    for teks in daftar_teks:
        total += int(teks)
    return total // len(daftar_teks)


print(rata_rata(["80", "90"]))
```

Output:

```text
85
```

Namun, function tersebut berhenti dengan exception pada dua kondisi berikut:

```python
rata_rata(["80", "sembilan puluh"])  # ValueError dari int()
rata_rata([])                        # ZeroDivisionError dari pembagian
```

Kedua kondisi itu bukan kesalahan penulisan sintaks. Program dapat dibaca oleh Python, tetapi suatu operasi tidak dapat diselesaikan ketika program berjalan. Python melaporkan kondisi tersebut dengan membuat **exception**, yaitu object yang mewakili kegagalan, lalu menghentikan alur normal sampai ada bagian program yang menanganinya.

Penanganan error yang baik **tidak berarti semua error harus dibuat diam**. Kita perlu menentukan:

- error mana yang memang diharapkan dan dapat ditangani, misalnya input pengguna yang salah;
- error mana yang menandakan bug dan sebaiknya tetap terlihat;
- siapa yang paling tepat menangani error tersebut;
- apa yang harus tetap benar setelah operasi gagal.

---

## C. MEMBACA EXCEPTION DAN TRACEBACK

### 1. Tiga jenis kesalahan

| Jenis         | Kapan terdeteksi                                       | Contoh                                       |
| :------------ | :----------------------------------------------------- | :------------------------------------------- |
| Syntax error  | Sebelum program berjalan, saat kode dibaca Python      | Lupa tanda `:` setelah `if`                  |
| Exception     | Saat program berjalan dan suatu operasi tidak berhasil | `int("abc")`, akses key yang tidak ada       |
| Logic error   | Program selesai, tetapi hasilnya salah                 | Rumus bobot tertukar sehingga nilai keliru   |

`try`/`except` hanya dapat menangani exception. Syntax error harus diperbaiki pada kodenya. Logic error tidak menimbulkan pesan apa pun, sehingga perlu ditemukan melalui pengujian.

### 2. Anatomi traceback

Misalkan file `rekap.py` berisi:

```python
def baca_skor(teks):
    return int(teks)


def rekap(daftar):
    return [baca_skor(teks) for teks in daftar]


print(rekap(["80", "sembilan"]))
```

Saat dijalankan, Python menampilkan traceback seperti berikut. Detail tampilan, misalnya penanda `^^^`, dapat berbeda antarversi.

```text
Traceback (most recent call last):
  File "rekap.py", line 9, in <module>
    print(rekap(["80", "sembilan"]))
  File "rekap.py", line 6, in rekap
    return [baca_skor(teks) for teks in daftar]
  File "rekap.py", line 2, in baca_skor
    return int(teks)
ValueError: invalid literal for int() with base 10: 'sembilan'
```

Cara membacanya:

1. **Mulai dari baris terakhir.** `ValueError` adalah jenis exception; teks setelah titik dua adalah pesannya.
2. **Naik satu blok.** Baris `line 2, in baca_skor` menunjukkan lokasi exception dibuat.
3. **Telusuri ke atas.** Blok-blok di atasnya adalah urutan pemanggilan, dari program utama (`<module>`) sampai function terdalam. *Most recent call last* berarti pemanggilan terbaru berada paling bawah.

Lokasi exception tidak selalu sama dengan lokasi kesalahan. Pada contoh ini, `int()` bekerja dengan benar; masalahnya ada pada data `"sembilan"` yang dikirim dari program utama.

### 3. Exception adalah object dan memiliki hierarki

Setiap exception adalah instance dari class. Class-class tersebut membentuk hierarki inheritance, sama seperti yang dipelajari pada Chapter 5. Berikut potongan hierarki yang paling sering dijumpai:

```text
BaseException
 ├── SystemExit
 ├── KeyboardInterrupt
 └── Exception
      ├── ArithmeticError
      │    └── ZeroDivisionError
      ├── LookupError
      │    ├── IndexError
      │    └── KeyError
      ├── OSError
      │    └── FileNotFoundError
      ├── TypeError
      ├── ValueError
      ├── AttributeError
      └── NameError
```

| Exception           | Situasi umum                                                         |
| :------------------ | :------------------------------------------------------------------- |
| `ValueError`        | Tipe benar, tetapi nilainya tidak dapat diterima: `int("abc")`       |
| `TypeError`         | Operasi diberikan tipe yang tidak sesuai: `"80" + 5`                 |
| `KeyError`          | Key tidak ada di dictionary                                          |
| `IndexError`        | Indeks di luar panjang sequence                                      |
| `ZeroDivisionError` | Pembagian atau modulo dengan nol                                     |
| `AttributeError`    | Attribute atau method tidak dimiliki object                          |
| `FileNotFoundError` | File yang dibuka tidak ditemukan                                     |

Karena hierarki ini, `except LookupError` menangkap `KeyError` maupun `IndexError`. `except Exception` menangkap hampir semua error program, termasuk bug seperti `AttributeError` dan `NameError`. `SystemExit` dan `KeyboardInterrupt` sengaja tidak berada di bawah `Exception` karena keduanya bukan error program: keduanya meminta program berhenti.

Untuk memeriksa hubungan class exception, gunakan `issubclass()` atau atribut `__mro__`:

```python
print(issubclass(KeyError, LookupError))
print(issubclass(KeyboardInterrupt, Exception))
print([cls.__name__ for cls in ZeroDivisionError.__mro__])
```

Output:

```text
True
False
['ZeroDivisionError', 'ArithmeticError', 'Exception', 'BaseException', 'object']
```

---

## D. MENANGANI EXCEPTION: `try`, `except`, `else`, `finally`

### 1. Bentuk dasar

```python
try:
    skor = int(teks)
except ValueError:
    print("Skor harus berupa bilangan bulat.")
```

Python menjalankan blok `try`. Jika muncul `ValueError`, sisa blok `try` dilewati dan blok `except ValueError` dijalankan. Jika exception yang muncul bukan `ValueError`, blok tersebut tidak menangkapnya dan exception diteruskan ke pemanggil.

Untuk mengakses object exception, gunakan `as`:

```python
try:
    skor = int("sembilan")
except ValueError as error:
    print("Jenis:", type(error).__name__)
    print("Pesan:", error)
```

Output:

```text
Jenis: ValueError
Pesan: invalid literal for int() with base 10: 'sembilan'
```

Nama `error` hanya berlaku di dalam blok `except`. Python menghapus nama tersebut setelah blok selesai untuk menghindari referensi yang tidak perlu.

### 2. Beberapa `except` dan urutannya

```python
def ambil_skor(data, nim):
    try:
        return 100 // data[nim]
    except KeyError:
        return "NIM tidak terdaftar"
    except ZeroDivisionError:
        return "Skor nol tidak dapat dipakai sebagai pembagi"


data = {"A01": 4, "A02": 0}
print(ambil_skor(data, "A01"))
print(ambil_skor(data, "A02"))
print(ambil_skor(data, "A09"))
```

Output:

```text
25
Skor nol tidak dapat dipakai sebagai pembagi
NIM tidak terdaftar
```

Python memeriksa blok `except` dari atas ke bawah dan menjalankan **blok pertama yang cocok**. Karena itu, class yang lebih spesifik harus ditulis sebelum parent class-nya. Jika `except LookupError` ditulis sebelum `except KeyError`, blok `KeyError` tidak akan pernah tercapai.

Beberapa jenis yang ditangani dengan cara sama dapat ditulis sebagai tuple: `except (KeyError, IndexError):`.

### 3. Peran `else` dan `finally`

| Blok      | Dijalankan ketika                                                             |
| :-------- | :---------------------------------------------------------------------------- |
| `try`     | Selalu dijalankan pertama                                                     |
| `except`  | Exception yang cocok muncul di dalam `try`                                    |
| `else`    | Blok `try` selesai **tanpa** exception                                        |
| `finally` | Selalu, baik berhasil, ditangani, diteruskan, maupun keluar melalui `return`  |

```python
def proses(teks):
    try:
        skor = int(teks)
    except ValueError:
        print("ditolak:", teks)
    else:
        print("diterima:", skor)
    finally:
        print("selesai memeriksa", repr(teks))


proses("80")
proses("x")
```

Output:

```text
diterima: 80
selesai memeriksa '80'
ditolak: x
selesai memeriksa 'x'
```

Mengapa tidak menaruh `print("diterima:", skor)` langsung di blok `try`? Blok `try` sebaiknya hanya berisi operasi yang memang dapat menimbulkan exception yang ingin ditangani. Jika kode tambahan ditaruh di dalam `try`, exception dari kode tambahan tersebut dapat ikut tertangkap secara tidak sengaja. Blok `else` memisahkan **operasi yang berisiko** dari **lanjutan saat berhasil**.

### 4. Tangkap yang spesifik, jangan menelan bug

Bandingkan dua penanganan berikut:

```python
# Hindari: semua error dianggap "input salah"
try:
    skor = int(peserta.skr)
except Exception:
    skor = 0


# Lebih baik: hanya kegagalan konversi yang ditangani
try:
    skor = int(peserta.skor)
except ValueError:
    skor = 0
```

Pada versi pertama, salah ketik `peserta.skr` menimbulkan `AttributeError`, tetapi exception itu tertangkap dan diganti dengan skor `0`. Program tampak berjalan, padahal ada bug. Versi kedua hanya menangani kondisi yang diharapkan, sehingga bug tetap terlihat.

`except:` tanpa nama class bahkan lebih luas karena juga menangkap `KeyboardInterrupt` dan `SystemExit`. Jangan gunakan bentuk ini, apalagi dengan isi `pass`.

### 5. Latihan: membaca skor dari teks

Lengkapi `baca_skor()` dengan keempat blok penanganan exception. Teks yang dapat diubah menggunakan `int()` masuk ke `valid` sebagai integer; teks yang menimbulkan `ValueError` masuk ke `ditolak` dalam bentuk aslinya. `diperiksa` dihitung di blok `finally`. Rentang skor belum diperiksa pada latihan ini.

{% capture m9_try %}def baca_skor(daftar_teks):
    valid = []
    ditolak = []
    diperiksa = 0
    for teks in daftar_teks:
        # TODO: coba ubah teks menjadi int.
        # TODO: except ValueError -> tambahkan teks asli ke ditolak
        # TODO: else -> tambahkan hasil konversi ke valid
        # TODO: finally -> tambahkan 1 ke diperiksa
        pass
    return valid, ditolak, diperiksa


# Program utama: jangan diubah
valid, ditolak, diperiksa = baca_skor(["80", " 75 ", "sembilan", "90.5", "-3", ""])
print("Valid:", valid)
print("Ditolak:", ditolak)
print("Diperiksa:", diperiksa)
print("Kosong:", baca_skor([]))
{% endcapture %}
{% capture m9_try_tests %}
@@OUTPUT@@
Valid: [80, 75, -3]
Ditolak: ['sembilan', '90.5', '']
Diperiksa: 6
Kosong: ([], [], 0)
{% endcapture %}
{% include pyodide-exercise.html id="m9-try" title="Latihan 1: try, except, else, finally" prompt="Gunakan try untuk int(), except ValueError untuk teks yang ditolak, else untuk skor valid, dan finally untuk menghitung jumlah teks yang diperiksa." starter=m9_try tests=m9_try_tests %}

---

## E. MEMBANGKITKAN EXCEPTION DENGAN `raise`

### 1. Kapan sebuah method sebaiknya gagal?

Method sebaiknya membangkitkan exception ketika ia **tidak dapat memenuhi kontraknya**. Misalnya, setter skor berjanji menyimpan skor `0..100`. Jika diberi `150`, setter tidak memiliki cara yang benar untuk memenuhi janji itu. Mengembalikan `None`, `-1`, atau `False` membuat pemanggil harus ingat memeriksa nilai khusus tersebut; jika lupa, data yang salah ikut mengalir ke bagian lain.

```python
class Peserta:
    def __init__(self, nim, skor):
        self.nim = nim
        self.skor = skor  # validasi melalui setter

    @property
    def skor(self):
        return self._skor

    @skor.setter
    def skor(self, nilai):
        if not 0 <= nilai <= 100:
            raise ValueError("skor harus 0..100")
        self._skor = nilai
```

Pola ini sudah dipakai pada Chapter 3. Perhatikan dua hal penting:

- Constructor memakai setter, sehingga object **tidak pernah dibuat** dengan skor tidak valid.
- Penyimpanan `self._skor = nilai` dilakukan **setelah** pemeriksaan. Jika validasi gagal, nilai lama tetap utuh.

### 2. Memilih jenis exception bawaan

| Situasi                                                         | Exception yang lazim  |
| :-------------------------------------------------------------- | :-------------------- |
| Tipe argumen tidak sesuai, misalnya teks diberikan untuk skor   | `TypeError`           |
| Tipe sesuai, tetapi nilainya di luar aturan                     | `ValueError`          |
| Key atau elemen yang dicari tidak ada                           | `KeyError`/`LookupError` |
| Method wajib belum diimplementasikan pada child class           | `NotImplementedError` |
| Operasi tidak dapat dilakukan karena state object saat ini      | Custom exception (bagian F) atau `RuntimeError` |

Tulis pesan yang membantu pemanggil: sebutkan nilai atau aturan yang dilanggar, bukan hanya "error". Pesan `"skor harus 0..100"` lebih berguna daripada `"input salah"`.

Ingat bahwa `bool` adalah subclass `int` di Python, sehingga `isinstance(True, int)` menghasilkan `True`. Jika skor boolean tidak boleh diterima, periksa kondisi tersebut secara eksplisit.

### 3. `assert` bukan pengganti validasi

`assert kondisi, pesan` membangkitkan `AssertionError` jika kondisi bernilai salah. `assert` cocok untuk memeriksa asumsi internal saat pengembangan dan pengujian. Namun, pemeriksaan `assert` dapat dinonaktifkan ketika Python dijalankan dengan opsi optimisasi `-O`. Karena itu, **jangan memakai `assert` untuk memvalidasi input pengguna atau data dari luar program**. Gunakan `if` dan `raise`.

### 4. Latihan: validasi skor melalui property

Lengkapi setter `skor`. Urutan pemeriksaan: tipe terlebih dahulu, lalu rentang. `bool` harus ditolak sebagai `TypeError`. Pastikan skor lama tetap tersimpan ketika validasi gagal.

{% capture m9_raise %}class Peserta:
    def __init__(self, nim, skor):
        self.nim = nim
        self.skor = skor

    @property
    def skor(self):
        return self._skor

    @skor.setter
    def skor(self, nilai):
        # TODO: raise TypeError("skor harus int") jika nilai bukan int atau bertipe bool
        # TODO: raise ValueError("skor harus 0..100") jika nilai di luar 0..100
        # TODO: simpan nilai ke self._skor hanya setelah lolos kedua pemeriksaan
        pass


# Program utama: jangan diubah
andi = Peserta("A01", 80)
for percobaan in [95, "90", 101, True, -1]:
    try:
        andi.skor = percobaan
    except (TypeError, ValueError) as error:
        print(type(error).__name__, error, "| skor tetap", andi.skor)
    else:
        print("OK", andi.skor)

try:
    Peserta("B02", 150)
except ValueError as error:
    print("Constructor:", error)
{% endcapture %}
{% capture m9_raise_tests %}
@@OUTPUT@@
OK 95
TypeError skor harus int | skor tetap 95
ValueError skor harus 0..100 | skor tetap 95
TypeError skor harus int | skor tetap 95
ValueError skor harus 0..100 | skor tetap 95
Constructor: skor harus 0..100
{% endcapture %}
{% include pyodide-exercise.html id="m9-raise" title="Latihan 2: raise dari property setter" prompt="Bangkitkan TypeError untuk tipe yang salah dan ValueError untuk skor di luar 0..100. Simpan skor hanya setelah kedua pemeriksaan lolos." starter=m9_raise tests=m9_raise_tests %}

---

## F. CUSTOM EXCEPTION DAN HIERARKI ERROR DOMAIN

### 1. Mengapa membuat exception sendiri?

`ValueError` dapat berasal dari banyak tempat: `int()`, `float()`, unpacking, atau library lain. Jika semua kegagalan aplikasi juga memakai `ValueError`, pemanggil sulit membedakan "kelas penuh" dari "teks bukan angka". **Custom exception** memberi nama pada kegagalan yang bermakna bagi domain aplikasi.

```python
class PraktikumError(Exception):
    """Dasar seluruh error domain praktikum."""


class KelasPenuh(PraktikumError):
    def __init__(self, kode, kapasitas):
        self.kode = kode
        self.kapasitas = kapasitas
        super().__init__(f"kelas {kode} penuh (kapasitas {kapasitas})")


class PesertaTidakDitemukan(PraktikumError):
    def __init__(self, nim):
        self.nim = nim
        super().__init__(f"peserta {nim} tidak ditemukan")
```

Pedoman penulisan:

- Turunkan custom exception dari `Exception`, bukan dari `BaseException`.
- Buat satu **base exception** untuk domain, misalnya `PraktikumError`. Lapisan yang ingin menangani seluruh kegagalan domain cukup menulis `except PraktikumError`, tanpa ikut menangkap bug pemrograman.
- Akhiri nama class dengan kata yang menjelaskan kondisi, misalnya `KelasPenuh`, atau akhiran `Error`, misalnya `KonfigurasiError`. Ikuti satu konvensi secara konsisten.
- Simpan data penting sebagai attribute, misalnya `nim` atau `kapasitas`, agar pemanggil tidak perlu mengurai teks pesan.
- Panggil `super().__init__(pesan)` agar `str(error)` menghasilkan pesan yang jelas.

### 2. Menangkap pada tingkat yang sesuai

```python
try:
    kelas.daftar("A03")
except KelasPenuh as error:
    print("Daftar tunggu untuk", error.kode)
except PraktikumError as error:
    print("Operasi praktikum gagal:", error)
```

Pemanggil boleh menangani jenis tertentu secara khusus dan jenis lain melalui base exception. Penambahan subclass baru, misalnya `JadwalBentrok(PraktikumError)`, tetap tertangkap oleh blok kedua tanpa mengubah kode pemanggil. Ini adalah penerapan polymorphism pada exception.

### 3. Latihan: kelas praktikum dengan error domain

Lengkapi constructor `PesertaTidakDitemukan` serta method `daftar()` dan `keluarkan()`. Program utama menangkap seluruh kegagalan melalui `PraktikumError`, lalu membaca attribute `nim` dari exception.

{% capture m9_custom %}class PraktikumError(Exception):
    """Dasar seluruh error domain praktikum."""


class PesertaTidakDitemukan(PraktikumError):
    def __init__(self, nim):
        # TODO: simpan nim sebagai attribute self.nim
        # TODO: panggil super().__init__() dengan pesan f"peserta {nim} tidak ditemukan"
        pass


class KelasPenuh(PraktikumError):
    def __init__(self, kode, kapasitas):
        self.kode = kode
        self.kapasitas = kapasitas
        super().__init__(f"kelas {kode} penuh (kapasitas {kapasitas})")


class KelasPraktikum:
    def __init__(self, kode, kapasitas):
        self.kode = kode
        self.kapasitas = kapasitas
        self._peserta = []

    def daftar(self, nim):
        # TODO: raise KelasPenuh(self.kode, self.kapasitas) jika jumlah peserta sudah mencapai kapasitas
        # TODO: tambahkan nim ke self._peserta
        pass

    def keluarkan(self, nim):
        # TODO: raise PesertaTidakDitemukan(nim) jika nim tidak terdaftar
        # TODO: hapus nim dari self._peserta
        pass

    def peserta(self):
        return list(self._peserta)


# Program utama: jangan diubah
kelas = KelasPraktikum("PBO-A", 2)
operasi = [
    ("daftar", "A01"),
    ("daftar", "A02"),
    ("daftar", "A03"),
    ("keluar", "A09"),
    ("keluar", "A01"),
    ("daftar", "A03"),
]
for aksi, nim in operasi:
    try:
        if aksi == "daftar":
            kelas.daftar(nim)
        else:
            kelas.keluarkan(nim)
    except PraktikumError as error:
        print("Gagal", type(error).__name__, "-", error)
    else:
        print("OK", aksi, nim)

print("Peserta:", kelas.peserta())
try:
    kelas.keluarkan("Z99")
except PesertaTidakDitemukan as error:
    print("Attribute nim:", error.nim)
print("Hierarki:", issubclass(KelasPenuh, PraktikumError), issubclass(PraktikumError, Exception))
{% endcapture %}
{% capture m9_custom_tests %}
@@OUTPUT@@
OK daftar A01
OK daftar A02
Gagal KelasPenuh - kelas PBO-A penuh (kapasitas 2)
Gagal PesertaTidakDitemukan - peserta A09 tidak ditemukan
OK keluar A01
OK daftar A03
Peserta: ['A02', 'A03']
Attribute nim: Z99
Hierarki: True True
{% endcapture %}
{% include pyodide-exercise.html id="m9-custom" title="Latihan 3: custom exception dan hierarki domain" prompt="Lengkapi custom exception dan dua method kelas. Kegagalan harus dibangkitkan sebagai subclass PraktikumError, dan operasi yang gagal tidak boleh mengubah daftar peserta." starter=m9_custom tests=m9_custom_tests %}

---

## G. MENERUSKAN DAN MENERJEMAHKAN EXCEPTION

### 1. Meneruskan dengan `raise`

Kadang suatu fungsi perlu melakukan sesuatu ketika error terjadi, misalnya mencatat log atau mengembalikan state, tetapi tidak berhak memutuskan bahwa error sudah selesai ditangani. Gunakan `raise` tanpa argumen di dalam blok `except` untuk meneruskan exception yang **sama** beserta traceback-nya.

```python
def simpan_semua(daftar, log):
    try:
        for item in daftar:
            item.simpan()
    except OSError:
        log.append("penyimpanan gagal; perubahan perlu diperiksa")
        raise
```

### 2. Menerjemahkan dengan `raise ... from ...`

Lapisan domain sebaiknya tidak membocorkan detail teknis yang tidak dipahami pemanggilnya. Parser data nilai, misalnya, dapat gagal karena `ValueError` dari `int()` atau dari unpacking. Bagi pemanggil, keduanya berarti hal yang sama: **baris data tidak valid**.

```python
class FormatBarisSalah(Exception):
    def __init__(self, nomor, baris):
        self.nomor = nomor
        self.baris = baris
        super().__init__(f"baris {nomor} tidak valid: {baris!r}")


def parse_baris(nomor, baris):
    try:
        nim, teks_skor = baris.split(";")
        skor = int(teks_skor)
    except ValueError as error:
        raise FormatBarisSalah(nomor, baris) from error
    return nim, skor
```

`from error` menyimpan exception asli pada atribut `__cause__` exception baru. Jika tidak ditangani, traceback menampilkan keduanya dengan kalimat *The above exception was the direct cause of the following exception*. Informasi penyebab tetap tersedia untuk debugging, sementara pemanggil cukup menangani `FormatBarisSalah`.

| Bentuk                       | Hasil                                                                                   |
| :--------------------------- | :-------------------------------------------------------------------------------------- |
| `raise`                      | Meneruskan exception yang sedang ditangani tanpa perubahan                              |
| `raise BaruError(...) from e` | Exception baru dengan `__cause__ = e`; penyebab ditandai secara eksplisit              |
| `raise BaruError(...)` di dalam `except` | Rantai implisit melalui `__context__`; traceback menyebut *During handling of the above exception, another exception occurred* |
| `raise BaruError(...) from None` | Menyembunyikan rantai saat penyebab tidak relevan bagi pemakai                      |

Rantai implisit sering menandakan bahwa exception kedua tidak disengaja, misalnya bug di dalam blok `except`. Saat menerjemahkan error secara sengaja, tulis `from error` agar maksudnya jelas.

### 3. EAFP dan LBYL

Chapter 6 telah memperkenalkan dua gaya berikut:

| Gaya | Arti                                      | Contoh                                                       |
| :--- | :---------------------------------------- | :----------------------------------------------------------- |
| LBYL | *Look Before You Leap*: periksa dahulu    | `if nim in data: return data[nim]`                           |
| EAFP | *Easier to Ask Forgiveness than Permission*: coba, lalu tangani | `try: return data[nim]` `except KeyError: ...` |

Python sering memakai EAFP, terutama ketika pemeriksaan dan operasi dapat menjadi tidak sinkron, misalnya file dihapus di antara pemeriksaan `exists()` dan pembukaan file. Untuk aturan bisnis yang sederhana dan tidak bergantung pada kondisi luar, seperti `skor <= 100`, pemeriksaan `if` justru lebih jelas. Pilih gaya yang membuat maksud kode paling mudah dibaca.

### 4. Latihan: parser baris nilai

Lengkapi `parse_baris()`. Format yang valid adalah `nim;skor` dengan tepat satu tanda `;`. Spasi di sekitar skor boleh karena `int()` menerimanya. Seluruh `ValueError` dari pemisahan dan konversi harus diterjemahkan menjadi `FormatBarisSalah` dengan `from`.

{% capture m9_chain %}class FormatBarisSalah(Exception):
    def __init__(self, nomor, baris):
        self.nomor = nomor
        self.baris = baris
        super().__init__(f"baris {nomor} tidak valid: {baris!r}")


def parse_baris(nomor, baris):
    # TODO: pisahkan baris dengan split(";") menjadi tepat dua bagian: nim dan teks skor
    # TODO: ubah teks skor menjadi int
    # TODO: jika unpacking atau int() menimbulkan ValueError,
    #       raise FormatBarisSalah(nomor, baris) from error
    # TODO: kembalikan tuple (nim, skor)
    pass


# Program utama: jangan diubah
data = ["A01;80", "A02;delapan", "A03", "A04;70;90", "A05; 95 "]
for nomor, baris in enumerate(data, start=1):
    try:
        nim, skor = parse_baris(nomor, baris)
    except FormatBarisSalah as error:
        print("Gagal:", error, "| sebab:", type(error.__cause__).__name__)
    else:
        print("OK:", nim, skor)
{% endcapture %}
{% capture m9_chain_tests %}
@@OUTPUT@@
OK: A01 80
Gagal: baris 2 tidak valid: 'A02;delapan' | sebab: ValueError
Gagal: baris 3 tidak valid: 'A03' | sebab: ValueError
Gagal: baris 4 tidak valid: 'A04;70;90' | sebab: ValueError
OK: A05 95
{% endcapture %}
{% include pyodide-exercise.html id="m9-chain" title="Latihan 4: menerjemahkan exception dengan from" prompt="Tangkap ValueError dari unpacking dan int(), lalu bangkitkan FormatBarisSalah dari error asli. Program utama mencetak jenis exception penyebab melalui __cause__." starter=m9_chain tests=m9_chain_tests %}

---

## H. MENJAGA STATE TETAP KONSISTEN

### 1. Masalah perubahan setengah jalan

Perhatikan method yang memperbarui beberapa skor sekaligus:

```python
def perbarui_semua(self, perubahan):
    for nim, skor in perubahan:
        self._peserta[nim].skor = skor  # dapat gagal di tengah daftar
```

Jika elemen pertama berhasil diubah dan elemen kedua gagal, exception tetap muncul, tetapi object sudah berubah sebagian. Pemanggil menerima pesan gagal, padahal sebagian data sudah diganti. Kondisi seperti ini sulit dilacak.

Operasi yang robust memberikan **jaminan kuat**: jika gagal, state kembali seperti sebelum operasi dipanggil. Dua teknik umum untuk mencapainya:

| Teknik                         | Cara kerja                                                                                 |
| :----------------------------- | :----------------------------------------------------------------------------------------- |
| Validasi dahulu, ubah kemudian | Periksa seluruh data dan prasyarat; setelah semuanya lolos, lakukan perubahan             |
| Rollback                       | Lakukan perubahan bertahap; jika langkah berikutnya gagal, batalkan langkah sebelumnya lalu teruskan exception |

### 2. Validasi dahulu, ubah kemudian

```python
def perbarui_semua(self, perubahan):
    for nim, skor in perubahan:          # tahap 1: tidak mengubah apa pun
        if nim not in self._peserta:
            raise KeyError(nim)
        if not 0 <= skor <= 100:
            raise ValueError(f"skor {nim} di luar 0..100")
    for nim, skor in perubahan:          # tahap 2: semua sudah pasti valid
        self._peserta[nim].skor = skor
```

Teknik ini paling sederhana jika seluruh kegagalan dapat diketahui sebelum perubahan dimulai.

### 3. Rollback

Ketika operasi terdiri atas dua langkah yang masing-masing memiliki validasinya sendiri, misalnya memindahkan kuota dari satu kelas ke kelas lain, rollback lebih praktis.

```python
def pindah_kuota(asal, tujuan, jumlah):
    asal.kurangi(jumlah)          # jika gagal, belum ada yang berubah
    try:
        tujuan.tambah(jumlah)
    except KuotaError:
        asal.tambah(jumlah)       # kembalikan langkah pertama
        raise                     # pemanggil tetap mengetahui kegagalan
```

Langkah rollback harus dapat dipastikan berhasil. Pada contoh ini, `asal.tambah(jumlah)` hanya mengembalikan nilai yang baru saja dikurangi, sehingga kuota `asal` kembali ke kondisi sebelumnya.

### 4. Latihan: pembaruan skor semua-atau-tidak-sama-sekali

Lengkapi `perbarui_semua()` dengan teknik validasi dahulu. Jika satu pasangan saja tidak valid, tidak ada skor yang boleh berubah. Daftar perubahan kosong dianggap berhasil.

{% capture m9_atomic %}class Peserta:
    def __init__(self, nim, skor):
        self.nim = nim
        self.skor = skor


class Rekap:
    def __init__(self, daftar_peserta):
        self._peserta = {peserta.nim: peserta for peserta in daftar_peserta}

    def skor(self):
        return {nim: peserta.skor for nim, peserta in self._peserta.items()}

    def perbarui_semua(self, perubahan):
        # TODO tahap 1: periksa SELURUH pasangan (nim, skor) terlebih dahulu.
        #   nim tidak terdaftar -> raise KeyError(nim)
        #   skor di luar 0..100 -> raise ValueError(f"skor {nim} di luar 0..100")
        # TODO tahap 2: setelah semua lolos, ubah skor setiap peserta
        pass


# Program utama: jangan diubah
rekap = Rekap([Peserta("A01", 70), Peserta("A02", 80)])
paket = [
    [("A01", 85), ("A09", 90)],
    [("A01", 85), ("A02", 120)],
    [("A01", 85), ("A02", 88)],
    [],
]
for perubahan in paket:
    try:
        rekap.perbarui_semua(perubahan)
    except (KeyError, ValueError) as error:
        print("Ditolak", type(error).__name__, error, "->", rekap.skor())
    else:
        print("Diterapkan ->", rekap.skor())
{% endcapture %}
{% capture m9_atomic_tests %}
@@OUTPUT@@
Ditolak KeyError 'A09' -> {'A01': 70, 'A02': 80}
Ditolak ValueError skor A02 di luar 0..100 -> {'A01': 70, 'A02': 80}
Diterapkan -> {'A01': 85, 'A02': 88}
Diterapkan -> {'A01': 85, 'A02': 88}
{% endcapture %}
{% include pyodide-exercise.html id="m9-atomic" title="Latihan 5: perubahan atomik" prompt="Periksa seluruh perubahan sebelum mengubah skor. Paket perubahan yang ditolak harus meninggalkan seluruh skor seperti semula." starter=m9_atomic tests=m9_atomic_tests %}

---

## I. MEMBERSIHKAN SUMBER DAYA: `finally` DAN `with`

### 1. Sumber daya harus dilepas walaupun terjadi error

File, koneksi jaringan, dan kunci (*lock*) perlu ditutup atau dilepas setelah dipakai. Jika exception muncul di tengah pekerjaan, baris penutupan di akhir function tidak akan tercapai. `finally` menjamin pembersihan tetap dijalankan:

```python
berkas = open("nilai.txt", encoding="utf-8")
try:
    isi = berkas.read()
finally:
    berkas.close()
```

Pernyataan `with` menuliskan pola yang sama secara lebih ringkas. Object file adalah **context manager**: ketika blok `with` selesai, normal ataupun karena exception, file ditutup otomatis.

```python
with open("nilai.txt", encoding="utf-8") as berkas:
    isi = berkas.read()
```

Jika `nilai.txt` tidak ada, `open()` membangkitkan `FileNotFoundError` sebelum blok `with` dimulai. Penanganan detail file akan dibahas lebih lanjut pada chapter berikutnya.

### 2. Membuat context manager sendiri

Class menjadi context manager jika menyediakan dua dunder method:

| Method                              | Dipanggil                       | Keterangan                                                                 |
| :---------------------------------- | :------------------------------ | :------------------------------------------------------------------------- |
| `__enter__(self)`                   | Saat masuk blok `with`          | Nilai kembaliannya diikat ke nama setelah `as`                             |
| `__exit__(self, exc_type, exc, tb)` | Saat keluar blok, selalu        | Ketiga argumen bernilai `None` jika blok berhasil; jika terjadi exception, berisi class, object, dan traceback-nya |

Jika `__exit__()` mengembalikan nilai *truthy*, exception **disembunyikan**. Kembalikan `False` atau `None` agar exception tetap diteruskan. Menyembunyikan exception hanya tepat jika jenisnya benar-benar diharapkan dan sudah ditangani sepenuhnya, misalnya seperti `contextlib.suppress(FileNotFoundError)` pada standard library.

### 3. Latihan: sesi ujian yang selalu ditutup

Lengkapi `__enter__()` dan `__exit__()`. Sesi harus dicatat tertutup walaupun blok `with` gagal, dan exception dari blok tersebut tidak boleh disembunyikan.

{% capture m9_with %}class SesiUjian:
    def __init__(self, kode, log):
        self.kode = kode
        self.log = log
        self.terbuka = False

    def __enter__(self):
        # TODO: ubah terbuka menjadi True, catat f"buka {self.kode}" ke log
        # TODO: kembalikan self agar dapat dipakai melalui "as"
        pass

    def __exit__(self, exc_type, exc, tb):
        # TODO: ubah terbuka menjadi False
        # TODO: catat f"tutup {self.kode} ok" jika exc_type None;
        #       selain itu catat f"tutup {self.kode} {exc_type.__name__}"
        # TODO: kembalikan False agar exception tidak disembunyikan
        pass


# Program utama: jangan diubah
log = []
with SesiUjian("UTS", log) as sesi:
    log.append(f"kerjakan {sesi.kode} terbuka={sesi.terbuka}")

try:
    with SesiUjian("UAS", log) as sesi:
        log.append("kerjakan UAS")
        raise ValueError("lembar jawaban rusak")
except ValueError as error:
    log.append(f"ditangani: {error}")

for baris in log:
    print(baris)
print("Terbuka setelah keluar:", sesi.terbuka)
{% endcapture %}
{% capture m9_with_tests %}
@@OUTPUT@@
buka UTS
kerjakan UTS terbuka=True
tutup UTS ok
buka UAS
kerjakan UAS
tutup UAS ValueError
ditangani: lembar jawaban rusak
Terbuka setelah keluar: False
{% endcapture %}
{% include pyodide-exercise.html id="m9-with" title="Latihan 6: context manager buatan sendiri" prompt="Lengkapi __enter__ dan __exit__. Amati bahwa log tutup tetap muncul sebelum exception ditangani oleh program utama." starter=m9_with tests=m9_with_tests %}

---

## J. LAPISAN PENANGANAN ERROR DALAM PROYEK

### 1. Siapa yang menangkap?

Pertanyaan terpenting bukan "bagaimana menangkap error", tetapi **di mana** error ditangani. Bagian yang menangkap exception harus memiliki cukup informasi untuk melakukan sesuatu yang bermakna. Struktur package dari Chapter 8 memberikan pembagian alami:

| Lapisan          | Tanggung jawab terhadap error                                                                   |
| :--------------- | :----------------------------------------------------------------------------------------------- |
| Model            | Menjaga invariant object; membangkitkan exception saat data atau operasi melanggar aturan       |
| Parser/service   | Menerjemahkan error teknis menjadi error domain; menjaga operasi tetap atomik                   |
| CLI/antarmuka    | Menangkap error domain, menampilkan pesan yang dipahami pengguna, dan menentukan kode keluar    |

Model dan service **tidak mencetak** pesan error dan tidak menyembunyikan kegagalan. Mereka cukup membangkitkan exception yang jelas. Keputusan cara menampilkan pesan diserahkan ke CLI, sehingga service yang sama tetap dapat dipakai oleh test, CLI lain, atau GUI.

```python
import sys

from .errors import PraktikumError
from .services import rekap_dari_baris


def main():
    try:
        laporan = rekap_dari_baris(sys.stdin.read().splitlines())
    except PraktikumError as error:
        print(f"Error: {error}", file=sys.stderr)
        return 1
    for baris in laporan:
        print(baris)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
```

Kode keluar `0` menandakan program berhasil, sedangkan nilai bukan nol menandakan kegagalan. Script lain atau sistem otomatis dapat membaca kode tersebut. Pesan error ditulis ke `sys.stderr` agar terpisah dari output laporan.

### 2. Memproses banyak data: hentikan atau lanjutkan?

Saat mengimpor ratusan baris data, ada dua kebijakan yang sama-sama sah:

| Kebijakan                 | Kapan dipilih                                                      | Cara                                                                                          |
| :------------------------ | :----------------------------------------------------------------- | :-------------------------------------------------------------------------------------------- |
| Hentikan pada error pertama | Data harus lengkap dan konsisten sebelum dipakai                 | Biarkan exception diteruskan, atau terjemahkan lalu bangkitkan                                |
| Lanjutkan dan laporkan    | Baris yang valid tetap berguna walaupun ada baris rusak            | Tangkap error domain **per item**, catat nomor dan alasan, lalu lanjut ke item berikutnya    |

```python
def impor(daftar_baris):
    hasil, laporan_error = [], []
    for nomor, baris in enumerate(daftar_baris, start=1):
        try:
            hasil.append(parse_baris(nomor, baris))
        except FormatBarisSalah as error:
            laporan_error.append(str(error))
    return hasil, laporan_error
```

Perhatikan bahwa yang ditangkap hanya `FormatBarisSalah`. Jika `parse_baris()` mengandung bug yang menimbulkan `NameError` atau `AttributeError`, bug itu tetap terlihat dan tidak tercatat sebagai "baris rusak".

### 3. Pesan error yang baik

Pesan error yang dapat ditindaklanjuti menjawab tiga hal:

1. **Apa** yang gagal: `skor`.
2. **Di mana**: `baris 4`, `peserta A03`.
3. **Aturan apa** yang dilanggar atau nilai apa yang diterima: `harus 0..100, diterima 120`.

Hindari pesan yang hanya berisi "terjadi kesalahan" atau traceback mentah bagi pengguna akhir. Traceback berguna bagi pengembang; pengguna aplikasi membutuhkan pesan yang menjelaskan apa yang harus diperbaiki.

---

## K. MENGUJI PERILAKU SAAT GAGAL

Perilaku saat gagal adalah bagian dari kontrak dan perlu diuji, sama seperti perilaku saat berhasil. `unittest` menyediakan dua alat utama:

| Alat                                      | Kegunaan                                                         |
| :---------------------------------------- | :--------------------------------------------------------------- |
| `with self.assertRaises(JenisError):`     | Test lulus hanya jika blok membangkitkan exception jenis tersebut |
| `with self.assertRaisesRegex(Jenis, pola):` | Sama, ditambah pemeriksaan pesan exception dengan regular expression |

Setelah blok `assertRaises`, periksa juga bahwa state tidak berubah. Test seperti ini memastikan operasi yang gagal benar-benar aman.

Pada proyek lokal, test dijalankan dengan `python -m unittest discover -s tests -v` seperti pada Chapter 8. Playground berikut menjalankan test langsung di dalam satu file dan hanya mencetak ringkasan agar output stabil.

{% capture m9_test %}import io
import unittest


class SaldoTidakCukup(Exception):
    pass


class Dompet:
    def __init__(self, saldo):
        self.saldo = saldo

    def bayar(self, nominal):
        if nominal <= 0:
            raise ValueError("nominal harus positif")
        if nominal > self.saldo:
            raise SaldoTidakCukup(f"saldo {self.saldo} kurang dari {nominal}")
        self.saldo -= nominal


class TestDompet(unittest.TestCase):
    def test_bayar_berhasil(self):
        dompet = Dompet(10000)
        dompet.bayar(2500)
        self.assertEqual(dompet.saldo, 7500)

    def test_saldo_kurang_tidak_mengubah_saldo(self):
        dompet = Dompet(1000)
        with self.assertRaises(SaldoTidakCukup):
            dompet.bayar(5000)
        self.assertEqual(dompet.saldo, 1000)

    def test_nominal_nol_ditolak(self):
        with self.assertRaisesRegex(ValueError, "positif"):
            Dompet(1000).bayar(0)


# Infrastruktur editor: menjalankan test tanpa menulis ke stderr.
suite = unittest.defaultTestLoader.loadTestsFromTestCase(TestDompet)
hasil = unittest.TextTestRunner(stream=io.StringIO(), verbosity=0).run(suite)
print("Dijalankan:", hasil.testsRun)
print("Gagal:", len(hasil.failures))
print("Error:", len(hasil.errors))
print("Semua lulus:", hasil.wasSuccessful())
{% endcapture %}
{% capture m9_test_tests %}
@@OUTPUT@@
Dijalankan: 3
Gagal: 0
Error: 0
Semua lulus: True
{% endcapture %}
{% include pyodide-exercise.html id="m9-test" title="Playground: menguji exception dengan unittest" prompt="Jalankan kode terlebih dahulu, lalu lakukan eksperimen di bawah editor satu per satu. Amati test mana yang gagal dan gunakan Reset untuk kembali." starter=m9_test tests=m9_test_tests %}

### Eksperimen yang dapat dilakukan

1. Ganti `raise SaldoTidakCukup(...)` menjadi `return False`. Mengapa `test_saldo_kurang_tidak_mengubah_saldo` gagal walaupun saldo tidak berubah?
2. Pindahkan `self.saldo -= nominal` ke baris pertama method `bayar()`. Test mana yang mendeteksi perubahan state setengah jalan?
3. Ubah pesan `"nominal harus positif"` menjadi `"nominal salah"`. Mengapa hanya test yang memakai `assertRaisesRegex` yang gagal?

---

## L. KESALAHAN YANG SERING MUNCUL

| Gejala atau pola                                                   | Masalah                                                         | Perbaikan                                                                    |
| :----------------------------------------------------------------- | :-------------------------------------------------------------- | :--------------------------------------------------------------------------- |
| `except:` atau `except Exception: pass`                            | Bug dan permintaan berhenti ikut tertelan                       | Tangkap jenis spesifik atau base exception domain                            |
| Blok `try` berisi puluhan baris                                    | Tidak jelas operasi mana yang diharapkan gagal                  | Persempit `try`; pindahkan lanjutan ke `else`                                |
| `except LookupError` ditulis sebelum `except KeyError`             | Blok yang lebih spesifik tidak pernah tercapai                  | Urutkan dari subclass ke parent class                                        |
| Method mengembalikan `None`/`-1` saat gagal                        | Pemanggil mudah lupa memeriksa nilai khusus                     | Bangkitkan exception yang menjelaskan kegagalan                              |
| State sudah berubah sebelum validasi selesai                       | Data rusak sebagian setelah operasi gagal                       | Validasi dahulu atau lakukan rollback                                        |
| `raise ErrorBaru(...)` di dalam `except` tanpa `from`              | Rantai penyebab tampak tidak disengaja                          | Gunakan `from error`, atau `from None` jika penyebab memang tidak relevan    |
| Model atau service mencetak pesan error lalu melanjutkan          | Pemanggil tidak tahu operasi gagal; sulit diuji                 | Bangkitkan exception; tampilkan pesan di lapisan antarmuka                   |
| `assert` dipakai untuk validasi input                              | Pemeriksaan hilang saat Python dijalankan dengan `-O`           | Gunakan `if` dan `raise`                                                     |
| Custom exception mewarisi `BaseException`                          | Tidak tertangkap `except Exception`; salah kelompok             | Mewarisi `Exception` atau base exception domain                              |
| Sumber daya tidak ditutup ketika terjadi error                     | File atau kunci tetap terbuka                                   | Gunakan `with` atau `finally`                                                |

---

## M. RINGKASAN DAN PEMERIKSAAN PEMAHAMAN

| Konsep                 | Inti yang perlu diingat                                                             |
| :--------------------- | :---------------------------------------------------------------------------------- |
| Exception              | Object yang mewakili kegagalan saat program berjalan                                |
| Traceback              | Baca dari bawah: jenis dan pesan, lalu lokasi, lalu urutan pemanggilan              |
| `try`/`except`         | Tangani hanya jenis exception yang diharapkan                                       |
| `else`                 | Lanjutan ketika `try` berhasil; menjaga `try` tetap sempit                          |
| `finally`              | Selalu dijalankan; cocok untuk pembersihan                                          |
| `raise`                | Membangkitkan exception saat kontrak tidak dapat dipenuhi                           |
| Custom exception       | Subclass `Exception` yang memberi nama dan data pada kegagalan domain               |
| `raise ... from ...`   | Menerjemahkan error teknis menjadi error domain sambil menyimpan penyebab           |
| Jaminan kuat           | Operasi gagal tidak meninggalkan perubahan sebagian                                 |
| Context manager        | `__enter__`/`__exit__` menjamin sumber daya dilepas melalui `with`                  |
| Lapisan penanganan     | Model/service membangkitkan; antarmuka menangkap dan menampilkan                    |

### Pertanyaan pemeriksaan

1. Mengapa `except Exception: pass` dapat membuat bug sulit ditemukan?
2. Apa perbedaan perilaku blok `else` dan `finally` ketika blok `try` berhasil, gagal dan ditangani, serta gagal dan tidak ditangani?
3. Kapan Anda memilih `ValueError` dan kapan membuat custom exception?
4. Apa manfaat base exception domain seperti `PraktikumError` bagi pemanggil?
5. Apa isi atribut `__cause__` setelah `raise FormatBarisSalah(...) from error`?
6. Mengapa setter perlu memvalidasi sebelum menyimpan nilai baru?
7. Pada operasi pemindahan kuota, mengapa rollback harus diikuti `raise`?
8. Mengapa service sebaiknya tidak mencetak pesan error secara langsung?
