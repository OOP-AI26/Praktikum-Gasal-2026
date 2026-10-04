---
title: Chapter 6
layout: default
parent: Readings
printtitle: Modul 6 - Abstract Method, Data Class, Mutability, dan Typing Style
nav_order: 6
---

# MODUL 6

## ABSTRACT METHOD, DATA CLASS, MUTABILITY, DAN TYPING STYLE

Modul ini membahas empat topik yang melengkapi pembahasan inheritance pada modul sebelumnya. Topik pertama adalah abstract class dan abstract method menggunakan modul `abc`. Topik kedua adalah data class menggunakan decorator `@dataclass`. Topik ketiga adalah mutability, yaitu perbedaan object yang dapat diubah dan object yang tidak dapat diubah beserta jebakan yang sering muncul. Topik keempat adalah typing style pada Python, mulai dari dynamic typing, duck typing, type hints, hingga `Protocol`.

Setiap latihan pada modul ini sudah berisi base structure. Bagian yang perlu dikerjakan ditandai dengan komentar `# TODO`. Bagian lain, terutama program utama, tidak perlu diubah.

---

## A. CAPAIAN PEMBELAJARAN

Setelah mempelajari modul ini, mahasiswa diharapkan mampu:

1. Menjelaskan perbedaan abstract class dan concrete class.
2. Membuat abstract class dan abstract method menggunakan `ABC` dan `@abstractmethod`.
3. Membuat abstract property dan abstract class bertingkat.
4. Membuat data class menggunakan `@dataclass`, termasuk nilai default, `field(default_factory=...)`, dan `__post_init__()`.
5. Membuat data class yang immutable menggunakan `frozen=True`.
6. Membedakan object mutable dan immutable serta menjelaskan aliasing, `is`, dan `==`.
7. Menghindari jebakan default argument mutable dan class attribute mutable.
8. Membedakan shallow copy dan deep copy.
9. Menjelaskan dynamic typing, duck typing, nominal typing, type hints, dan `Protocol`.

---

## B. PENDAHULUAN

Pada modul sebelumnya, sistem informasi akademik sudah memiliki hierarki class `User` dengan tiga class turunan, yaitu `Dosen`, `Mahasiswa`, dan `Tendik`. Ketika sistem tersebut terus dikembangkan, muncul empat masalah baru.

1. Object `User` dapat dibuat secara langsung, padahal di kampus tidak ada pengguna yang "hanya user". Setiap pengguna pasti merupakan dosen, mahasiswa, atau tendik. Selain itu, ketika programmer menambahkan class baru, misalnya `Alumni`, tidak ada mekanisme yang memaksa class tersebut menuliskan method `tampilkan_menu()`.
2. Banyak class yang tugasnya hanya menyimpan data, misalnya `MataKuliah` yang berisi kode, nama, dan SKS. Constructor, `__repr__()`, dan `__eq__()` untuk class seperti ini ditulis berulang-ulang.
3. KRS milik dua mahasiswa tiba-tiba berisi mata kuliah yang sama, padahal hanya satu mahasiswa yang menambahkan mata kuliah. Penyebabnya adalah object mutable yang dipakai bersama.
4. Function `cetak_kartu()` dapat menerima object apa saja. Muncul pertanyaan kapan jenis object perlu diperiksa dan kapan cukup dipastikan bahwa object tersebut memiliki method yang dibutuhkan.

| Masalah                                                   | Topik                              | Bagian |
| :-------------------------------------------------------- | :--------------------------------- | :----- |
| Parent class dapat dibuat object-nya, child lupa override | Abstract class dan abstract method | C      |
| Class penyimpan data penuh kode berulang                  | Data class                         | D      |
| Data berubah tanpa disengaja                              | Mutability                         | E      |
| Kapan jenis object perlu diperiksa                        | Typing style                       | F      |

---

## C. ABSTRACT CLASS DAN ABSTRACT METHOD

### 1. Masalah pada parent class biasa

Sebuah area parkir kampus menerima mobil dan motor. Setiap jenis kendaraan memiliki tarif parkir yang berbeda, sehingga method `hitung_biaya_parkir()` harus ditulis pada setiap child class.

Sebelum mengenal abstract class, cara yang biasa dipakai adalah menuliskan method di parent class yang hanya berisi `raise NotImplementedError`. Method tersebut menjadi pengingat bahwa child class wajib menuliskan ulang method itu.

```python
class Kendaraan:
    def __init__(self, plat_nomor):
        self.plat_nomor = plat_nomor

    def hitung_biaya_parkir(self, jam):
        raise NotImplementedError("Child class wajib menuliskan hitung_biaya_parkir()")

class Mobil(Kendaraan):
    def hitung_biaya_parkir(self, jam):
        return 5000 * jam

class Bus(Kendaraan):
    pass  # lupa menuliskan hitung_biaya_parkir()

mobil = Mobil("L 1234 AB")
bus = Bus("L 7788 CD")
print(mobil.hitung_biaya_parkir(2))
print("Object Bus berhasil dibuat")
bus.hitung_biaya_parkir(2)
```

Output yang diharapkan:

```text
10000
Object Bus berhasil dibuat
NotImplementedError: Child class wajib menuliskan hitung_biaya_parkir()
```

Cara tersebut memiliki dua kelemahan.

1. Object `Bus` tetap berhasil dibuat walaupun class `Bus` belum lengkap. Kesalahan baru diketahui ketika bus keluar dari area parkir dan biayanya dihitung. Pada program yang besar, saat tersebut bisa terjadi lama setelah object dibuat.
2. Object `Kendaraan("L 0000 XX")` juga dapat dibuat, padahal tidak ada kendaraan yang jenisnya hanya "kendaraan". Tarif parkirnya pun tidak dapat ditentukan.

### 2. Modul `abc`: `ABC` dan `@abstractmethod`

Python menyediakan modul `abc` (Abstract Base Classes) untuk menyelesaikan masalah tersebut. Istilah yang digunakan adalah sebagai berikut:

1. Abstract class adalah class yang tidak dapat dibuat object-nya secara langsung. Abstract class berfungsi sebagai kontrak bagi child class-nya.
2. Abstract method adalah method yang hanya dideklarasikan namanya tanpa implementasi. Setiap child class wajib mengimplementasikannya.
3. Concrete class adalah child class yang sudah mengimplementasikan seluruh abstract method, sehingga object-nya dapat dibuat.

Abstract class menjawab pertanyaan "apa yang harus bisa dilakukan", sedangkan concrete class menjawab pertanyaan "bagaimana cara melakukannya".

```python
from abc import ABC, abstractmethod

class Kendaraan(ABC):
    def __init__(self, plat_nomor):
        self.plat_nomor = plat_nomor

    @abstractmethod
    def hitung_biaya_parkir(self, jam):
        pass

class Mobil(Kendaraan):
    def hitung_biaya_parkir(self, jam):
        return 5000 * jam

class Motor(Kendaraan):
    def hitung_biaya_parkir(self, jam):
        return 2000 * jam

mobil = Mobil("L 1234 AB")
motor = Motor("W 5678 EF")
print(mobil.plat_nomor, mobil.hitung_biaya_parkir(2))
print(motor.plat_nomor, motor.hitung_biaya_parkir(3))
```

Output yang diharapkan:

```text
L 1234 AB 10000
W 5678 EF 6000
```

Terdapat tiga langkah untuk membuat abstract class:

1. Import `ABC` dan `abstractmethod` dari modul `abc`.
2. Class mewarisi `ABC`, misalnya `class Kendaraan(ABC)`.
3. Method yang wajib diimplementasikan child class diberi decorator `@abstractmethod`. Isinya cukup `pass` atau `...`.

### 3. Abstract class tidak dapat dibuat object-nya

Ketika object dibuat dari abstract class, Python langsung menghasilkan `TypeError`.

```python
kendaraan = Kendaraan("L 0000 XX")
```

```text
TypeError: Can't instantiate abstract class Kendaraan without an implementation for abstract method 'hitung_biaya_parkir'
```

Hal yang sama terjadi pada child class yang belum mengimplementasikan seluruh abstract method.

```python
class Bus(Kendaraan):
    pass

bus = Bus("L 7788 CD")
```

```text
TypeError: Can't instantiate abstract class Bus without an implementation for abstract method 'hitung_biaya_parkir'
```

Perbedaannya dengan cara `NotImplementedError` terletak pada waktu munculnya error. Error kini muncul saat object dibuat, bukan saat method dipanggil. Kesalahan menjadi lebih cepat ditemukan dan pesan error-nya langsung menyebutkan method yang belum diimplementasikan.

Teks pesan error dapat sedikit berbeda antarversi Python, tetapi jenis error-nya tetap `TypeError`.

{% capture m6_abc_dasar %}from abc import ABC, abstractmethod

# TODO: jadikan Kendaraan sebagai abstract class dengan mewarisi ABC

class Kendaraan:
def **init**(self, plat_nomor):
self.plat_nomor = plat_nomor

    # TODO: tandai method ini sebagai abstract method
    def hitung_biaya_parkir(self, jam):
        pass

class Mobil(Kendaraan): # TODO: implementasikan hitung_biaya_parkir() dengan tarif 5000 per jam
pass

class Motor(Kendaraan): # TODO: implementasikan hitung_biaya_parkir() dengan tarif 2000 per jam
pass

class Bus(Kendaraan): # Class ini sengaja tidak mengimplementasikan abstract method, biarkan apa adanya
pass

