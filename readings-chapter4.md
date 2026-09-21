---
title: Chapter 4
layout: default
parent: Readings
printtitle: Modul 4 - Class Method, Static Method, dan Decorator
nav_order: 4
---

# MODUL 4

## CLASS METHOD, STATIC METHOD, DAN DECORATOR

Modul ini membahas jenis-jenis method pada class Python di luar instance method, yaitu class method dan static method. Modul ini juga membahas decorator, mulai dari konsep dasar, pembuatan custom decorator, penggunaan `*args` dan `**kwargs` pada wrapper, hingga chaining decorator dan urutan eksekusinya.

Setiap latihan pada modul ini sudah berisi base structure. Bagian yang perlu dikerjakan ditandai dengan komentar `# TODO`. Bagian lain, terutama program utama, tidak perlu diubah.

---

## A. CAPAIAN PEMBELAJARAN

Setelah mempelajari modul ini, mahasiswa diharapkan mampu:

1. Membedakan instance method, class method, dan static method.
2. Membuat class method dengan decorator `@classmethod` dan parameter `cls`.
3. Menggunakan class method sebagai factory method untuk membuat object.
4. Membuat static method dengan decorator `@staticmethod` untuk logika yang tidak bergantung pada object.
5. Menjelaskan cara kerja decorator sebagai pembungkus function.
6. Membuat custom decorator dengan wrapper yang menerima `*args` dan `**kwargs`.
7. Memasang lebih dari satu decorator pada satu function serta menjelaskan urutan eksekusinya.

---

## B. PENDAHULUAN

Pada modul sebelumnya, seluruh method yang dibuat merupakan instance method. Instance method memiliki parameter pertama `self` dan bekerja pada satu object tertentu.

Namun, tidak semua perilaku berkaitan dengan satu object. Ada perilaku yang berkaitan dengan class secara keseluruhan, misalnya menghitung berapa banyak object yang sudah dibuat atau menyediakan cara alternatif untuk membuat object. Ada pula perilaku yang hanya merupakan aturan umum, misalnya memeriksa apakah sebuah kode transaksi memiliki format yang benar. Aturan tersebut tidak membutuhkan data object mana pun.

Sebagai gambaran, sebuah program pencatat pembayaran menerima data transaksi dalam bentuk satu baris teks, misalnya `"Budi 150000 TRANSFER_VALID P001"`. Program tersebut perlu mengubah teks menjadi object, memeriksa format kode pembayaran, lalu memverifikasi pembayaran. Setiap kebutuhan tersebut cocok diselesaikan dengan jenis method yang berbeda.

Python juga menyediakan decorator, yaitu cara untuk menambah atau mengubah perilaku sebuah function tanpa mengubah isi function aslinya. `@classmethod`, `@staticmethod`, dan `@property` pada modul sebelumnya merupakan decorator bawaan Python.

---

## C. TIGA JENIS METHOD

### 1. Perbandingan singkat

| Jenis | Decorator | Parameter pertama | Mengakses |
|:--|:--|:--|:--|
| Instance method | - | `self` | Data satu object |
| Class method | `@classmethod` | `cls` | Data class, membuat object baru |
| Static method | `@staticmethod` | tidak ada | Hanya parameternya sendiri |

```python
class Pembayaran:
    total_verifikasi = 0

    def __init__(self, nama, nominal, bukti, kode):
        self.nama = nama
        self.nominal = nominal
        self.bukti = bukti
        self.kode = kode

    def ringkasan(self):
        return f"{self.nama} membayar {self.nominal}"

    @classmethod
    def jumlah_verifikasi(cls):
        return cls.total_verifikasi

    @staticmethod
    def kode_valid(kode):
        return len(kode) == 4 and kode[0] == "P" and kode[1:].isdigit()
```

`ringkasan()` membutuhkan data satu object. `jumlah_verifikasi()` membutuhkan data class. `kode_valid()` tidak membutuhkan keduanya.

{% capture m4_tiga_jenis %}class Pembayaran:
    total_verifikasi = 0

    def __init__(self, nama, nominal):
        self.nama = nama
        self.nominal = nominal

    def ringkasan(self):
        # TODO: kembalikan teks "<nama> membayar <nominal>"
        pass

    @classmethod
    def jumlah_verifikasi(cls):
        # TODO: kembalikan nilai class attribute total_verifikasi melalui cls
        pass

    @staticmethod
    def nominal_wajar(nominal):
        # TODO: kembalikan True jika nominal lebih besar dari nol
        pass


# Program utama
pembayaran = Pembayaran("Budi", 150000)
print(pembayaran.ringkasan())
print(Pembayaran.jumlah_verifikasi())
print(Pembayaran.nominal_wajar(150000))
print(Pembayaran.nominal_wajar(0))
# Output yang diharapkan:
# Budi membayar 150000
# 0
# True
# False
{% endcapture %}
{% include pyodide-exercise.html id="m4-tiga-jenis-method" title="Membandingkan tiga jenis method" prompt="Lengkapi satu instance method, satu class method, dan satu static method pada class yang sama. Perhatikan method mana yang membutuhkan object." starter=m4_tiga_jenis %}

---

## D. CLASS METHOD

### 1. Pengertian class method

Class method adalah method yang bekerja pada level class, bukan pada object tertentu. Class method ditandai dengan decorator `@classmethod` dan parameter pertamanya adalah `cls`.

Parameter `cls` mengacu pada class itu sendiri, seperti `self` yang mengacu pada object. Ketika class method dipanggil melalui `Pembayaran.jumlah_verifikasi()`, Python mengisi `cls` dengan class `Pembayaran` secara otomatis.

```python
class Pembayaran:
    total_verifikasi = 0

    @classmethod
    def jumlah_verifikasi(cls):
        return cls.total_verifikasi

    @classmethod
    def reset_counter(cls):
        cls.total_verifikasi = 0

print(Pembayaran.jumlah_verifikasi())
```

Output yang diharapkan:

```text
0
```

{% capture m4_counter %}class Pembayaran:
    # TODO: buat class attribute total_object dengan nilai awal 0
    pass

    def __init__(self, nama, nominal):
        self.nama = nama
        self.nominal = nominal
        # TODO: tambah nilai total_object melalui nama class

    @classmethod
    def jumlah_object(cls):
        # TODO: kembalikan nilai total_object melalui cls
        pass

    @classmethod
    def reset_counter(cls):
        # TODO: kembalikan nilai total_object menjadi 0 melalui cls
        pass


# Program utama
Pembayaran("Budi", 150000)
Pembayaran("Sari", 200000)
print(Pembayaran.jumlah_object())
Pembayaran.reset_counter()
print(Pembayaran.jumlah_object())
# Output yang diharapkan:
# 2
# 0
{% endcapture %}
{% include pyodide-exercise.html id="m4-class-attribute-counter" title="Counter pada level class" prompt="Lengkapi class attribute sebagai penghitung jumlah object, tambah nilainya di dalam __init__(), lalu baca dan reset nilainya melalui class method." starter=m4_counter %}

### 2. Class method sebagai factory method

Penggunaan class method yang paling sering ditemui adalah factory method, yaitu method yang menyediakan cara alternatif untuk membuat object. Class method tersebut membuat object melalui `cls(...)`.

```python
class Pembayaran:
    def __init__(self, nama, nominal, bukti, kode):
        self.nama = nama
        self.nominal = nominal
        self.bukti = bukti
        self.kode = kode

    @classmethod
    def dari_teks(cls, teks):
        nama, nominal, bukti, kode = teks.split()
        nominal = int(nominal)
        return cls(nama, nominal, bukti, kode)

pembayaran = Pembayaran.dari_teks("Budi 150000 TRANSFER_VALID P001")
print(pembayaran.nama, pembayaran.nominal)
```

Output yang diharapkan:

```text
Budi 150000
```

`teks.split()` memecah satu baris teks menjadi beberapa bagian. `int(nominal)` mengubah bagian nominal dari `str` menjadi `int`. `cls(...)` memanggil `__init__()` dan mengembalikan object baru.

{% capture m4_factory %}class Pembayaran:
    def __init__(self, nama, nominal, bukti, kode):
        self.nama = nama
        self.nominal = nominal
        self.bukti = bukti
        self.kode = kode

    @classmethod
    def dari_teks(cls, teks):
        # TODO: pecah teks menjadi nama, nominal, bukti, dan kode
        # TODO: ubah nominal menjadi int
        # TODO: kembalikan object baru melalui cls(...)
        pass


# Program utama
pembayaran = Pembayaran.dari_teks("Budi 150000 TRANSFER_VALID P001")
print(pembayaran.nama)
print(pembayaran.nominal)
print(type(pembayaran.nominal))
print(pembayaran.kode)
# Output yang diharapkan:
# Budi
# 150000
# <class 'int'>
# P001
{% endcapture %}
{% include pyodide-exercise.html id="m4-factory-dari-teks" title="Factory method dari teks" prompt="Lengkapi class method dari_teks(cls, teks) agar memecah satu baris teks, mengubah tipe data yang perlu diubah, lalu mengembalikan object melalui cls(...)." starter=m4_factory %}

### 3. Mengapa menggunakan `cls(...)` dan bukan nama class

Penulisan `cls(...)` membuat class method tetap benar ketika class dikembangkan. Jika class method menuliskan nama class secara langsung, method tersebut akan selalu membuat object dari class yang namanya ditulis, meskipun dipanggil melalui class turunan.

```python
    @classmethod
    def dari_teks(cls, teks):
        # Gunakan cls(...), bukan Pembayaran(...)
        return cls(*teks.split())
```

{% capture m4_factory_format %}class Pembayaran:
    def __init__(self, nama, nominal, kode):
        self.nama = nama
        self.nominal = nominal
        self.kode = kode

    def ringkasan(self):
        return f"{self.nama} - {self.nominal} - {self.kode}"

    @classmethod
    def dari_teks(cls, teks):
        # TODO: teks dipisah spasi, contoh "Budi 150000 P001"
        pass

    @classmethod
    def dari_csv(cls, baris):
        # TODO: baris dipisah koma, contoh "Sari,200000,P002"
        pass


# Program utama
a = Pembayaran.dari_teks("Budi 150000 P001")
b = Pembayaran.dari_csv("Sari,200000,P002")
print(a.ringkasan())
print(b.ringkasan())
# Output yang diharapkan:
# Budi - 150000 - P001
# Sari - 200000 - P002
{% endcapture %}
{% include pyodide-exercise.html id="m4-factory-beberapa-format" title="Beberapa factory method" prompt="Lengkapi dua class method pada satu class, yaitu dari_teks() untuk input dipisah spasi dan dari_csv() untuk input dipisah koma. Keduanya harus mengembalikan object melalui cls(...)." starter=m4_factory_format %}

### 4. Validasi di dalam factory method

Factory method dapat menolak input yang tidak sesuai sebelum object dibuat.

```python
class Pembayaran:
    def __init__(self, nama, nominal, bukti, kode):
        self.nama = nama
        self.nominal = nominal
        self.bukti = bukti
        self.kode = kode

    @classmethod
    def dari_teks(cls, teks):
        bagian = teks.split()
        if len(bagian) != 4:
            raise ValueError("Format teks pembayaran tidak lengkap.")
        nama, nominal, bukti, kode = bagian
        if not nominal.isdigit():
            raise ValueError("Nominal harus berupa angka.")
        return cls(nama, int(nominal), bukti, kode)
```