# Program utama

print(Mobil("L 1234 AB").hitung_biaya_parkir(2))
print(Motor("W 5678 EF").hitung_biaya_parkir(3))

for kelas in [Kendaraan, Bus]:
try:
kelas("L 0000 XX")
print(f"Object {kelas.**name**} berhasil dibuat")
except TypeError:
print(f"Object {kelas.**name**} gagal dibuat")

# Output yang diharapkan:

# 10000

# 6000

# Object Kendaraan gagal dibuat

# Object Bus gagal dibuat

{% endcapture %}
{% include pyodide-exercise.html id="m6-abc-dasar" title="Abstract class pertama" prompt="Ubah Kendaraan menjadi abstract class dengan satu abstract method, lalu lengkapi dua concrete class. Amati bahwa abstract class dan child class yang belum lengkap tidak dapat dibuat object-nya." starter=m6_abc_dasar %}

### 4. Abstract class dapat memiliki concrete method

Abstract class tidak harus berisi abstract method saja. Abstract class juga dapat memiliki constructor dan method biasa (concrete method) yang langsung diwarisi oleh child class.

Pola yang sering dipakai adalah parent class menentukan alur kerja, sedangkan child class mengisi langkah yang berbeda-beda. Pada sistem akademik, proses `login()` sama untuk semua pengguna, tetapi menu yang ditampilkan setelah login berbeda untuk dosen dan mahasiswa.

```python
from abc import ABC, abstractmethod

class User(ABC):
    def __init__(self, nama, email):
        self.nama = nama
        self.email = email

    def login(self):
        print(f"{self.nama} berhasil login")
        self.tampilkan_menu()

    @abstractmethod
    def tampilkan_menu(self):
        pass

class Dosen(User):
    def tampilkan_menu(self):
        print("Menu: Input Nilai | Presensi Kelas | Jadwal Mengajar")

class Mahasiswa(User):
    def tampilkan_menu(self):
        print("Menu: Isi KRS | Lihat KHS | Jadwal Kuliah")

for pengguna in [Dosen("Obie", "obie@unesa.ac.id"), Mahasiswa("Andi", "andi@mhs.unesa.ac.id")]:
    pengguna.login()
```

Output yang diharapkan:

```text
Obie berhasil login
Menu: Input Nilai | Presensi Kelas | Jadwal Mengajar
Andi berhasil login
Menu: Isi KRS | Lihat KHS | Jadwal Kuliah
```

Method `login()` ditulis satu kali di `User`. Di dalamnya, `self.tampilkan_menu()` dipanggil walaupun `User` sendiri tidak memiliki implementasinya. Pemanggilan tersebut aman karena abstract method menjamin bahwa setiap object yang berhasil dibuat pasti memiliki `tampilkan_menu()`.

{% capture m6_abc_user %}from abc import ABC, abstractmethod

# TODO: jadikan User sebagai abstract class

class User:
def **init**(self, nama, email):
self.nama = nama
self.email = email

    def login(self):
        # TODO: cetak "<nama> berhasil login", lalu panggil tampilkan_menu()
        pass

    # TODO: jadikan tampilkan_menu() sebagai abstract method
    def tampilkan_menu(self):
        pass

class Dosen(User): # TODO: cetak "Menu: Input Nilai | Presensi Kelas | Jadwal Mengajar"
pass

class Mahasiswa(User): # TODO: cetak "Menu: Isi KRS | Lihat KHS | Jadwal Kuliah"
pass

class Tendik(User): # TODO: cetak "Menu: Data Dosen | Data Mahasiswa | Surat Tugas"
pass

# Program utama

daftar_pengguna = [
Dosen("Obie", "obie@unesa.ac.id"),
Mahasiswa("Andi", "andi@mhs.unesa.ac.id"),
Tendik("Rina", "rina@unesa.ac.id"),
]

for pengguna in daftar_pengguna:
pengguna.login()

try:
User("Tamu", "tamu@unesa.ac.id")
except TypeError:
print("User tidak dapat dibuat secara langsung")

# Output yang diharapkan:

# Obie berhasil login

# Menu: Input Nilai | Presensi Kelas | Jadwal Mengajar

# Andi berhasil login

# Menu: Isi KRS | Lihat KHS | Jadwal Kuliah

# Rina berhasil login

# Menu: Data Dosen | Data Mahasiswa | Surat Tugas

# User tidak dapat dibuat secara langsung

{% endcapture %}
{% include pyodide-exercise.html id="m6-abc-user-menu" title="Concrete method di dalam abstract class" prompt="Lengkapi method login() pada abstract class agar memanggil abstract method tampilkan_menu(), lalu implementasikan menu yang berbeda pada tiga child class." starter=m6_abc_user %}

### 5. Abstract property

Abstract method dapat digabungkan dengan decorator `@property` yang sudah dipelajari pada Modul 3. Hasilnya adalah abstract property, yaitu property yang wajib disediakan oleh setiap child class.

Abstract property cocok untuk nilai yang dibaca seperti attribute, tetapi nilainya bergantung pada jenis child class. Contohnya tarif parkir dan jumlah roda kendaraan.

```python
from abc import ABC, abstractmethod

class Kendaraan(ABC):
    def __init__(self, plat_nomor):
        self.plat_nomor = plat_nomor

    @property
    @abstractmethod
    def tarif_per_jam(self):
        pass

    @property
    @abstractmethod
    def jumlah_roda(self):
        pass

    def hitung_biaya_parkir(self, jam):
        return self.tarif_per_jam * jam

    def info(self):
        print(f"{self.plat_nomor} | {self.jumlah_roda} roda | {self.tarif_per_jam}/jam")

class Mobil(Kendaraan):
    @property
    def tarif_per_jam(self):
        return 5000

    @property
    def jumlah_roda(self):
        return 4

mobil = Mobil("L 1234 AB")
mobil.info()
print(mobil.hitung_biaya_parkir(3))
```

Output yang diharapkan:

```text
L 1234 AB | 4 roda | 5000/jam
15000
```

Perhatikan urutan decorator-nya. `@abstractmethod` selalu ditulis paling dekat dengan `def`. Aturan yang sama berlaku ketika abstract method digabungkan dengan decorator lain dari Modul 4.

| Bentuk                 | Urutan decorator (atas ke bawah)        |
| :--------------------- | :-------------------------------------- |
| Abstract property      | `@property`, lalu `@abstractmethod`     |
| Abstract class method  | `@classmethod`, lalu `@abstractmethod`  |
| Abstract static method | `@staticmethod`, lalu `@abstractmethod` |

Dengan rancangan tersebut, method `hitung_biaya_parkir()` cukup ditulis satu kali di parent class. Child class hanya perlu menyediakan tarifnya.

{% capture m6_abstract_property %}from abc import ABC, abstractmethod

class Kendaraan(ABC):
def **init**(self, plat_nomor):
self.plat_nomor = plat_nomor

    # TODO: buat abstract property tarif_per_jam

    # TODO: buat abstract property jumlah_roda

    def hitung_biaya_parkir(self, jam):
        return self.tarif_per_jam * jam

    def info(self):
        print(f"{self.plat_nomor} | {self.jumlah_roda} roda | {self.tarif_per_jam}/jam")

class Mobil(Kendaraan): # TODO: implementasikan property tarif_per_jam (5000) dan jumlah_roda (4)
pass

class Motor(Kendaraan): # TODO: implementasikan property tarif_per_jam (2000) dan jumlah_roda (2)
pass

# Program utama

for kendaraan in [Mobil("L 1234 AB"), Motor("W 5678 EF")]:
kendaraan.info()
print("Biaya 3 jam:", kendaraan.hitung_biaya_parkir(3))

# Output yang diharapkan:

# L 1234 AB | 4 roda | 5000/jam

# Biaya 3 jam: 15000

# W 5678 EF | 2 roda | 2000/jam

# Biaya 3 jam: 6000

{% endcapture %}
{% include pyodide-exercise.html id="m6-abstract-property" title="Abstract property tarif dan jumlah roda" prompt="Tambahkan dua abstract property pada parent class, lalu implementasikan keduanya pada Mobil dan Motor. Method hitung_biaya_parkir() tidak perlu ditulis ulang di child class." starter=m6_abstract_property %}

### 6. Abstract class bertingkat

Child class yang hanya mengimplementasikan sebagian abstract method tetap menjadi abstract class. Object baru dapat dibuat pada tingkat ketika seluruh abstract method sudah diimplementasikan.

```python
from abc import ABC, abstractmethod

class Kendaraan(ABC):
    def __init__(self, plat_nomor):
        self.plat_nomor = plat_nomor

    @abstractmethod
    def isi_energi(self):
        pass

    @abstractmethod
    def hitung_biaya_parkir(self, jam):
        pass

class KendaraanListrik(Kendaraan):
    def isi_energi(self):
        print(f"{self.plat_nomor} mengisi daya baterai")

class MobilListrik(KendaraanListrik):
    def hitung_biaya_parkir(self, jam):
        return 4000 * jam

mobil = MobilListrik("L 2024 EV")
mobil.isi_energi()
print(mobil.hitung_biaya_parkir(2))
print(isinstance(mobil, Kendaraan))
```

Output yang diharapkan:

```text
L 2024 EV mengisi daya baterai
8000
True
```