{% capture m4_factory_validasi %}class Pembayaran:
    def __init__(self, nama, nominal, bukti, kode):
        self.nama = nama
        self.nominal = nominal
        self.bukti = bukti
        self.kode = kode

    @classmethod
    def dari_teks(cls, teks):
        bagian = teks.split()
        # TODO: raise ValueError jika jumlah bagian bukan 4
        # TODO: raise ValueError jika bagian nominal bukan angka
        # TODO: kembalikan object melalui cls(...) dengan nominal bertipe int
        pass


# Program utama
data = [
    "Budi 150000 TRANSFER_VALID P001",
    "Sari 200000 TRANSFER_VALID",
    "Rian abcdef TRANSFER_VALID P003",
]

for teks in data:
    try:
        pembayaran = Pembayaran.dari_teks(teks)
        print("OK", pembayaran.nama, pembayaran.nominal)
    except ValueError as error:
        print("GAGAL", error)
# Output yang diharapkan:
# OK Budi 150000
# GAGAL Format teks pembayaran tidak lengkap.
# GAGAL Nominal harus berupa angka.
{% endcapture %}
{% include pyodide-exercise.html id="m4-factory-validasi" title="Factory method dengan validasi" prompt="Tambahkan pemeriksaan jumlah bagian dan tipe data pada factory method, lalu raise ValueError ketika input tidak sesuai format." starter=m4_factory_validasi %}

---

## E. STATIC METHOD

### 1. Pengertian static method

Static method adalah method yang tidak bergantung pada object maupun class. Static method ditandai dengan decorator `@staticmethod`, tidak menggunakan `self`, dan tidak menggunakan `cls`.

Static method diletakkan di dalam class karena secara makna berkaitan dengan class tersebut, meskipun tidak membutuhkan datanya.

```python
class Pembayaran:
    @staticmethod
    def kode_valid(kode):
        return (
            len(kode) == 4
            and kode[0] == "P"
            and kode[1:].isdigit()
        )

print(Pembayaran.kode_valid("P001"))
print(Pembayaran.kode_valid("P12"))
print(Pembayaran.kode_valid("X001"))
```

Hasil pemeriksaan tersebut adalah:

```text
True
False
False
```

Method `kode_valid()` hanya membutuhkan data `kode` yang diberikan melalui parameter. Method tersebut memeriksa tiga hal, yaitu panjang kode harus 4 karakter, karakter pertama harus `P`, dan tiga karakter terakhir harus digit.

{% capture m4_static_kode %}class Pembayaran:
    @staticmethod
    def kode_valid(kode):
        # TODO: kembalikan True hanya jika ketiga syarat terpenuhi
        # 1. panjang kode tepat 4 karakter
        # 2. karakter pertama adalah "P"
        # 3. tiga karakter terakhir berupa digit
        pass


# Program utama
for kode in ["P001", "P123", "P12", "X001", "PABC"]:
    print(kode, Pembayaran.kode_valid(kode))
# Output yang diharapkan:
# P001 True
# P123 True
# P12 False
# X001 False
# PABC False
{% endcapture %}
{% include pyodide-exercise.html id="m4-static-kode-valid" title="Static method untuk validasi kode" prompt="Lengkapi static method kode_valid(kode) yang memeriksa panjang kode, karakter pertama, dan apakah sisa karakternya berupa digit." starter=m4_static_kode %}

### 2. Memanggil static method

Static method dapat dipanggil melalui nama class maupun melalui object.

```python
print(Pembayaran.kode_valid("P001"))

pembayaran = Pembayaran("Budi", 150000, "TRANSFER_VALID", "P001")
print(pembayaran.kode_valid(pembayaran.kode))
```

Output yang diharapkan:

```text
True
True
```

Pemanggilan melalui object tetap tidak mengirimkan `self`. Static method hanya menerima argument yang dituliskan.

{% capture m4_static_instance %}class Pembayaran:
    def __init__(self, nama, nominal, kode):
        self.nama = nama
        self.nominal = nominal
        self.kode = kode

    @staticmethod
    def kode_valid(kode):
        return len(kode) == 4 and kode[0] == "P" and kode[1:].isdigit()

    def verifikasi(self):
        # TODO: panggil static method melalui self.kode_valid(self.kode)
        # TODO: kembalikan True jika kode valid dan nominal lebih besar dari nol
        pass


# Program utama
print(Pembayaran("Budi", 150000, "P001").verifikasi())
print(Pembayaran("Sari", 0, "P002").verifikasi())
print(Pembayaran("Rian", 200000, "X9").verifikasi())
# Output yang diharapkan:
# True
# False
# False
{% endcapture %}
{% include pyodide-exercise.html id="m4-static-dari-instance" title="Memanggil static method dari instance method" prompt="Panggil static method dari dalam instance method menggunakan self.nama_static_method(...), lalu gunakan hasilnya sebagai bagian dari pemeriksaan." starter=m4_static_instance %}

### 3. Memilih class method atau static method

Pertanyaan yang dapat digunakan adalah apakah method tersebut membutuhkan class atau tidak.

1. Jika method membuat object atau membaca class attribute, gunakan class method.
2. Jika method hanya mengolah parameternya sendiri, gunakan static method.
3. Jika method membaca atau mengubah data satu object, gunakan instance method.

{% capture m4_pilih_method %}class Pembayaran:
    def __init__(self, nama, nominal, kode):
        self.nama = nama
        self.nominal = nominal
        self.kode = kode

    # TODO: lengkapi sebagai factory method, pilih decorator yang tepat
    def dari_teks(teks):
        pass

    # TODO: lengkapi sebagai validasi format kode, pilih decorator yang tepat
    def kode_valid(kode):
        pass

    # TODO: lengkapi sebagai instance method yang mengembalikan
    # teks "<nama> - <nominal> - <kode>"
    def ringkasan():
        pass