`KendaraanListrik` baru mengimplementasikan `isi_energi()`, sehingga class tersebut masih abstract dan object-nya tidak dapat dibuat. `MobilListrik` melengkapi `hitung_biaya_parkir()`, sehingga menjadi concrete class.

{% capture m6_abc_bertingkat %}from abc import ABC, abstractmethod

class Kendaraan(ABC):
def **init**(self, plat_nomor):
self.plat_nomor = plat_nomor

    @abstractmethod
    def isi_energi(self):
        pass

    @abstractmethod
    def hitung_biaya_parkir(self, jam):
        pass

class KendaraanBensin(Kendaraan): # TODO: implementasikan isi_energi() yang mencetak "<plat_nomor> mengisi bensin di SPBU"
pass

class KendaraanListrik(Kendaraan): # TODO: implementasikan isi_energi() yang mencetak "<plat_nomor> mengisi daya baterai"
pass

class MotorBensin(KendaraanBensin): # TODO: implementasikan hitung_biaya_parkir() dengan tarif 2000 per jam
pass

class MobilListrik(KendaraanListrik): # TODO: implementasikan hitung_biaya_parkir() dengan tarif 4000 per jam
pass

# Program utama

for kendaraan in [MotorBensin("W 5678 EF"), MobilListrik("L 2024 EV")]:
kendaraan.isi_energi()
print("Biaya parkir 2 jam:", kendaraan.hitung_biaya_parkir(2))

for kelas in [KendaraanBensin, KendaraanListrik]:
try:
kelas("L 0000 XX")
except TypeError:
print(f"{kelas.**name**} masih abstract")

# Output yang diharapkan:

# W 5678 EF mengisi bensin di SPBU

# Biaya parkir 2 jam: 4000

# L 2024 EV mengisi daya baterai

# Biaya parkir 2 jam: 8000

# KendaraanBensin masih abstract

# KendaraanListrik masih abstract

{% endcapture %}
{% include pyodide-exercise.html id="m6-abc-bertingkat" title="Abstract class bertingkat" prompt="Lengkapi dua tingkat child class. Tingkat tengah hanya mengimplementasikan isi_energi(), sehingga masih abstract. Tingkat paling bawah melengkapi hitung_biaya_parkir()." starter=m6_abc_bertingkat %}

---

## D. DATA CLASS

### 1. Class yang hanya menyimpan data

Banyak class pada sistem akademik bertugas menyimpan data, bukan menjalankan perilaku yang rumit. Contohnya adalah mata kuliah, ruangan, dan nilai akhir. Jika ditulis sebagai class biasa, class seperti ini memerlukan beberapa method khusus agar nyaman digunakan.

```python
class MataKuliah:
    def __init__(self, kode, nama, sks):
        self.kode = kode
        self.nama = nama
        self.sks = sks

    def __repr__(self):
        return f"MataKuliah(kode={self.kode!r}, nama={self.nama!r}, sks={self.sks!r})"

    def __eq__(self, other):
        return (self.kode, self.nama, self.sks) == (other.kode, other.nama, other.sks)
```

Tanpa `__repr__()`, perintah `print()` hanya menampilkan teks seperti `<__main__.MataKuliah object at 0x7f...>`. Tanpa `__eq__()`, dua object dengan isi yang sama dianggap tidak sama.

Masalahnya, nama setiap attribute ditulis berulang kali. Ketika satu attribute baru ditambahkan, misalnya `semester`, perubahan harus dilakukan di constructor, `__repr__()`, dan `__eq__()` sekaligus.

### 2. Decorator `@dataclass`

Modul `dataclasses` menyediakan decorator `@dataclass` yang membuat method-method tersebut secara otomatis. Decorator ini dipasang pada class, bukan pada function, tetapi cara kerjanya sama dengan decorator yang dipelajari pada Modul 4.

```python
from dataclasses import dataclass

@dataclass
class MataKuliah:
    kode: str
    nama: str
    sks: int

pbo = MataKuliah("KA101", "Pemrograman Berorientasi Objek", 3)
pbo_lagi = MataKuliah("KA101", "Pemrograman Berorientasi Objek", 3)

print(pbo)
print(pbo.nama, pbo.sks)
print(pbo == pbo_lagi)
```

Output yang diharapkan:

```text
MataKuliah(kode='KA101', nama='Pemrograman Berorientasi Objek', sks=3)
Pemrograman Berorientasi Objek 3
True
```

Setiap baris `nama: tipe` di dalam class disebut field. Penulisan `: str` dan `: int` merupakan type hint yang dibahas lebih lanjut pada bagian F. Pada data class, type hint wajib dituliskan karena `@dataclass` mengenali field dari type hint tersebut.

Dari tiga baris field, `@dataclass` membuat tiga method secara otomatis:

| Method otomatis | Kegunaan                                         |
| :-------------- | :----------------------------------------------- |
| `__init__()`    | Constructor dengan parameter sesuai urutan field |
| `__repr__()`    | Tampilan object yang mudah dibaca saat dicetak   |
| `__eq__()`      | Perbandingan `==` berdasarkan isi seluruh field  |

{% capture m6_dataclass_dasar %}from dataclasses import dataclass

# TODO: pasang decorator dataclass pada class Ruangan

class Ruangan: # TODO: tuliskan field kode (str), gedung (str), dan kapasitas (int)
pass

# Program utama

r1 = Ruangan("A10.01.05", "Gedung A10", 40)
r2 = Ruangan("A10.01.05", "Gedung A10", 40)
r3 = Ruangan("A10.02.01", "Gedung A10", 60)

print(r1)
print(r1.kapasitas)
print(r1 == r2)
print(r1 == r3)

# Output yang diharapkan:

# Ruangan(kode='A10.01.05', gedung='Gedung A10', kapasitas=40)

# 40

# True

# False

{% endcapture %}
{% include pyodide-exercise.html id="m6-dataclass-dasar" title="Data class pertama" prompt="Ubah class Ruangan menjadi data class dengan tiga field. Constructor, tampilan saat dicetak, dan perbandingan == akan dibuat secara otomatis." starter=m6_dataclass_dasar %}

### 3. Nilai default dan `default_factory`

Field dapat diberi nilai default seperti parameter function. Field tanpa nilai default harus ditulis lebih dahulu daripada field yang memiliki nilai default.

```python
from dataclasses import dataclass

@dataclass
class MataKuliah:
    kode: str
    nama: str
    sks: int = 3
    semester: str = "Gasal"

print(MataKuliah("KA101", "Pemrograman Berorientasi Objek"))
print(MataKuliah("KA205", "Pembelajaran Mesin", 4, "Genap"))
```

Output yang diharapkan:

```text
MataKuliah(kode='KA101', nama='Pemrograman Berorientasi Objek', sks=3, semester='Gasal')
MataKuliah(kode='KA205', nama='Pembelajaran Mesin', sks=4, semester='Genap')
```

Jika urutannya dibalik, misalnya field `sks: int = 3` ditulis sebelum field `nama: str`, Python menghasilkan `TypeError: non-default argument 'nama' follows default argument`.

Aturan khusus berlaku untuk nilai default berupa list, dict, atau set. Penulisan `krs: list = []` ditolak oleh `@dataclass`:

```text
ValueError: mutable default <class 'list'> for field krs is not allowed: use default_factory
```

Sebagai gantinya, digunakan `field(default_factory=list)`. Penulisan tersebut membuat list kosong yang baru untuk setiap object. Alasan di balik aturan ini dibahas pada bagian E.

```python
from dataclasses import dataclass, field

@dataclass
class Mahasiswa:
    nama: str
    nim: str
    krs: list[str] = field(default_factory=list)

andi = Mahasiswa("Andi", "25051204001")
sari = Mahasiswa("Sari", "25051204002")
andi.krs.append("PBO")

print(andi)
print(sari)
```

Output yang diharapkan:

```text
Mahasiswa(nama='Andi', nim='25051204001', krs=['PBO'])
Mahasiswa(nama='Sari', nim='25051204002', krs=[])
```

Penulisan `list[str]` berarti list yang berisi data bertipe `str`.

{% capture m6_dataclass_default %}from dataclasses import dataclass, field

@dataclass
class Mobil:
merk: str
plat_nomor: str # TODO: tambahkan field warna (str) dengan nilai default "Hitam" # TODO: tambahkan field riwayat_servis (list[str]) dengan default list kosong # gunakan field(default_factory=list)

# Program utama

mobil_ayah = Mobil("Avanza", "L 1234 AB")
mobil_ibu = Mobil("Brio", "L 5678 CD", "Merah")

mobil_ayah.riwayat_servis.append("Ganti oli")
mobil_ayah.riwayat_servis.append("Rotasi ban")

print(mobil_ayah)
print(mobil_ibu)

# Output yang diharapkan:

# Mobil(merk='Avanza', plat_nomor='L 1234 AB', warna='Hitam', riwayat_servis=['Ganti oli', 'Rotasi ban'])

# Mobil(merk='Brio', plat_nomor='L 5678 CD', warna='Merah', riwayat_servis=[])

{% endcapture %}
{% include pyodide-exercise.html id="m6-dataclass-default" title="Nilai default dan default_factory" prompt="Tambahkan satu field dengan nilai default biasa dan satu field list dengan default_factory. Pastikan riwayat servis kedua mobil tidak tercampur." starter=m6_dataclass_default %}

### 4. Method dan `__post_init__()`

Data class tetap merupakan class biasa. Data class dapat memiliki method sendiri, dapat diwarisi, dan dapat memiliki validasi.