# Program utama
pembayaran = Pembayaran.dari_teks("Budi 150000 P001")
print(pembayaran.ringkasan())
print(Pembayaran.kode_valid("P001"))
# Output yang diharapkan:
# Budi - 150000 - P001
# True
{% endcapture %}
{% include pyodide-exercise.html id="m4-memilih-jenis-method" title="Memilih jenis method yang tepat" prompt="Tentukan decorator dan parameter pertama yang tepat untuk setiap method, yaitu factory method, validasi format, dan ringkasan object." starter=m4_pilih_method %}

---

## F. KONSEP DECORATOR

### 1. Function sebagai object

Decorator dapat dipahami setelah mengetahui bahwa function pada Python merupakan object. Function dapat disimpan dalam variable, dikirim sebagai argument, dan dikembalikan oleh function lain.

```python
def sapa():
    return "halo"

alias = sapa
print(alias())
```

Output yang diharapkan:

```text
halo
```

{% capture m4_function_object %}def sapa():
    return "halo"


def jalankan(func):
    # TODO: jalankan func lalu kembalikan hasilnya
    pass


# TODO: simpan function sapa ke dalam variable alias tanpa tanda kurung
alias = None

# Program utama
print(alias.__name__)
print(alias())
print(jalankan(sapa))
# Output yang diharapkan:
# sapa
# halo
# halo
{% endcapture %}
{% include pyodide-exercise.html id="m4-function-object" title="Function sebagai object" prompt="Simpan sebuah function ke dalam variable tanpa tanda kurung, lalu kirim function tersebut sebagai argument ke function lain." starter=m4_function_object %}

### 2. Bentuk dasar decorator

Decorator adalah fitur Python untuk menambahkan atau mengubah perilaku sebuah function tanpa mengubah function aslinya. Decorator membungkus function asli dengan function lain yang disebut wrapper.

```python
def decorator(func):
    def wrapper(*args, **kwargs):
        # proses tambahan sebelum function asli
        hasil = func(*args, **kwargs)
        # proses tambahan setelah function asli
        return hasil

    return wrapper

@decorator
def verifikasi():
    return True

print(verifikasi())
```

Output yang diharapkan:

```text
True
```

Bagian-bagian penting pada kode tersebut adalah:

1. Function asli disimpan dalam parameter `func`.
2. `wrapper()` menjadi pembungkus function.
3. Function asli dijalankan melalui `func(*args, **kwargs)`.
4. Proses tambahan dapat diletakkan sebelum atau sesudah function asli dijalankan.
5. Isi function asli tidak perlu diubah.

{% capture m4_decorator_dasar %}def decorator(func):
    def wrapper(*args, **kwargs):
        # TODO: cetak "mulai" sebelum function asli dijalankan
        # TODO: jalankan function asli dan simpan hasilnya
        # TODO: cetak "selesai" setelah function asli dijalankan
        # TODO: kembalikan hasil function asli
        pass

    # TODO: kembalikan wrapper, bukan wrapper()
    pass


@decorator
def verifikasi():
    print("function asli berjalan")
    return True


# Program utama
hasil = verifikasi()
print(hasil)
# Output yang diharapkan:
# mulai
# function asli berjalan
# selesai
# True
{% endcapture %}
{% include pyodide-exercise.html id="m4-decorator-dasar" title="Decorator pertama" prompt="Lengkapi decorator agar mencetak satu baris sebelum dan sesudah function asli dijalankan, lalu kembalikan nilai function asli tanpa mengubahnya." starter=m4_decorator_dasar %}

### 3. Arti sintaks `@`

Penulisan `@decorator` di atas `def` merupakan bentuk singkat dari penugasan ulang nama function.

```python
@decorator
def verifikasi():
    return True
```

Kode tersebut memiliki arti yang sama dengan:

```python
def verifikasi():
    return True

verifikasi = decorator(verifikasi)
```

Nama `verifikasi` sekarang mengacu pada `wrapper`, bukan pada function asli. Function asli tetap ada dan tersimpan dalam parameter `func`.

{% capture m4_decorator_manual %}def decorator(func):
    def wrapper(*args, **kwargs):
        print("wrapper berjalan")
        return func(*args, **kwargs)

    return wrapper


def verifikasi():
    return True


# TODO: terapkan decorator secara manual tanpa sintaks @
verifikasi = None


@decorator
def verifikasi_dengan_at():
    return True


# Program utama
print(verifikasi())
print(verifikasi_dengan_at())
# Output yang diharapkan:
# wrapper berjalan
# True
# wrapper berjalan
# True
{% endcapture %}
{% include pyodide-exercise.html id="m4-decorator-manual" title="Decorator tanpa sintaks @" prompt="Terapkan decorator secara manual dengan penulisan nama_function = decorator(nama_function), lalu bandingkan hasilnya dengan penggunaan sintaks @." starter=m4_decorator_manual %}

---

## G. CUSTOM DECORATOR

### 1. Decorator yang mengubah hasil

Custom decorator adalah decorator yang dibuat sendiri. Contoh berikut memastikan hasil function selalu berupa boolean.

```python
def hasil_boolean(func):
    def wrapper(*args, **kwargs):
        hasil = func(*args, **kwargs)
        return bool(hasil)

    return wrapper

@hasil_boolean
def cek_nominal(nominal):
    return nominal

print(cek_nominal(150000))
print(cek_nominal(0))
```

Hasil yang dicetak adalah:

```text
True
False
```

Function asli tetap dijalankan. Hasilnya disimpan dalam `hasil`, lalu `bool(hasil)` mengubah hasil tersebut menjadi `True` atau `False`.