Karena constructor dibuat otomatis, validasi tidak ditulis di `__init__()`. Validasi ditulis di method `__post_init__()`, yaitu method yang dijalankan otomatis tepat setelah `__init__()` buatan `@dataclass` selesai mengisi field.

```python
from dataclasses import dataclass, field

@dataclass
class MataKuliah:
    kode: str
    nama: str
    sks: int

@dataclass
class Mahasiswa:
    nama: str
    nim: str
    krs: list[MataKuliah] = field(default_factory=list)

    def __post_init__(self):
        if len(self.nim) != 11:
            raise ValueError("NIM harus 11 digit.")

    def tambah_matkul(self, matkul):
        self.krs.append(matkul)

    def total_sks(self):
        total = 0
        for matkul in self.krs:
            total += matkul.sks
        return total

andi = Mahasiswa("Andi", "25051204001")
andi.tambah_matkul(MataKuliah("KA101", "Pemrograman Berorientasi Objek", 3))
andi.tambah_matkul(MataKuliah("KA102", "Kalkulus", 4))
print(andi.total_sks())
```

Output yang diharapkan:

```text
7
```

{% capture m6_dataclass_method %}from dataclasses import dataclass, field

@dataclass
class MataKuliah:
kode: str
nama: str
sks: int

@dataclass
class Mahasiswa:
nama: str
nim: str
krs: list[MataKuliah] = field(default_factory=list)

    def __post_init__(self):
        # TODO: raise ValueError("NIM harus 11 digit.") jika panjang nim bukan 11
        pass

    def tambah_matkul(self, matkul):
        # TODO: tambahkan matkul ke dalam krs
        pass

    def total_sks(self):
        # TODO: kembalikan jumlah sks seluruh mata kuliah di dalam krs
        pass

# Program utama

andi = Mahasiswa("Andi", "25051204001")
andi.tambah_matkul(MataKuliah("KA101", "Pemrograman Berorientasi Objek", 3))
andi.tambah_matkul(MataKuliah("KA102", "Kalkulus", 4))
andi.tambah_matkul(MataKuliah("KA103", "Bahasa Inggris", 2))
print(andi.nama, "mengambil", andi.total_sks(), "SKS")

try:
Mahasiswa("Sari", "2505")
except ValueError as error:
print("GAGAL Sari", error)

# Output yang diharapkan:

# Andi mengambil 9 SKS

# GAGAL Sari NIM harus 11 digit.

{% endcapture %}
{% include pyodide-exercise.html id="m6-dataclass-method" title="Method dan validasi pada data class" prompt="Lengkapi validasi NIM di __post_init__(), lalu lengkapi dua method biasa pada data class Mahasiswa." starter=m6_dataclass_method %}

### 5. Data class immutable: `frozen=True`

Sebagian data tidak boleh diubah setelah dibuat. Nilai akhir yang sudah divalidasi dosen tidak boleh diubah sembarangan, dan data pada STNK kendaraan tidak boleh dicoret begitu saja. Perubahan data seperti ini harus melalui prosedur resmi yang menghasilkan dokumen baru.

Data class dapat dibuat immutable dengan parameter `frozen=True`. Setiap upaya mengubah field menghasilkan `FrozenInstanceError`.

```python
from dataclasses import dataclass, replace, FrozenInstanceError

@dataclass(frozen=True)
class NilaiAkhir:
    nim: str
    kode_mk: str
    nilai: float

nilai_andi = NilaiAkhir("25051204001", "KA101", 78.5)

try:
    nilai_andi.nilai = 100
except FrozenInstanceError as error:
    print("Gagal mengubah:", error)

nilai_revisi = replace(nilai_andi, nilai=82.0)
print(nilai_andi)
print(nilai_revisi)
```

Output yang diharapkan:

```text
Gagal mengubah: cannot assign to field 'nilai'
NilaiAkhir(nim='25051204001', kode_mk='KA101', nilai=78.5)
NilaiAkhir(nim='25051204001', kode_mk='KA101', nilai=82.0)
```

Function `replace()` dari modul `dataclasses` membuat object baru dengan sebagian field yang diganti. Object lama tetap utuh, sehingga riwayat nilai sebelum revisi masih tersimpan.

{% capture m6_dataclass_frozen %}from dataclasses import dataclass, replace, FrozenInstanceError

# TODO: jadikan STNK sebagai data class yang immutable

class STNK:
plat_nomor: str
pemilik: str
berlaku_sampai: int

# Program utama

stnk = STNK("L 1234 AB", "Budi", 2026)

try:
stnk.pemilik = "Andi"
print("Pemilik berhasil diubah")
except FrozenInstanceError:
print("Data STNK tidak dapat diubah langsung")

# TODO: buat object stnk_baru dari stnk menggunakan replace(),

# dengan berlaku_sampai bertambah 5 tahun

stnk_baru = None

print(stnk)
print(stnk_baru)

# Output yang diharapkan:

# Data STNK tidak dapat diubah langsung

# STNK(plat_nomor='L 1234 AB', pemilik='Budi', berlaku_sampai=2026)

# STNK(plat_nomor='L 1234 AB', pemilik='Budi', berlaku_sampai=2031)

{% endcapture %}
{% include pyodide-exercise.html id="m6-dataclass-frozen" title="Data class immutable" prompt="Jadikan STNK sebagai frozen data class. Perpanjangan masa berlaku tidak mengubah object lama, melainkan membuat object baru dengan replace()." starter=m6_dataclass_frozen %}

### 6. Parameter `@dataclass` lainnya

Perilaku `@dataclass` dapat diatur melalui parameter.

| Parameter | Default | Kegunaan                                                       |
| :-------- | :------ | :------------------------------------------------------------- |
| `init`    | `True`  | Membuat `__init__()` otomatis                                  |
| `repr`    | `True`  | Membuat `__repr__()` otomatis                                  |
| `eq`      | `True`  | Membuat `__eq__()` otomatis                                    |
| `order`   | `False` | Membuat operator `<`, `<=`, `>`, `>=` berdasarkan urutan field |
| `frozen`  | `False` | Membuat object immutable                                       |

Contoh penggunaan `order=True` untuk mengurutkan antrean layanan akademik berdasarkan nomor antrean:

```python
from dataclasses import dataclass

@dataclass(order=True)
class Antrean:
    nomor: int
    nama: str

daftar = [Antrean(3, "Sari"), Antrean(1, "Andi"), Antrean(2, "Budi")]
for antrean in sorted(daftar):
    print(antrean.nomor, antrean.nama)
```

Output yang diharapkan:

```text
1 Andi
2 Budi
3 Sari
```

Perbandingan dilakukan field demi field sesuai urutan penulisan. Field `nomor` dibandingkan lebih dahulu, sehingga field yang ingin dijadikan dasar pengurutan ditulis paling atas.

### 7. Kapan menggunakan data class

| Gunakan data class ketika                      | Gunakan class biasa ketika                                  |
| :--------------------------------------------- | :---------------------------------------------------------- |
| Tugas utama class adalah menyimpan data        | Class memiliki banyak perilaku dan aturan                   |
| Attribute boleh diakses langsung               | Attribute perlu disembunyikan, misalnya password atau saldo |
| Perlu `print()` dan `==` yang langsung berguna | Perbandingan object tidak bergantung pada isi seluruh field |
| Contoh: `MataKuliah`, `Ruangan`, `NilaiAkhir`  | Contoh: `AkunSiakad`, `RekeningBank`                        |

Kedua bentuk tersebut tidak saling meniadakan. Data class tetap dapat memiliki method dan validasi, sedangkan class biasa tetap dapat menyimpan data.

---

## E. MUTABILITY

### 1. Object mutable dan immutable

Mutability adalah sifat sebuah object dapat diubah isinya setelah dibuat atau tidak.

1. Object mutable dapat diubah isinya tanpa membuat object baru.
2. Object immutable tidak dapat diubah. Setiap "perubahan" sebenarnya menghasilkan object baru.

| Immutable                       | Mutable                                    |
| :------------------------------ | :----------------------------------------- |
| `int`, `float`, `bool`          | `list`                                     |
| `str`                           | `dict`                                     |
| `tuple`                         | `set`                                      |
| `frozenset`                     | Object dari class buatan sendiri (umumnya) |
| Data class dengan `frozen=True` | Data class biasa                           |

### 2. Variabel adalah label, bukan kotak

Variabel pada Python tidak menyimpan object di dalamnya. Variabel hanya merupakan label atau nama yang menunjuk ke sebuah object. Dua variabel dapat menunjuk ke object yang sama. Keadaan tersebut disebut aliasing.

Analogi yang tepat adalah kunci mobil. Ketika ayah memberikan kunci cadangan kepada kakak, keluarga tersebut tidak memiliki dua mobil. Kedua kunci membuka mobil yang sama.

```python
class Mobil:
    def __init__(self, merk, warna):
        self.merk = merk
        self.warna = warna

mobil_ayah = Mobil("Avanza", "Hitam")
mobil_kakak = mobil_ayah          # kunci cadangan, bukan mobil baru
mobil_kakak.warna = "Merah"       # kakak mengecat ulang mobilnya

print(mobil_ayah.warna)
print(mobil_ayah is mobil_kakak)
```

Output yang diharapkan:

```text
Merah
True
```