{% capture m4_hasil_boolean %}def hasil_boolean(func):
    def wrapper(*args, **kwargs):
        # TODO: jalankan function asli dan simpan hasilnya
        # TODO: kembalikan hasil tersebut dalam bentuk boolean
        pass

    return wrapper


@hasil_boolean
def cek_nominal(nominal):
    return nominal


@hasil_boolean
def cek_bukti(bukti):
    return bukti


# Program utama
print(cek_nominal(150000))
print(cek_nominal(0))
print(cek_bukti("TRANSFER_VALID"))
print(cek_bukti(""))
# Output yang diharapkan:
# True
# False
# True
# False
{% endcapture %}
{% include pyodide-exercise.html id="m4-decorator-hasil-boolean" title="Decorator hasil_boolean" prompt="Lengkapi decorator hasil_boolean agar nilai kembalian function selalu berupa True atau False. Uji dengan function yang mengembalikan angka dan string." starter=m4_hasil_boolean %}

### 2. Decorator yang menambah perilaku

Decorator berikut menambah counter setiap kali function dijalankan, tanpa mengubah isi function aslinya.

```python
class Pembayaran:
    total_verifikasi = 0

def hitung_verifikasi(func):
    def wrapper(*args, **kwargs):
        hasil = func(*args, **kwargs)
        Pembayaran.total_verifikasi += 1
        return hasil

    return wrapper
```

Counter diubah melalui nama class, yaitu `Pembayaran.total_verifikasi`, sehingga nilainya dibagikan untuk seluruh object.

{% capture m4_decorator_counter %}def hitung_verifikasi(func):
    def wrapper(*args, **kwargs):
        # TODO: jalankan function asli dan simpan hasilnya
        # TODO: tambah Pembayaran.total_verifikasi sebanyak satu
        # TODO: kembalikan hasil function asli
        pass

    return wrapper


class Pembayaran:
    total_verifikasi = 0

    def __init__(self, nama, nominal):
        self.nama = nama
        self.nominal = nominal

    @hitung_verifikasi
    def verifikasi(self):
        return self.nominal > 0


# Program utama
print(Pembayaran("Budi", 150000).verifikasi())
print(Pembayaran("Sari", 0).verifikasi())
print(Pembayaran.total_verifikasi)
# Output yang diharapkan:
# True
# False
# 2
{% endcapture %}
{% include pyodide-exercise.html id="m4-decorator-counter" title="Decorator penghitung pemanggilan" prompt="Lengkapi decorator agar menambah class attribute counter setiap kali method dipanggil, tanpa mengubah nilai kembalian method." starter=m4_decorator_counter %}

### 3. Decorator untuk mencatat pemanggilan

```python
def catat(func):
    def wrapper(*args, **kwargs):
        print(f"[LOG] menjalankan {func.__name__}")
        hasil = func(*args, **kwargs)
        print(f"[LOG] hasil {hasil}")
        return hasil

    return wrapper

@catat
def hitung_total(nominal, biaya_admin=0):
    return nominal + biaya_admin

print(hitung_total(150000, biaya_admin=2500))
```

Output yang diharapkan:

```text
[LOG] menjalankan hitung_total
[LOG] hasil 152500
152500
```

{% capture m4_decorator_log %}def catat(func):
    def wrapper(*args, **kwargs):
        # TODO: cetak "[LOG] menjalankan <nama function>" dengan func.__name__
        # TODO: jalankan function asli dan simpan hasilnya
        # TODO: cetak "[LOG] hasil <hasil>"
        # TODO: kembalikan hasil
        pass

    return wrapper


@catat
def hitung_total(nominal, biaya_admin=0):
    return nominal + biaya_admin


# Program utama
print(hitung_total(150000))
print(hitung_total(150000, biaya_admin=2500))
# Output yang diharapkan:
# [LOG] menjalankan hitung_total
# [LOG] hasil 150000
# 150000
# [LOG] menjalankan hitung_total
# [LOG] hasil 152500
# 152500
{% endcapture %}
{% include pyodide-exercise.html id="m4-decorator-log" title="Decorator pencatat" prompt="Lengkapi decorator agar mencetak nama function sebelum dijalankan dan nilai kembaliannya setelah dijalankan. Gunakan func.__name__ untuk membaca nama function asli." starter=m4_decorator_log %}

---

## H. `*args` DAN `**kwargs` PADA WRAPPER

### 1. Pengertian

`*args` menampung positional argument dalam bentuk tuple. `**kwargs` menampung keyword argument dalam bentuk dictionary. Keduanya membuat wrapper dapat menerima pemanggilan dengan bentuk argument apa pun.

```python
def tampilkan(*args, **kwargs):
    print(args)
    print(kwargs)

tampilkan(150000, "P001", catatan="otomatis")
```

Hasilnya menyerupai berikut:

```text
(150000, 'P001')
{'catatan': 'otomatis'}
```

{% capture m4_args_kwargs %}def tampilkan(*args, **kwargs):
    # TODO: cetak isi args dengan print(args)
    # TODO: cetak isi kwargs dengan print(kwargs)
    # TODO: cetak jumlah positional argument dengan print(len(args))
    pass


# Program utama
tampilkan(150000, "P001", catatan="otomatis")
tampilkan("Budi")
tampilkan(status="VALID", petugas="Obie")
# Output yang diharapkan:
# (150000, 'P001')
# {'catatan': 'otomatis'}
# 2
# ('Budi',)
# {}
# 1
# ()
# {'status': 'VALID', 'petugas': 'Obie'}
# 0
{% endcapture %}
{% include pyodide-exercise.html id="m4-args-kwargs-dasar" title="Mengenal *args dan **kwargs" prompt="Lengkapi function agar mencetak isi args dan kwargs, lalu amati bentuk datanya ketika dipanggil dengan campuran positional dan keyword argument." starter=m4_args_kwargs %}

### 2. Meneruskan argument ke function asli

Wrapper harus meneruskan seluruh argument yang diterimanya ke function asli melalui `func(*args, **kwargs)`. Dengan demikian, decorator tidak menghilangkan parameter function.

```python
def decorator(func):
    def wrapper(*args, **kwargs):
        return func(*args, **kwargs)

    return wrapper

class Pembayaran:
    def __init__(self, nama, nominal):
        self.nama = nama
        self.nominal = nominal

    @decorator
    def verifikasi(self, catatan=""):
        return f"{self.nama} {catatan}".strip()

pembayaran = Pembayaran("Budi", 150000)
print(pembayaran.verifikasi(catatan="otomatis"))
```

Output yang diharapkan:

```text
Budi otomatis
```

Ketika `verifikasi()` dipasangi decorator, `self` masuk ke `args` dan `catatan="otomatis"` masuk ke `kwargs`. Karena wrapper meneruskan keduanya, nilai `catatan` tetap sampai ke function asli.

{% capture m4_kwargs_teruskan %}def decorator(func):
    def wrapper(*args, **kwargs):
        print("jumlah args:", len(args))
        print("kwargs:", kwargs)
        # TODO: teruskan seluruh argument ke function asli, lalu kembalikan hasilnya
        pass

    return wrapper


class Pembayaran:
    def __init__(self, nama, nominal):
        self.nama = nama
        self.nominal = nominal

    @decorator
    def verifikasi(self, catatan=""):
        return f"{self.nama} diverifikasi {catatan}".strip()


# Program utama
pembayaran = Pembayaran("Budi", 150000)
print(pembayaran.verifikasi())
print(pembayaran.verifikasi(catatan="otomatis"))
# Output yang diharapkan:
# jumlah args: 1
# kwargs: {}
# Budi diverifikasi
# jumlah args: 1
# kwargs: {'catatan': 'otomatis'}
# Budi diverifikasi otomatis
{% endcapture %}
{% include pyodide-exercise.html id="m4-kwargs-diteruskan" title="Meneruskan keyword argument" prompt="Lengkapi wrapper agar meneruskan seluruh argument ke function asli. Pastikan nilai catatan tetap sampai ketika method dipanggil dengan keyword argument." starter=m4_kwargs_teruskan %}

### 3. Wrapper tanpa `*args` dan `**kwargs`

Wrapper yang ditulis tanpa `*args` dan `**kwargs` akan membatasi bentuk pemanggilan function.

```python
def decorator_salah(func):
    def wrapper():
        return func()

    return wrapper
```

Wrapper tersebut hanya dapat menerima pemanggilan tanpa argument. Ketika dipasang pada method, pemanggilan akan gagal karena `self` tidak dapat diterima.

{% capture m4_wrapper_tanpa_args %}def decorator_salah(func):
    def wrapper():
        return func()

    return wrapper


def decorator_benar(func):
    def wrapper(*args, **kwargs):
        # TODO: teruskan seluruh argument ke function asli
        pass

    return wrapper


class Pembayaran:
    def __init__(self, nama):
        self.nama = nama

    @decorator_salah
    def verifikasi_salah(self, catatan=""):
        return f"{self.nama} {catatan}".strip()

    # TODO: pasang decorator_benar pada method di bawah ini
    def verifikasi_benar(self, catatan=""):
        return f"{self.nama} {catatan}".strip()


# Program utama
pembayaran = Pembayaran("Budi")

try:
    print(pembayaran.verifikasi_salah(catatan="otomatis"))
except TypeError as error:
    print("TypeError:", error)

print(pembayaran.verifikasi_benar(catatan="otomatis"))
# Output yang diharapkan:
# TypeError: decorator_salah.<locals>.wrapper() got an unexpected
# keyword argument 'catatan'
# Budi otomatis
# (teks pesan error dapat sedikit berbeda antarversi Python)
{% endcapture %}
{% include pyodide-exercise.html id="m4-wrapper-tanpa-args" title="Akibat wrapper tanpa *args" prompt="Jalankan kode untuk melihat error dari wrapper tanpa *args dan **kwargs, lalu lengkapi decorator_benar dan pasang pada method yang kedua." starter=m4_wrapper_tanpa_args %}

---

## I. CHAINING DECORATOR

### 1. Memasang lebih dari satu decorator

Satu function dapat menggunakan lebih dari satu decorator. Decorator ditulis bertingkat di atas `def`.

```python
class Pembayaran:
    total_verifikasi = 0

    def __init__(self, nama, nominal, bukti, kode):
        self.nama = nama
        self.nominal = nominal
        self.bukti = bukti
        self.kode = kode
        self.__status = "BELUM"

    @staticmethod
    def kode_valid(kode):
        return len(kode) == 4 and kode[0] == "P" and kode[1:].isdigit()

    @hitung_verifikasi
    @hasil_boolean
    def verifikasi(self, catatan=""):
        if (
            self.nominal > 0
            and self.kode_valid(self.kode)
            and self.bukti == "TRANSFER_VALID"
        ):
            self.__status = "VALID"
            return True

        self.__status = "DITOLAK"
        return False
```

### 2. Urutan pembungkusan

Decorator dibaca dari bawah ke atas saat pembungkusan. Pada contoh tersebut, `verifikasi()` dibungkus terlebih dahulu oleh `hasil_boolean`, kemudian hasilnya dibungkus lagi oleh `hitung_verifikasi`.

```text
verifikasi() -> hasil_boolean -> hitung_verifikasi
```

Bentuk tersebut setara dengan penulisan berikut:

```python
verifikasi = hitung_verifikasi(hasil_boolean(verifikasi))
```

### 3. Urutan eksekusi