Baris `mobil_kakak = mobil_ayah` tidak menyalin object. Baris tersebut hanya menambahkan label kedua pada object yang sama. Akibatnya, perubahan melalui `mobil_kakak` juga terlihat melalui `mobil_ayah`.

### 3. Operator `is` dan `==`

Python membedakan dua pertanyaan berikut:

| Operator | Pertanyaan                                    | Istilah    |
| :------- | :-------------------------------------------- | :--------- |
| `is`     | Apakah kedua label menunjuk object yang sama? | Identitas  |
| `==`     | Apakah isi kedua object sama?                 | Kesetaraan |

```python
from dataclasses import dataclass

@dataclass
class MataKuliah:
    kode: str
    sks: int

pbo_a = MataKuliah("KA101", 3)
pbo_b = MataKuliah("KA101", 3)
pbo_c = pbo_a

print(pbo_a == pbo_b, pbo_a is pbo_b)
print(pbo_a == pbo_c, pbo_a is pbo_c)
```

Output yang diharapkan:

```text
True False
True True
```

`pbo_a` dan `pbo_b` memiliki isi yang sama, tetapi merupakan dua object yang berbeda. `pbo_c` merupakan label lain untuk object `pbo_a`. Identitas sebuah object dapat dilihat dengan function `id()`. Dua label yang menghasilkan `id()` sama pasti menunjuk object yang sama.

### 4. Perubahan pada object immutable

Pada object immutable, operasi yang terlihat seperti mengubah sebenarnya membuat object baru dan memindahkan label ke object baru tersebut. Label lain tetap menunjuk object lama.

```python
nama = "andi"
nama_lain = nama
nama = nama.upper()
print(nama, nama_lain)

krs = ["PBO"]
krs_lain = krs
krs.append("Kalkulus")
print(krs, krs_lain)
```

Output yang diharapkan:

```text
ANDI andi
['PBO', 'Kalkulus'] ['PBO', 'Kalkulus']
```

`nama.upper()` menghasilkan string baru, sehingga `nama_lain` tidak ikut berubah. Sebaliknya, `krs.append()` mengubah list yang sama, sehingga `krs_lain` ikut berubah.

{% capture m6_aliasing %}paket_semester_1 = ["Kalkulus", "Algoritma", "Pengantar AI"]

class Mahasiswa:
def **init**(self, nama, paket_krs):
self.nama = nama # TODO: simpan salinan dari paket_krs, bukan paket_krs itu sendiri # petunjuk: gunakan list(paket_krs) atau paket_krs.copy()
self.krs = paket_krs

    def tambah_matkul(self, matkul):
        self.krs.append(matkul)

# Program utama

andi = Mahasiswa("Andi", paket_semester_1)
sari = Mahasiswa("Sari", paket_semester_1)
andi.tambah_matkul("Bahasa Inggris")

print(andi.nama, andi.krs)
print(sari.nama, sari.krs)
print("Paket:", paket_semester_1)
print(andi.krs is paket_semester_1)

# Output yang diharapkan:

# Andi ['Kalkulus', 'Algoritma', 'Pengantar AI', 'Bahasa Inggris']

# Sari ['Kalkulus', 'Algoritma', 'Pengantar AI']

# Paket: ['Kalkulus', 'Algoritma', 'Pengantar AI']

# False

{% endcapture %}
{% include pyodide-exercise.html id="m6-aliasing-krs" title="Aliasing pada paket KRS" prompt="Jalankan kode terlebih dahulu dan amati bahwa KRS Sari dan paket semester ikut berubah. Perbaiki constructor agar setiap mahasiswa menyimpan salinan paketnya sendiri." starter=m6_aliasing %}

### 5. Object mutable sebagai argument

Ketika object mutable dikirim ke function atau method, yang dikirim adalah label ke object yang sama, bukan salinannya. Perubahan di dalam function akan terlihat dari luar function.

```python
def tiga_nilai_tertinggi(daftar_nilai):
    daftar_nilai.sort(reverse=True)    # mengubah list asli
    return daftar_nilai[:3]

nilai_kelas = [78, 92, 65, 88, 70]
print(tiga_nilai_tertinggi(nilai_kelas))
print(nilai_kelas)
```

Output yang diharapkan:

```text
[92, 88, 78]
[92, 88, 78, 70, 65]
```

Dosen hanya ingin melihat tiga nilai tertinggi, tetapi urutan daftar nilai kelas ikut berubah. Function yang tidak bertugas mengubah data sebaiknya bekerja pada salinan, misalnya dengan `sorted(daftar_nilai, reverse=True)` yang menghasilkan list baru.

### 6. Jebakan default argument mutable

Nilai default sebuah parameter dibuat satu kali saja, yaitu ketika `def` dijalankan, bukan setiap kali function dipanggil. Jika nilai default tersebut berupa list, semua pemanggilan yang memakai default akan berbagi list yang sama.

```python
class Mahasiswa:
    def __init__(self, nama, krs=[]):     # jebakan
        self.nama = nama
        self.krs = krs

andi = Mahasiswa("Andi")
sari = Mahasiswa("Sari")
andi.krs.append("PBO")
print(sari.krs)
```

Output yang diharapkan:

```text
['PBO']
```

Cara memperbaikinya adalah menggunakan `None` sebagai default, lalu membuat list baru di dalam constructor.

```python
class Mahasiswa:
    def __init__(self, nama, krs=None):
        self.nama = nama
        if krs is None:
            krs = []
        self.krs = krs
```

Inilah alasan `@dataclass` menolak `krs: list = []` dan mewajibkan `field(default_factory=list)` seperti yang dibahas pada bagian D.

### 7. Jebakan class attribute mutable

Pada Modul 1 telah dibahas bahwa class attribute digunakan bersama oleh semua object. Jika class attribute berupa list, perubahan dari satu object akan terlihat di semua object.

```python
class KelasPraktikum:
    peserta = []                      # jebakan: dipakai bersama

    def __init__(self, kode):
        self.kode = kode

    def daftar(self, nama):
        self.peserta.append(nama)

kelas_a = KelasPraktikum("2025A")
kelas_b = KelasPraktikum("2025B")
kelas_a.daftar("Andi")
print(kelas_b.peserta)
```

Output yang diharapkan:

```text
['Andi']
```

Andi hanya mendaftar di kelas 2025A, tetapi namanya muncul di kelas 2025B. Data yang berbeda untuk setiap object harus dibuat sebagai instance attribute di dalam `__init__()`.

{% capture m6_jebakan_mutable %}class KelasPraktikum: # TODO: pindahkan peserta menjadi instance attribute di dalam **init**()
peserta = []

    def __init__(self, kode):
        self.kode = kode

    def daftar(self, nama):
        self.peserta.append(nama)

class Mobil: # TODO: ganti default riwayat_servis menjadi None, # lalu buat list baru di dalam constructor jika nilainya None
def **init**(self, plat_nomor, riwayat_servis=[]):
self.plat_nomor = plat_nomor
self.riwayat_servis = riwayat_servis

# Program utama

kelas_a = KelasPraktikum("2025A")
kelas_b = KelasPraktikum("2025B")
kelas_a.daftar("Andi")
kelas_b.daftar("Sari")
print(kelas_a.kode, kelas_a.peserta)
print(kelas_b.kode, kelas_b.peserta)

mobil_1 = Mobil("L 1234 AB")
mobil_2 = Mobil("W 5678 EF")
mobil_1.riwayat_servis.append("Ganti oli")
print(mobil_1.plat_nomor, mobil_1.riwayat_servis)
print(mobil_2.plat_nomor, mobil_2.riwayat_servis)

# Output yang diharapkan:

# 2025A ['Andi']

# 2025B ['Sari']

# L 1234 AB ['Ganti oli']

# W 5678 EF []

{% endcapture %}
{% include pyodide-exercise.html id="m6-jebakan-mutable" title="Dua jebakan object mutable" prompt="Jalankan kode terlebih dahulu dan amati data yang tercampur. Perbaiki class attribute mutable pada KelasPraktikum dan default argument mutable pada Mobil." starter=m6_jebakan_mutable %}

### 8. Shallow copy dan deep copy

Modul `copy` menyediakan dua cara menyalin object.

| Function          | Nama         | Hasil                                                             |
| :---------------- | :----------- | :---------------------------------------------------------------- |
| `copy.copy()`     | Shallow copy | Object baru, tetapi isi mutable di dalamnya masih dipakai bersama |
| `copy.deepcopy()` | Deep copy    | Object baru beserta salinan seluruh isi di dalamnya               |

Seorang tendik menyusun jadwal kelas 2025A, lalu menyalinnya sebagai dasar jadwal kelas 2025B.

```python
import copy

class JadwalKelas:
    def __init__(self, kelas, pertemuan):
        self.kelas = kelas
        self.pertemuan = pertemuan

jadwal_a = JadwalKelas("2025A", ["Rabu 07.00", "Rabu 09.30"])

jadwal_b = copy.copy(jadwal_a)
jadwal_b.kelas = "2025B"
jadwal_b.pertemuan[0] = "Jumat 07.00"

print(jadwal_a.kelas, jadwal_a.pertemuan)
print(jadwal_b.kelas, jadwal_b.pertemuan)
```

Output yang diharapkan:

```text
2025A ['Jumat 07.00', 'Rabu 09.30']
2025B ['Jumat 07.00', 'Rabu 09.30']
```