Saat method dipanggil, wrapper paling luar berjalan lebih dahulu. Wrapper paling luar adalah wrapper dari decorator yang ditulis paling atas.

```python
def luar(func):
    def wrapper(*args, **kwargs):
        print("mulai luar")
        hasil = func(*args, **kwargs)
        print("selesai luar")
        return hasil

    return wrapper

def dalam(func):
    def wrapper(*args, **kwargs):
        print("mulai dalam")
        hasil = func(*args, **kwargs)
        print("selesai dalam")
        return hasil

    return wrapper

@luar
@dalam
def proses():
    print("function asli")

proses()
```

Urutan cetak yang dihasilkan adalah:

```text
mulai luar
mulai dalam
function asli
selesai dalam
selesai luar
```

{% capture m4_urutan %}def luar(func):
    def wrapper(*args, **kwargs):
        # TODO: cetak "mulai luar", jalankan function asli, cetak "selesai luar"
        # TODO: kembalikan hasil function asli
        pass

    return wrapper


def dalam(func):
    def wrapper(*args, **kwargs):
        # TODO: cetak "mulai dalam", jalankan function asli, cetak "selesai dalam"
        # TODO: kembalikan hasil function asli
        pass

    return wrapper


@luar
@dalam
def proses():
    print("function asli")
    return "selesai"


# Program utama
print(proses())

# TODO: tukar urutan penulisan @luar dan @dalam, lalu jalankan kembali
# Output yang diharapkan:
# mulai luar
# mulai dalam
# function asli
# selesai dalam
# selesai luar
# selesai
{% endcapture %}
{% include pyodide-exercise.html id="m4-urutan-decorator" title="Urutan eksekusi chaining decorator" prompt="Lengkapi dua decorator yang mencetak penanda sebelum dan sesudah function asli. Jalankan, lalu tukar urutan penulisannya dan bandingkan hasilnya." starter=m4_urutan %}

{% capture m4_chaining %}def hitung_verifikasi(func):
    def wrapper(*args, **kwargs):
        hasil = func(*args, **kwargs)
        Pembayaran.total_verifikasi += 1
        return hasil

    return wrapper


def hasil_boolean(func):
    def wrapper(*args, **kwargs):
        hasil = func(*args, **kwargs)
        return bool(hasil)

    return wrapper


class Pembayaran:
    total_verifikasi = 0

    def __init__(self, nama, nominal, bukti, kode):
        self.nama = nama
        self.nominal = nominal
        self.bukti = bukti
        self.kode = kode
        self.__status = "BELUM"

    @property
    def status(self):
        return self.__status

    @staticmethod
    def kode_valid(kode):
        return len(kode) == 4 and kode[0] == "P" and kode[1:].isdigit()

    # TODO: pasang decorator hitung_verifikasi dan hasil_boolean pada method ini
    def verifikasi(self, catatan=""):
        if (
            self.nominal > 0
            and self.kode_valid(self.kode)
            and self.bukti == "TRANSFER_VALID"
        ):
            self.__status = "VALID"
            return True

        self.__status = "DITOLAK"
        return False


# Program utama
a = Pembayaran("Budi", 150000, "TRANSFER_VALID", "P001")
b = Pembayaran("Sari", 0, "TRANSFER_VALID", "P002")

print(a.verifikasi(catatan="otomatis"), a.status)
print(b.verifikasi(catatan="otomatis"), b.status)
print(Pembayaran.total_verifikasi)
# Output yang diharapkan:
# True VALID
# False DITOLAK
# 2
{% endcapture %}
{% include pyodide-exercise.html id="m4-chaining-verifikasi" title="Chaining pada method verifikasi" prompt="Pasang hitung_verifikasi dan hasil_boolean pada method verifikasi. Pastikan hasilnya berupa boolean dan counter class bertambah setiap pemanggilan." starter=m4_chaining %}

---

## J. STUDI KASUS TERPADU

Contoh berikut menggabungkan seluruh materi modul ini pada satu program pencatat pembayaran.

```python
class Pembayaran:
    total_verifikasi = 0

    def __init__(self, nama, nominal, bukti, kode):
        self.nama = nama
        self.nominal = nominal
        self.bukti = bukti
        self.kode = kode
        self.__status = "BELUM"

    @classmethod
    def dari_teks(cls, teks):
        nama, nominal, bukti, kode = teks.split()
        return cls(nama, int(nominal), bukti, kode)

    @staticmethod
    def kode_valid(kode):
        return len(kode) == 4 and kode[0] == "P" and kode[1:].isdigit()

    @property
    def status(self):
        return self.__status

    def verifikasi(self, catatan=""):
        if (
            self.nominal > 0
            and self.kode_valid(self.kode)
            and self.bukti == "TRANSFER_VALID"
        ):
            self.__status = "VALID"
            return True

        self.__status = "DITOLAK"
        return False

pembayaran = Pembayaran.dari_teks("Budi 150000 TRANSFER_VALID P001")
print(pembayaran.verifikasi(catatan="otomatis"))
print(pembayaran.status)
```

Output yang diharapkan:

```text
True
VALID
```

{% capture m4_studi_kasus %}class Pembayaran:
    def __init__(self, nama, nominal, bukti, kode):
        self.nama = nama
        self.nominal = nominal
        self.bukti = bukti
        self.kode = kode
        self.__status = "BELUM"

    @classmethod
    def dari_teks(cls, teks):
        # TODO: buat object dari teks "<nama> <nominal> <bukti> <kode>"
        pass

    @staticmethod
    def kode_valid(kode):
        # TODO: periksa format kode, yaitu 4 karakter, diawali "P", sisanya digit
        pass

    @property
    def status(self):
        # TODO: kembalikan nilai __status
        pass

    def verifikasi(self, catatan=""):
        # TODO: pembayaran valid jika nominal > 0, kode valid,
        # dan bukti sama dengan "TRANSFER_VALID"
        # TODO: ubah __status menjadi "VALID" atau "DITOLAK", lalu kembalikan True atau False
        pass


# Program utama
data = [
    "Budi 150000 TRANSFER_VALID P001",
    "Sari 200000 TRANSFER_PALSU P002",
    "Rian 300000 TRANSFER_VALID X003",
]

for teks in data:
    pembayaran = Pembayaran.dari_teks(teks)
    print(pembayaran.nama, pembayaran.verifikasi(catatan="otomatis"), pembayaran.status)
# Output yang diharapkan:
# Budi True VALID
# Sari False DITOLAK
# Rian False DITOLAK
{% endcapture %}
{% include pyodide-exercise.html id="m4-studi-kasus-pembayaran" title="Program pembayaran lengkap" prompt="Lengkapi factory method dari_teks(), static method kode_valid(), property status, dan method verifikasi() pada satu class Pembayaran." starter=m4_studi_kasus %}

{% capture m4_studi_decorator %}def hasil_boolean(func):
    def wrapper(*args, **kwargs):
        # TODO: kembalikan hasil function asli dalam bentuk boolean
        pass

    return wrapper


def hitung_verifikasi(func):
    def wrapper(*args, **kwargs):
        # TODO: jalankan function asli, tambah Pembayaran.total_verifikasi,
        # lalu kembalikan hasilnya
        pass

    return wrapper


class Pembayaran:
    total_verifikasi = 0

    def __init__(self, nama, nominal, bukti, kode):
        self.nama = nama
        self.nominal = nominal
        self.bukti = bukti
        self.kode = kode

    @classmethod
    def dari_teks(cls, teks):
        nama, nominal, bukti, kode = teks.split()
        return cls(nama, int(nominal), bukti, kode)

    @staticmethod
    def kode_valid(kode):
        return len(kode) == 4 and kode[0] == "P" and kode[1:].isdigit()

    # TODO: pasang kedua decorator pada method verifikasi
    def verifikasi(self, catatan=""):
        return (
            self.nominal > 0
            and self.kode_valid(self.kode)
            and self.bukti == "TRANSFER_VALID"
        )


# Program utama
for teks in ["Budi 150000 TRANSFER_VALID P001", "Sari 0 TRANSFER_VALID P002"]:
    pembayaran = Pembayaran.dari_teks(teks)
    print(pembayaran.nama, pembayaran.verifikasi(catatan="otomatis"))

print("total verifikasi:", Pembayaran.total_verifikasi)
# Output yang diharapkan:
# Budi True
# Sari False
# total verifikasi: 2
{% endcapture %}
{% include pyodide-exercise.html id="m4-studi-kasus-decorator" title="Program pembayaran dengan decorator" prompt="Lengkapi decorator hasil_boolean dan hitung_verifikasi, lalu pasang keduanya pada method verifikasi dan cetak total verifikasi melalui nama class." starter=m4_studi_decorator %}

{% capture m4_banyak_data %}class Pembayaran:
    def __init__(self, nama, nominal, bukti, kode):
        self.nama = nama
        self.nominal = nominal
        self.bukti = bukti
        self.kode = kode

    @classmethod
    def dari_teks(cls, teks):
        nama, nominal, bukti, kode = teks.split()
        return cls(nama, int(nominal), bukti, kode)

    @staticmethod
    def kode_valid(kode):
        return len(kode) == 4 and kode[0] == "P" and kode[1:].isdigit()

    def verifikasi(self):
        return (
            self.nominal > 0
            and self.kode_valid(self.kode)
            and self.bukti == "TRANSFER_VALID"
        )


data = [
    "Budi 150000 TRANSFER_VALID P001",
    "Sari 200000 TRANSFER_PALSU P002",
    "Rian 300000 TRANSFER_VALID X003",
    "Dina 0 TRANSFER_VALID P004",
    "Toni 250000 TRANSFER_VALID P005",
]

# TODO: ubah setiap baris pada data menjadi object melalui factory method
daftar = []

# TODO: hitung jumlah pembayaran yang valid dan yang ditolak
jumlah_valid = 0
jumlah_ditolak = 0

# Program utama
print("valid:", jumlah_valid)
print("ditolak:", jumlah_ditolak)
# Output yang diharapkan:
# valid: 2
# ditolak: 3
{% endcapture %}
{% include pyodide-exercise.html id="m4-studi-kasus-banyak-data" title="Memproses banyak baris data" prompt="Ubah setiap baris teks menjadi object melalui factory method, verifikasi seluruh object, lalu hitung jumlah pembayaran yang valid dan yang ditolak." starter=m4_banyak_data %}

---

## K. RINGKASAN

| Konsep | Penanda | Kegunaan |
|:--|:--|:--|
| Class method | `@classmethod`, `cls` | Membuat object dari format lain, membaca atau mengubah class attribute |
| Static method | `@staticmethod` | Validasi atau perhitungan yang hanya membutuhkan parameternya sendiri |
| Decorator | `@nama_decorator` | Menambah perilaku function tanpa mengubah isi function asli |
| `*args`, `**kwargs` | parameter wrapper | Menerima dan meneruskan argument dalam bentuk apa pun |
| Chaining | beberapa `@` bertingkat | Membungkus function lebih dari satu kali, dibaca dari bawah ke atas |

Hal yang perlu diperhatikan saat membuat decorator:

1. Wrapper selalu ditulis dengan `*args` dan `**kwargs`.
2. Function asli dijalankan melalui `func(*args, **kwargs)`.
3. Decorator mengembalikan `wrapper`, bukan `wrapper()`.
4. Nilai kembalian function asli harus dikembalikan kecuali decorator memang bertujuan mengubahnya.