Attribute `kelas` aman karena string bersifat immutable dan diganti dengan string baru. Namun, attribute `pertemuan` masih menunjuk list yang sama, sehingga jadwal 2025A ikut berubah. Dengan `copy.deepcopy(jadwal_a)`, list `pertemuan` ikut disalin dan jadwal 2025A tetap utuh.

{% capture m6_deepcopy %}import copy

class PaketMobil:
def **init**(self, nama, fitur):
self.nama = nama
self.fitur = fitur

    def tampilkan(self):
        print(f"{self.nama}: {', '.join(self.fitur)}")

# Program utama

tipe_standar = PaketMobil("Tipe Standar", ["AC", "Power Steering"])

# TODO: ganti copy.copy() dengan cara menyalin yang tepat

# agar fitur tipe_standar tidak ikut berubah

tipe_premium = copy.copy(tipe_standar)
tipe_premium.nama = "Tipe Premium"
tipe_premium.fitur.append("Kamera Mundur")
tipe_premium.fitur.append("Sunroof")

tipe_standar.tampilkan()
tipe_premium.tampilkan()
print(tipe_standar.fitur is tipe_premium.fitur)

# Output yang diharapkan:

# Tipe Standar: AC, Power Steering

# Tipe Premium: AC, Power Steering, Kamera Mundur, Sunroof

# False

{% endcapture %}
{% include pyodide-exercise.html id="m6-deepcopy-mobil" title="Shallow copy dan deep copy" prompt="Jalankan kode terlebih dahulu dan amati bahwa fitur tipe standar ikut bertambah. Ganti cara penyalinan agar list fitur ikut tersalin." starter=m6_deepcopy %}

### 9. Membuat object yang aman dari perubahan

Beberapa cara yang dapat dipakai agar data penting tidak berubah tanpa disengaja adalah sebagai berikut:

1. Data class dengan `frozen=True`.
2. Property tanpa setter, sebagaimana dipelajari pada Modul 3.
3. Tuple sebagai pengganti list untuk kumpulan data yang tidak boleh bertambah atau berkurang.

Perlu diperhatikan bahwa `frozen=True` hanya mencegah field diganti. Jika field berisi list, isi list tersebut tetap dapat diubah.

```python
from dataclasses import dataclass

@dataclass(frozen=True)
class Kurikulum:
    tahun: int
    matkul_wajib: list[str]

kurikulum = Kurikulum(2025, ["PBO", "Kalkulus"])
kurikulum.matkul_wajib.append("Matkul Titipan")
print(kurikulum)
```

Output yang diharapkan:

```text
Kurikulum(tahun=2025, matkul_wajib=['PBO', 'Kalkulus', 'Matkul Titipan'])
```

Agar benar-benar immutable, field tersebut sebaiknya bertipe `tuple`, misalnya `matkul_wajib: tuple[str, ...]` yang diisi dengan `("PBO", "Kalkulus")`. Tuple tidak memiliki method `append()`.

---

## F. TYPING STYLE

### 1. Dynamic typing

Python menganut dynamic typing. Tipe data melekat pada object, bukan pada variabel. Sebuah variabel dapat menunjuk object bertipe apa saja dan dapat berpindah ke object bertipe lain.

```python
data = 3
print(type(data).__name__)
data = "tiga"
print(type(data).__name__)
```

Output yang diharapkan:

```text
int
str
```

Pada bahasa yang menganut static typing, misalnya Java, tipe variabel ditetapkan saat ditulis, misalnya `int sks = 3;`, dan variabel tersebut tidak dapat diisi string.

Walaupun dinamis, Python tetap ketat terhadap operasi antartipe. Operasi `"3" + 3` menghasilkan `TypeError` karena Python tidak mengubah tipe data secara diam-diam.

Karena variabel tidak memiliki tipe tetap, muncul beberapa gaya untuk memastikan bahwa sebuah object dapat dipakai dengan benar. Gaya-gaya tersebut disebut typing style.

### 2. Duck typing

Duck typing berasal dari ungkapan "jika sesuatu berjalan seperti bebek dan bersuara seperti bebek, maka anggap saja itu bebek". Pada duck typing, Python tidak memeriksa class sebuah object. Yang penting adalah object tersebut memiliki method yang dibutuhkan.

Sebelum kuliah dimulai, asisten praktikum menyalakan semua perangkat di kelas. Proyektor, AC, dan laptop tidak memiliki parent class yang sama, tetapi semuanya memiliki method `nyalakan()`.

```python
class Proyektor:
    def nyalakan(self):
        return "Proyektor menampilkan slide"

class AC:
    def nyalakan(self):
        return "AC disetel ke 24 derajat"

class Mobil:
    def nyalakan(self):
        return "Mesin mobil menyala"

def nyalakan_semua(daftar_perangkat):
    for perangkat in daftar_perangkat:
        print(perangkat.nyalakan())

nyalakan_semua([Proyektor(), AC(), Mobil()])
```

Output yang diharapkan:

```text
Proyektor menampilkan slide
AC disetel ke 24 derajat
Mesin mobil menyala
```

Function `nyalakan_semua()` tidak peduli bahwa `Mobil` bukan perangkat kelas. Selama object memiliki `nyalakan()`, function tersebut dapat bekerja.

Jika object tidak memiliki method tersebut, error baru muncul saat method dipanggil:

```text
AttributeError: 'PapanTulis' object has no attribute 'nyalakan'
```

Kondisi tersebut dapat ditangani dengan dua gaya:

| Gaya | Kepanjangan                               | Penulisan                                                      |
| :--- | :---------------------------------------- | :------------------------------------------------------------- |
| EAFP | Easier to Ask Forgiveness than Permission | Langsung panggil, tangani dengan `try`/`except AttributeError` |
| LBYL | Look Before You Leap                      | Periksa dahulu dengan `hasattr(objek, "nyalakan")`             |

Gaya EAFP lebih umum dipakai pada Python.

{% capture m6_duck_typing %}class Proyektor:
def nyalakan(self):
return "Proyektor menampilkan slide"

class AC:
def nyalakan(self):
return "AC disetel ke 24 derajat"

class PapanTulis:
def bersihkan(self):
return "Papan tulis dibersihkan"

# TODO: buat class Laptop yang memiliki method nyalakan()

# dan mengembalikan "Laptop dosen terhubung ke proyektor"

def siapkan_kelas(daftar_perangkat):
for perangkat in daftar_perangkat: # TODO: cetak hasil perangkat.nyalakan() # TODO: jika terjadi AttributeError, cetak "<NamaClass> dilewati" # petunjuk: nama class diperoleh dari type(perangkat).**name**
pass

# Program utama

siapkan_kelas([Proyektor(), PapanTulis(), AC(), Laptop()])

# Output yang diharapkan:

# Proyektor menampilkan slide

# PapanTulis dilewati

# AC disetel ke 24 derajat

# Laptop dosen terhubung ke proyektor

{% endcapture %}
{% include pyodide-exercise.html id="m6-duck-typing" title="Duck typing pada perangkat kelas" prompt="Lengkapi function yang memanggil nyalakan() pada setiap object tanpa memeriksa class-nya. Tangani object yang tidak memiliki method tersebut dengan try/except." starter=m6_duck_typing %}

### 3. Nominal typing dengan `isinstance()` dan ABC

Kebalikan dari duck typing adalah nominal typing, yaitu memeriksa jenis object berdasarkan silsilah class-nya. Pemeriksaan ini dilakukan dengan `isinstance()` yang telah dipelajari pada Modul 5.

Nominal typing paling berguna jika digabungkan dengan abstract class. Object yang lolos pemeriksaan `isinstance(objek, Kendaraan)` dijamin memiliki seluruh abstract method `Kendaraan`, karena abstract class tidak mengizinkan object dibuat sebelum seluruh abstract method diimplementasikan.

```python
def bayar_parkir(kendaraan, jam):
    if not isinstance(kendaraan, Kendaraan):
        raise TypeError("Hanya kendaraan yang dapat membayar parkir.")
    return kendaraan.hitung_biaya_parkir(jam)
```

| Aspek                    | Duck typing                          | Nominal typing (`isinstance` + ABC)    |
| :----------------------- | :----------------------------------- | :------------------------------------- |
| Dasar penentuan          | Method yang dimiliki object          | Class asal object                      |
| Wajib mewarisi parent?   | Tidak                                | Ya                                     |
| Kapan kesalahan terlihat | Saat method dipanggil                | Saat object dibuat atau saat diperiksa |
| Kelebihan                | Fleksibel, class tidak harus terkait | Kontrak jelas dan dipaksakan           |

### 4. Type hints

Type hints adalah keterangan tipe data yang ditulis pada variabel, parameter, dan nilai kembalian function. Type hints sudah dipakai pada field data class di bagian D.

```python
def hitung_biaya_parkir(tarif: int, jam: int) -> int:
    return tarif * jam

def cari_mahasiswa(nim: str, data: dict[str, str]) -> str | None:
    return data.get(nim)

nama_kampus: str = "Universitas Negeri Surabaya"
daftar_sks: list[int] = [3, 4, 2]
```

| Penulisan              | Arti                                                 |
| :--------------------- | :--------------------------------------------------- |
| `nim: str`             | Parameter `nim` bertipe `str`                        |
| `-> int`               | Function mengembalikan `int`                         |
| `list[int]`            | List yang berisi `int`                               |
| `dict[str, str]`       | Dict dengan key `str` dan value `str`                |
| `str \| None`          | Bertipe `str` atau bernilai `None`                   |
| `-> None`              | Function tidak mengembalikan nilai                   |
| `kendaraan: Kendaraan` | Class buatan sendiri juga dapat dipakai sebagai tipe |

Hal yang paling penting dipahami adalah bahwa Python tidak memaksakan type hints saat program berjalan.

```python
def kode_kelas(prodi: str, angkatan: int) -> str:
    return f"{prodi}-{angkatan}"

print(kode_kelas("KA", 2025))
print(kode_kelas(2025, "KA"))
```

Output yang diharapkan:

```text
KA-2025
2025-KA
```

Pemanggilan kedua tetap berjalan walaupun urutan argument salah. Type hints berfungsi sebagai dokumentasi dan sebagai bahan pemeriksaan oleh alat bantu, misalnya Pylance di VS Code atau `mypy`. Alat tersebut menandai pemanggilan yang tidak sesuai sebelum program dijalankan, sehingga kesalahan dapat ditemukan lebih awal.

{% capture m6_type_hints %}import inspect

# TODO: tambahkan type hint: daftar_nilai berupa list[float], hasilnya float

def hitung_rata_rata(daftar_nilai):
return sum(daftar_nilai) / len(daftar_nilai)

# TODO: tambahkan type hint: rata_rata berupa float, hasilnya str

def konversi_huruf(rata_rata):
if rata_rata >= 85:
return "A"
elif rata_rata >= 70:
return "B"
elif rata_rata >= 55:
return "C"
else:
return "D"

# TODO: tambahkan type hint: nama berupa str, daftar_nilai berupa list[float],

# hasilnya None

def cetak_khs(nama, daftar_nilai):
rata_rata = hitung_rata_rata(daftar_nilai)
print(f"{nama}: {rata_rata} ({konversi_huruf(rata_rata)})")

# Program utama

cetak_khs("Andi", [80.0, 90.0, 85.0])
print(inspect.signature(hitung_rata_rata))
print(inspect.signature(konversi_huruf))
print(inspect.signature(cetak_khs))

# Output yang diharapkan:

# Andi: 85.0 (A)

# (daftar_nilai: list[float]) -> float

# (rata_rata: float) -> str

# (nama: str, daftar_nilai: list[float]) -> None

{% endcapture %}
{% include pyodide-exercise.html id="m6-type-hints" title="Menambahkan type hints" prompt="Tambahkan type hints pada parameter dan nilai kembalian tiga function. Hasil perhitungan tidak berubah, tetapi signature function kini menjelaskan tipe datanya." starter=m6_type_hints %}

### 5. `Protocol`: duck typing yang dapat diperiksa

Duck typing fleksibel, tetapi tidak memiliki daftar tertulis mengenai method yang dibutuhkan. Modul `typing` menyediakan `Protocol` untuk menuliskan daftar tersebut tanpa memaksa class mewarisi apa pun.

```python
from typing import Protocol, runtime_checkable

@runtime_checkable
class BisaDinyalakan(Protocol):
    def nyalakan(self) -> str:
        ...

class Proyektor:
    def nyalakan(self) -> str:
        return "Proyektor menampilkan slide"

class PapanTulis:
    def bersihkan(self) -> str:
        return "Papan tulis dibersihkan"

def nyalakan_semua(daftar_perangkat: list[BisaDinyalakan]) -> None:
    for perangkat in daftar_perangkat:
        print(perangkat.nyalakan())

print(isinstance(Proyektor(), BisaDinyalakan))
print(isinstance(PapanTulis(), BisaDinyalakan))
```

Output yang diharapkan:

```text
True
False
```

`Proyektor` tidak mewarisi `BisaDinyalakan`, tetapi dianggap sesuai karena memiliki method `nyalakan()`. Pemeriksaan berdasarkan struktur seperti ini disebut structural typing.

Decorator `@runtime_checkable` diperlukan agar `isinstance()` dapat dipakai dengan `Protocol`. Pemeriksaan tersebut hanya memastikan nama method-nya ada, tidak memeriksa parameter maupun tipe kembaliannya.

{% capture m6_protocol %}from typing import Protocol, runtime_checkable

# TODO: buat Protocol BisaDitagih yang dapat diperiksa dengan isinstance()

# dengan satu method hitung_tagihan(self) -> int

class BisaDitagih:
pass

class TagihanUKT:
def **init**(self, nominal: int):
self.nominal = nominal

    def hitung_tagihan(self) -> int:
        return self.nominal

class KarcisParkir:
def **init**(self, jam: int):
self.jam = jam

    def hitung_tagihan(self) -> int:
        return 5000 * self.jam

class SewaAula:
def **init**(self, hari: int):
self.hari = hari

    def hitung_tagihan(self) -> int:
        return 1500000 * self.hari

class BukuPerpustakaan:
def **init**(self, judul: str):
self.judul = judul

def total_tagihan(daftar: list) -> int:
total = 0
for item in daftar: # TODO: jika item sesuai dengan BisaDitagih, tambahkan hitung_tagihan() ke total # TODO: jika tidak sesuai, cetak "<NamaClass> tidak memiliki tagihan"
pass
return total

# Program utama

daftar = [TagihanUKT(4000000), KarcisParkir(2), BukuPerpustakaan("Python OOP"), SewaAula(1)]
print("Total:", total_tagihan(daftar))
print(issubclass(TagihanUKT, BisaDitagih), TagihanUKT.**bases**)

# Output yang diharapkan:

# BukuPerpustakaan tidak memiliki tagihan

# Total: 5510000

# True (<class 'object'>,)

{% endcapture %}
{% include pyodide-exercise.html id="m6-protocol-tagihan" title="Protocol untuk kasir kampus" prompt="Ubah BisaDitagih menjadi Protocol yang dapat diperiksa dengan isinstance(). Perhatikan bahwa TagihanUKT dikenali sesuai Protocol walaupun hanya mewarisi object." starter=m6_protocol %}

### 6. Memilih typing style

| Gaya                           | Dasar penentuan      | Diperiksa oleh                                                    | Cocok untuk                                          |
| :----------------------------- | :------------------- | :---------------------------------------------------------------- | :--------------------------------------------------- |
| Duck typing                    | Method yang dimiliki | Python, saat method dipanggil                                     | Kode kecil dan fleksibel                             |
| Nominal typing (ABC)           | Class asal object    | Python, saat object dibuat atau `isinstance()`                    | Hierarki yang memang memiliki hubungan is-a          |
| Structural typing (`Protocol`) | Method yang dimiliki | Pylance atau `mypy`, dan `isinstance()` jika `@runtime_checkable` | Class yang tidak terkait tetapi berperilaku sama     |
| Type hints                     | Keterangan tipe      | Pylance atau `mypy`, tidak oleh Python                            | Dokumentasi dan pemeriksaan sebelum program berjalan |

Keempat gaya tersebut dapat dipakai bersama. Abstract class digunakan untuk keluarga class yang memiliki hubungan is-a, `Protocol` digunakan untuk perilaku yang dimiliki class yang tidak saling terkait, dan type hints ditulis pada keduanya agar kode lebih mudah dibaca.

---

## G. STUDI KASUS TERPADU

### 1. Sistem parkir kampus

Kampus memiliki area parkir dengan kapasitas terbatas. Sistem parkir memiliki ketentuan sebagai berikut:

1. `Kendaraan` merupakan abstract class dengan attribute `plat_nomor`, abstract property `tarif_per_jam`, dan concrete method `hitung_biaya(jam)`.
2. `Mobil` memiliki tarif 5000 per jam, sedangkan `Motor` memiliki tarif 2000 per jam.
3. `Karcis` merupakan frozen data class yang mencatat kendaraan dan jam masuk. Karcis tidak boleh diubah setelah dicetak.
4. `AreaParkir` merupakan data class dengan field `nama`, `kapasitas`, dan `terparkir` berupa list karcis yang dibuat dengan `default_factory`.
5. Kendaraan ditolak jika area parkir penuh.

```text
        Kendaraan (ABC)                      Karcis (frozen dataclass)
   plat_nomor, tarif_per_jam*            kendaraan, jam_masuk
       hitung_biaya(jam)
          /         \                    AreaParkir (dataclass)
      Mobil        Motor                 nama, kapasitas, terparkir
      5000         2000                  masuk(), keluar()
```

{% capture m6_studi_kasus_parkir %}from abc import ABC, abstractmethod
from dataclasses import dataclass, field, FrozenInstanceError

class Kendaraan(ABC):
def **init**(self, plat_nomor: str):
self.plat_nomor = plat_nomor

    # TODO: buat abstract property tarif_per_jam

    def hitung_biaya(self, jam: int) -> int:
        # TODO: kembalikan tarif_per_jam dikali jam
        pass

class Mobil(Kendaraan): # TODO: implementasikan property tarif_per_jam (5000)
pass

class Motor(Kendaraan): # TODO: implementasikan property tarif_per_jam (2000)
pass

# TODO: jadikan Karcis sebagai frozen data class

class Karcis:
kendaraan: Kendaraan
jam_masuk: int

@dataclass
class AreaParkir:
nama: str
kapasitas: int # TODO: tambahkan field terparkir (list[Karcis]) dengan default list kosong

    def masuk(self, kendaraan: Kendaraan, jam: int) -> Karcis | None:
        # TODO: jika jumlah karcis di terparkir sudah sama dengan kapasitas,
        #       cetak "<nama> penuh, <plat_nomor> ditolak" lalu kembalikan None
        # TODO: jika belum penuh, buat Karcis, simpan ke terparkir,
        #       cetak "<plat_nomor> masuk pukul <jam>", lalu kembalikan karcis
        pass

    def keluar(self, plat_nomor: str, jam_keluar: int) -> int:
        for karcis in self.terparkir:
            if karcis.kendaraan.plat_nomor == plat_nomor:
                # TODO: hapus karcis dari terparkir
                # TODO: hitung biaya berdasarkan lama parkir (jam_keluar - jam_masuk)
                # TODO: cetak "<plat_nomor> keluar, biaya <biaya>", lalu kembalikan biaya
                pass
        return 0

# Program utama

area = AreaParkir("Parkir Gedung A10", 2)
karcis_mobil = area.masuk(Mobil("L 1234 AB"), 7)
area.masuk(Motor("W 5678 EF"), 8)
area.masuk(Motor("S 9999 ZZ"), 8)

try:
karcis_mobil.jam_masuk = 9
except FrozenInstanceError:
print("Karcis tidak dapat diubah")

area.keluar("L 1234 AB", 10)
area.masuk(Motor("S 9999 ZZ"), 10)
area.keluar("W 5678 EF", 12)
print("Sisa kendaraan:", len(area.terparkir))

# Output yang diharapkan:

# L 1234 AB masuk pukul 7

# W 5678 EF masuk pukul 8

# Parkir Gedung A10 penuh, S 9999 ZZ ditolak

# Karcis tidak dapat diubah

# L 1234 AB keluar, biaya 15000

# S 9999 ZZ masuk pukul 10

# W 5678 EF keluar, biaya 8000

# Sisa kendaraan: 1

{% endcapture %}
{% include pyodide-exercise.html id="m6-studi-kasus-parkir" title="Sistem parkir kampus" prompt="Gabungkan abstract property, frozen data class, dan data class dengan default_factory untuk membangun sistem parkir dengan kapasitas terbatas." starter=m6_studi_kasus_parkir %}

### 2. Rekap honor sivitas akademika

Bagian keuangan kampus merekap honor bulanan. Setiap jenis pegawai memiliki cara perhitungan honor yang berbeda.

| Class              | Attribute tambahan | Rumus honor                     |
| :----------------- | :----------------- | :------------------------------ |
| `Dosen`            | `sks_mengajar`     | `sks_mengajar * 150000`         |
| `Tendik`           | `hari_lembur`      | `500000 + hari_lembur * 100000` |
| `AsistenPraktikum` | `jumlah_pertemuan` | `jumlah_pertemuan * 75000`      |

Ketentuan yang harus dipenuhi adalah sebagai berikut:

1. `Pegawai` merupakan abstract class dengan attribute `nama`, abstract method `hitung_honor()`, dan concrete method `buat_slip()`.
2. `buat_slip()` mengembalikan object `SlipHonor` yang berisi nama, jabatan, dan honor. Jabatan diambil dari nama class.
3. `SlipHonor` merupakan frozen data class, sehingga slip yang sudah dicetak tidak dapat diubah.
4. Function `rekap_honor()` menggunakan type hints dan mengembalikan list slip.

{% capture m6_studi_kasus_honor %}from abc import ABC, abstractmethod
from dataclasses import dataclass

# TODO: jadikan SlipHonor sebagai frozen data class

class SlipHonor:
nama: str
jabatan: str
honor: int

class Pegawai(ABC):
def **init**(self, nama: str):
self.nama = nama

    # TODO: buat abstract method hitung_honor() yang mengembalikan int

    def buat_slip(self) -> SlipHonor:
        # TODO: kembalikan SlipHonor berisi nama, nama class, dan hasil hitung_honor()
        #       petunjuk: nama class diperoleh dari type(self).__name__
        pass

class Dosen(Pegawai):
def **init**(self, nama: str, sks_mengajar: int):
super().**init**(nama)
self.sks_mengajar = sks_mengajar

    # TODO: implementasikan hitung_honor(): sks_mengajar * 150000

class Tendik(Pegawai):
def **init**(self, nama: str, hari_lembur: int):
super().**init**(nama)
self.hari_lembur = hari_lembur

    # TODO: implementasikan hitung_honor(): 500000 + hari_lembur * 100000

class AsistenPraktikum(Pegawai):
def **init**(self, nama: str, jumlah_pertemuan: int):
super().**init**(nama)
self.jumlah_pertemuan = jumlah_pertemuan

    # TODO: implementasikan hitung_honor(): jumlah_pertemuan * 75000

def rekap_honor(daftar_pegawai: list[Pegawai]) -> list[SlipHonor]: # TODO: kembalikan list berisi slip dari setiap pegawai
pass

# Program utama

daftar_pegawai = [
Dosen("Obie", 12),
Tendik("Rina", 3),
AsistenPraktikum("Andi", 8),
]

semua_slip = rekap_honor(daftar_pegawai)
total = 0
for slip in semua_slip:
print(f"{slip.nama} | {slip.jabatan} | {slip.honor}")
total += slip.honor
print("Total honor:", total)
print(semua_slip[0])

# Output yang diharapkan:

# Obie | Dosen | 1800000

# Rina | Tendik | 800000

# Andi | AsistenPraktikum | 600000

# Total honor: 3200000

# SlipHonor(nama='Obie', jabatan='Dosen', honor=1800000)

{% endcapture %}
{% include pyodide-exercise.html id="m6-studi-kasus-honor" title="Rekap honor sivitas akademika" prompt="Lengkapi abstract class Pegawai beserta tiga concrete class-nya. Setiap pegawai menghasilkan slip honor berupa frozen data class, lalu seluruh slip direkap oleh satu function bertype hint." starter=m6_studi_kasus_honor %}

Perhatikan bahwa function `rekap_honor()` memanggil `buat_slip()` pada tiga object yang berbeda tanpa memeriksa class-nya, dan setiap object menghitung honornya dengan cara masing-masing. Kemampuan tersebut menjadi fokus pembahasan polymorphism pada modul berikutnya.

---

## H. RINGKASAN

| Konsep                     | Penanda                                   | Kegunaan                                                       |
| :------------------------- | :---------------------------------------- | :------------------------------------------------------------- |
| Abstract class             | `class A(ABC)`                            | Kontrak yang tidak dapat dibuat object-nya secara langsung     |
| Abstract method            | `@abstractmethod`                         | Method yang wajib diimplementasikan oleh child class           |
| Abstract property          | `@property` lalu `@abstractmethod`        | Property yang wajib disediakan oleh child class                |
| Data class                 | `@dataclass`                              | Membuat `__init__()`, `__repr__()`, dan `__eq__()` otomatis    |
| Default mutable pada field | `field(default_factory=list)`             | Membuat list baru untuk setiap object                          |
| Validasi data class        | `__post_init__()`                         | Menjalankan pemeriksaan setelah field terisi                   |
| Data class immutable       | `@dataclass(frozen=True)`, `replace()`    | Mencegah perubahan field, perubahan dibuat sebagai object baru |
| Identitas dan kesetaraan   | `is`, `==`, `id()`                        | Membedakan object yang sama dengan object yang isinya sama     |
| Penyalinan                 | `copy.copy()`, `copy.deepcopy()`          | Menyalin object secara dangkal atau menyeluruh                 |
| Duck typing                | panggil method langsung, `try`/`except`   | Menerima object apa saja yang memiliki method yang dibutuhkan  |
| Type hints                 | `nama: str`, `-> int`, `list[str]`        | Dokumentasi tipe dan pemeriksaan oleh Pylance atau `mypy`      |
| Protocol                   | `class P(Protocol)`, `@runtime_checkable` | Menuliskan kontrak duck typing tanpa inheritance               |

Hal yang perlu diperhatikan:

1. Abstract class dan child class yang belum mengimplementasikan seluruh abstract method tidak dapat dibuat object-nya.
2. `@abstractmethod` selalu ditulis paling dekat dengan `def` ketika digabungkan dengan decorator lain.
3. Field data class wajib memiliki type hint. Field tanpa default ditulis sebelum field yang memiliki default.
4. Jangan menggunakan list, dict, atau set sebagai nilai default parameter maupun class attribute yang seharusnya milik setiap object.
5. `b = a` tidak menyalin object, melainkan membuat label kedua untuk object yang sama.
6. `frozen=True` tidak membuat isi list di dalam field ikut immutable. Gunakan tuple jika isinya juga tidak boleh berubah.
7. Python tidak memaksakan type hints saat program berjalan. Type hints diperiksa oleh alat bantu seperti Pylance atau `mypy`.

---

## I. BACAAN LANJUTAN

Materi modul ini disusun dengan merujuk pada buku _Object-Oriented Programming in Python: Design and Build Programs Using Classes, Objects, and the Four Pillars of OOP_ (M. North, 2025) yang tersedia pada halaman [Resources]({{ '/resources/' | relative_url }}).

| Topik                                              | Bagian pada buku                  |
| :------------------------------------------------- | :-------------------------------- |
| Abstract class, abstract method, abstract property | Chapter 7, Section 7.1 sampai 7.5 |
| Data class sebagai penampung data                  | Chapter 4, Section 4.7            |
| Identitas object, aliasing, shallow dan deep copy  | Chapter 2, Section 2.2 dan 2.7    |
| Duck typing dan `Protocol`                         | Chapter 6, Section 6.2 dan 6.7    |
