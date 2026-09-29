---
title: Chapter 5
layout: default
parent: Readings
printtitle: Modul 5 - Inheritance
nav_order: 5
---

# MODUL 5

## INHERITANCE

Modul ini membahas inheritance atau pewarisan pada Python, mulai dari konsep dasar dan istilah parent class serta child class, penggunaan `super()` pada constructor dan method, method overriding, multilevel inheritance, multiple inheritance, hingga Method Resolution Order (MRO).

Setiap latihan pada modul ini sudah berisi base structure. Bagian yang perlu dikerjakan ditandai dengan komentar `# TODO`. Bagian lain, terutama program utama, tidak perlu diubah.

---

## A. CAPAIAN PEMBELAJARAN

Setelah mempelajari modul ini, mahasiswa diharapkan mampu:

1. Menjelaskan konsep inheritance beserta istilah parent class dan child class.
2. Mengenali hubungan "is-a" sebagai dasar penggunaan inheritance.
3. Membuat child class yang mewarisi attribute dan method dari parent class.
4. Menggunakan `super()` untuk memanggil constructor milik parent class.
5. Melakukan method overriding dan menjelaskan tujuannya.
6. Menggunakan `super()` di dalam method yang dioverride.
7. Membuat multilevel inheritance dan menjelaskan urutan penelusurannya.
8. Membuat multiple inheritance serta menjelaskan Method Resolution Order (MRO).

---

## B. PENDAHULUAN

Sebuah program sistem informasi akademik diminta untuk menyimpan data Dosen, Mahasiswa, dan Tendik. Jika program tersebut dibuat dengan pendekatan OOP, maka setiap jenis pengguna dibuat sebagai satu class tersendiri.

| Class       | Attribute                                            | Method                                                          |
| :---------- | :--------------------------------------------------- | :-------------------------------------------------------------- |
| `Dosen`     | nama, nip, email, matkul_diajar, username, password  | `login()`, `logout()`, `mengajar_matkul()`, `input_nilai()`     |
| `Mahasiswa` | nama, nim, email, matkul_diambil, username, password | `login()`, `logout()`, `mengambil_matkul()`, `cek_KHS()`        |
| `Tendik`    | nama, nip, email, username, password                 | `login()`, `logout()`, `input_data_dosen()`, `input_data_mhs()` |

Ketiga class tersebut memiliki bagian yang berulang. Attribute `nama`, `email`, `username`, dan `password` muncul pada ketiganya. Method `login()` dan `logout()` juga muncul pada ketiganya.

Pengulangan tersebut menimbulkan dua masalah. Pertama, kode yang sama ditulis berkali-kali. Kedua, ketika aturan `login()` berubah, perubahan harus dilakukan pada tiga tempat sekaligus dan salah satu di antaranya berpeluang terlewat.

Inheritance digunakan untuk menghindari pengulangan tersebut. Bagian yang dimiliki semua pengguna ditulis satu kali pada class umum, misalnya class `User`. Bagian yang khusus tetap ditulis pada class masing-masing.

```text
                        User
              nama, email, username, password
                    login(), logout()
                            |
        +-------------------+-------------------+
        |                   |                   |
      Dosen             Mahasiswa             Tendik
  nip, matkul_diajar   nim, matkul_diambil     nip
  mengajar_matkul()    mengambil_matkul()   input_data_dosen()
  input_nilai()        cek_KHS()            input_data_mahasiswa()
```

---

## C. KONSEP INHERITANCE

### 1. Pengertian inheritance

Inheritance atau pewarisan adalah mekanisme OOP ketika sebuah class mewarisi attribute dan method dari class lain, sehingga kode dapat digunakan ulang tanpa ditulis ulang.

Istilah yang digunakan dalam inheritance adalah sebagai berikut:

1. Class yang diwarisi disebut parent class, base class, atau superclass.
2. Class yang mewarisi disebut child class, derived class, atau subclass.

Attribute dan method yang bersifat umum cukup ditulis satu kali di parent class, lalu dipakai oleh semua child class. Dengan demikian, perbaikan pada parent class otomatis berlaku untuk seluruh child class.

### 2. Bentuk dasar penulisan

Nama parent class dituliskan di dalam tanda kurung setelah nama child class.

```python
class Kendaraan:
    def __init__(self, merk, tahun):
        self.merk = merk
        self.tahun = tahun

    def nyalakan(self):
        print(f"{self.merk} menyala")

class Mobil(Kendaraan):
    def buka_bagasi(self):
        print(f"Bagasi {self.merk} dibuka")

class Motor(Kendaraan):
    def pasang_helm(self):
        print(f"Helm {self.merk} dipasang")

mobil = Mobil("Avanza", 2022)
motor = Motor("Vario", 2023)
mobil.nyalakan()
mobil.buka_bagasi()
motor.pasang_helm()
```

Output yang diharapkan:

```text
Avanza menyala
Bagasi Avanza dibuka
Helm Vario dipasang
```

Class `Mobil` dan `Motor` tidak menuliskan `__init__()` maupun `nyalakan()`, tetapi keduanya tetap memilikinya. Keduanya mewarisi `__init__()` dan `nyalakan()` dari class `Kendaraan`.

{% capture m5_inheritance_dasar %}class Kendaraan:
    def __init__(self, merk, tahun):
        self.merk = merk
        self.tahun = tahun

    def nyalakan(self):
        print(f"{self.merk} menyala")

# TODO: buat class Mobil yang mewarisi Kendaraan

# TODO: tambahkan method buka_bagasi() yang mencetak "Bagasi <merk> dibuka"

# TODO: buat class Motor yang mewarisi Kendaraan

# TODO: tambahkan method pasang_helm() yang mencetak "Helm <merk> dipasang"

# Program utama

mobil = Mobil("Avanza", 2022)
motor = Motor("Vario", 2023)
mobil.nyalakan()
mobil.buka_bagasi()
motor.nyalakan()
motor.pasang_helm()

# Output yang diharapkan:

# Avanza menyala

# Bagasi Avanza dibuka

# Vario menyala

# Helm Vario dipasang

{% endcapture %}
{% include pyodide-exercise.html id="m5-inheritance-dasar" title="Child class pertama" prompt="Buat dua child class dari satu parent class. Kedua child class tidak perlu menuliskan ulang constructor maupun method yang sudah ada di parent." starter=m5_inheritance_dasar %}

### 3. Hubungan "is-a"

Inheritance digunakan ketika child class benar-benar merupakan jenis dari parent class. Hubungan tersebut disebut hubungan "is-a".

```text
Mobil is-a Kendaraan
Dosen is-a User
Mahasiswa is-a User
```

Kalimat tersebut dapat dijadikan pemeriksaan sebelum menggunakan inheritance. Jika kalimat "child is-a parent" terasa benar, inheritance biasanya tepat digunakan. Jika kalimat tersebut terasa aneh, misalnya "Mesin is-a Mobil", maka hubungan yang lebih tepat bukan inheritance.

### 4. Memeriksa hubungan inheritance

Python menyediakan dua function untuk memeriksa hubungan tersebut, yaitu `isinstance()` untuk object dan `issubclass()` untuk class.

```python
mobil = Mobil("Avanza", 2022)

print(isinstance(mobil, Mobil))
print(isinstance(mobil, Kendaraan))
print(issubclass(Mobil, Kendaraan))
print(issubclass(Kendaraan, Mobil))
```

Output yang diharapkan:

```text
True
True
True
False
```

Object `mobil` dikenali sebagai `Mobil` sekaligus sebagai `Kendaraan`. Sebaliknya, `Kendaraan` bukan turunan dari `Mobil`, sehingga hasil pemeriksaan terakhir adalah `False`.

{% capture m5_is_a %}class User:
    def __init__(self, nama, email):
        self.nama = nama
        self.email = email

class Dosen(User):
    pass

class Mahasiswa(User):
    pass

# Program utama

dosen = Dosen("Obie", "obie@unesa.ac.id")
mahasiswa = Mahasiswa("Andi", "andi@mhs.unesa.ac.id")

# TODO: cetak hasil pemeriksaan apakah dosen merupakan object Dosen

# TODO: cetak hasil pemeriksaan apakah dosen merupakan object User

# TODO: cetak hasil pemeriksaan apakah dosen merupakan object Mahasiswa

# TODO: cetak hasil pemeriksaan apakah class Mahasiswa merupakan turunan User

# Output yang diharapkan:

# True

# True

# False

# True

{% endcapture %}
{% include pyodide-exercise.html id="m5-is-a-isinstance" title="Memeriksa hubungan is-a" prompt="Gunakan isinstance() untuk memeriksa object dan issubclass() untuk memeriksa class. Amati bahwa satu object dapat dikenali sebagai child class sekaligus sebagai parent class." starter=m5_is_a %}

### 5. Menerapkan inheritance pada studi kasus

Class `User` menyimpan karakteristik yang dimiliki semua pengguna. Class turunannya menyimpan karakteristik khusus.

```python
class User:
    def __init__(self, nama, email, username, password):
        self.nama = nama
        self.email = email
        self.username = username
        self.password = password

    def login(self):
        print(f"{self.username} berhasil login")

    def logout(self):
        print(f"{self.username} berhasil logout")

class Tendik(User):
    def input_data_mahasiswa(self):
        print(f"{self.nama} menginput data mahasiswa")

tendik = Tendik("Rina", "rina@unesa.ac.id", "rina01", "rahasia")
tendik.login()
tendik.input_data_mahasiswa()
tendik.logout()
```

Output yang diharapkan:

```text
rina01 berhasil login
Rina menginput data mahasiswa
rina01 berhasil logout
```

Class `Tendik` hanya menuliskan bagian yang khusus. Empat attribute dan dua method lainnya diperoleh dari class `User`.

{% capture m5_user_tendik %}class User:
    def __init__(self, nama, email, username, password):
        self.nama = nama
        self.email = email
        self.username = username
        self.password = password

    def login(self):
        # TODO: cetak "<username> berhasil login"
        pass

    def logout(self):
        # TODO: cetak "<username> berhasil logout"
        pass

# TODO: buat class Tendik yang mewarisi User

# TODO: tambahkan method input_data_mahasiswa() yang mencetak

# "<nama> menginput data mahasiswa"

# Program utama

tendik = Tendik("Rina", "rina@unesa.ac.id", "rina01", "rahasia")
tendik.login()
tendik.input_data_mahasiswa()
tendik.logout()
print(tendik.email)

# Output yang diharapkan:

# rina01 berhasil login

# Rina menginput data mahasiswa

# rina01 berhasil logout

# rina@unesa.ac.id

{% endcapture %}
{% include pyodide-exercise.html id="m5-user-tendik" title="Class User dan class turunannya" prompt="Lengkapi method login() dan logout() pada parent class, lalu buat satu child class yang hanya menuliskan method khususnya saja." starter=m5_user_tendik %}

---

## D. PENGGUNAAN `super()`

### 1. Constructor pada child class

Child class sering membutuhkan attribute tambahan yang tidak ada pada parent class. Attribute tambahan tersebut diisi melalui `__init__()` milik child class.

Masalahnya, ketika child class menuliskan `__init__()` sendiri, constructor milik parent class tidak lagi dijalankan secara otomatis. Akibatnya, attribute dari parent class tidak terisi.

```python
class Kendaraan:
    def __init__(self, merk, tahun):
        self.merk = merk
        self.tahun = tahun

class Mobil(Kendaraan):
    def __init__(self, merk, tahun, jumlah_pintu):
        self.jumlah_pintu = jumlah_pintu

mobil = Mobil("Avanza", 2022, 4)
print(mobil.jumlah_pintu)
print(mobil.merk)
```

Baris terakhir menghasilkan error karena `self.merk` tidak pernah diisi:

```text
4
AttributeError: 'Mobil' object has no attribute 'merk'
```

### 2. `super()` pada constructor

`super()` dipakai ketika child class ingin memanggil constructor milik parent class.

```python
class Kendaraan:
    def __init__(self, merk, tahun):
        self.merk = merk
        self.tahun = tahun

    def nyalakan(self):
        print(f"{self.merk} menyala")

class Mobil(Kendaraan):
    def __init__(self, merk, tahun, jumlah_pintu):
        super().__init__(merk, tahun)
        self.jumlah_pintu = jumlah_pintu

    def buka_bagasi(self):
        print(f"Bagasi {self.merk} dibuka")

class Motor(Kendaraan):
    def __init__(self, merk, tahun, tipe_stang):
        super().__init__(merk, tahun)
        self.tipe_stang = tipe_stang

    def pasang_helm(self):
        print(f"Helm {self.merk} dipasang")

mobil = Mobil("Avanza", 2022, 4)
motor = Motor("Vario", 2023, "Cover Handlebar")
print(mobil.merk, mobil.tahun, mobil.jumlah_pintu)
print(motor.merk, motor.tahun, motor.tipe_stang)
```

Output yang diharapkan:

```text
Avanza 2022 4
Vario 2023 Cover Handlebar
```

Baris `super().__init__(merk, tahun)` menjalankan `__init__()` milik `Kendaraan`, sehingga `self.merk` dan `self.tahun` terisi. Setelah itu, child class mengisi attribute tambahannya sendiri.

Perhatikan bahwa `self` tidak dituliskan sebagai argument pada `super().__init__(...)`. Python mengisinya secara otomatis.

{% capture m5_super_constructor %}class Kendaraan:
    def __init__(self, merk, tahun):
        self.merk = merk
        self.tahun = tahun

    def nyalakan(self):
        print(f"{self.merk} menyala")

class Mobil(Kendaraan):
    def __init__(self, merk, tahun, jumlah_pintu): # TODO: panggil constructor parent untuk mengisi merk dan tahun # TODO: isi attribute jumlah_pintu
        pass

    def buka_bagasi(self):
        print(f"Bagasi {self.merk} dibuka")

class Motor(Kendaraan):
    def __init__(self, merk, tahun, tipe_stang): # TODO: panggil constructor parent untuk mengisi merk dan tahun # TODO: isi attribute tipe_stang
        pass

    def pasang_helm(self):
        print(f"Helm {self.merk} dipasang")

# Program utama

mobil = Mobil("Avanza", 2022, 4)
motor = Motor("Vario", 2023, "Cover Handlebar")
print(mobil.merk, mobil.tahun, mobil.jumlah_pintu)
print(motor.merk, motor.tahun, motor.tipe_stang)
mobil.nyalakan()
mobil.buka_bagasi()
motor.pasang_helm()

# Output yang diharapkan:

# Avanza 2022 4

# Vario 2023 Cover Handlebar

# Avanza menyala

# Bagasi Avanza dibuka

# Helm Vario dipasang

{% endcapture %}
{% include pyodide-exercise.html id="m5-super-constructor" title="super() pada constructor" prompt="Lengkapi constructor kedua child class agar memanggil constructor parent melalui super(), lalu mengisi attribute tambahan miliknya sendiri." starter=m5_super_constructor %}

### 3. Child class tanpa `__init__()`

Tanpa `super()`, inheritance tetap berjalan. Jika child class tidak membuat `__init__()` sendiri, Python akan menggunakan `__init__()` yang diwarisi dari parent secara otomatis.

```python
class Kendaraan:
    def __init__(self, merk, tahun):
        self.merk = merk
        self.tahun = tahun

class Sepeda(Kendaraan):
    def kayuh(self):
        print(f"{self.merk} sedang dikayuh")

sepeda = Sepeda("Polygon", 2024)
print(sepeda.merk)
sepeda.kayuh()
```

Output yang diharapkan:

```text
Polygon
Polygon sedang dikayuh
```

Dengan demikian, `super().__init__()` diperlukan ketika child class memiliki `__init__()` sendiri. Jika child class tidak memiliki `__init__()`, constructor parent digunakan apa adanya.

{% capture m5_tanpa_init %}class User:
    def __init__(self, nama, email):
        self.nama = nama
        self.email = email

    def login(self):
        print(f"{self.nama} berhasil login")

# TODO: buat class Tendik yang mewarisi User tanpa menuliskan __init__()

# TODO: tambahkan method input_data_dosen() yang mencetak "<nama> menginput data dosen"

class Dosen(User):
    def __init__(self, nama, email, nip): # TODO: panggil constructor parent, lalu isi attribute nip
        pass

# Program utama

tendik = Tendik("Rina", "rina@unesa.ac.id")
tendik.login()
tendik.input_data_dosen()

dosen = Dosen("Obie", "obie@unesa.ac.id", "1990010120200110001")
dosen.login()
print(dosen.email, dosen.nip)

# Output yang diharapkan:

# Rina berhasil login

# Rina menginput data dosen

# Obie berhasil login

# obie@unesa.ac.id 1990010120200110001

{% endcapture %}
{% include pyodide-exercise.html id="m5-tanpa-init-child" title="Child class dengan dan tanpa __init__()" prompt="Bandingkan child class yang tidak menuliskan constructor dengan child class yang menuliskan constructor sendiri. Hanya yang kedua membutuhkan pemanggilan constructor parent." starter=m5_tanpa_init %}

---

## E. METHOD OVERRIDING

### 1. Pengertian override

Method overriding terjadi ketika child class menuliskan kembali method yang sudah ada di parent class. Child class mengganti atau menimpa implementasi method yang diwarisinya.

Tujuan override adalah menyesuaikan perilaku yang diwarisi dengan karakteristik child class itu sendiri.

```python
class User:
    def __init__(self, nama):
        self.nama = nama

    def login(self):
        print(f"{self.nama} berhasil login")

class Dosen(User):
    def login(self):
        print(f"Selamat datang, Dosen {self.nama}!")

user = User("Rina")
dosen = Dosen("Obie")
user.login()
dosen.login()
```

Output yang diharapkan:

```text
Rina berhasil login
Selamat datang, Dosen Obie!
```

Ketika `dosen.login()` dipanggil, Python mencari `login()` di class `Dosen` terlebih dahulu. Karena ditemukan, method milik `User` tidak dijalankan.

{% capture m5_override_dasar %}class User:
    def __init__(self, nama):
        self.nama = nama

    def login(self):
        print(f"{self.nama} berhasil login")

    def logout(self):
        print(f"{self.nama} berhasil logout")

class Dosen(User): # TODO: override login() agar mencetak "Selamat datang, Dosen <nama>!"
    pass

class Mahasiswa(User): # TODO: override login() agar mencetak "Selamat datang, Mahasiswa <nama>!"
    pass

# Program utama

User("Rina").login()
Dosen("Obie").login()
Mahasiswa("Andi").login()
Mahasiswa("Andi").logout()

# Output yang diharapkan:

# Rina berhasil login

# Selamat datang, Dosen Obie!

# Selamat datang, Mahasiswa Andi!

# Andi berhasil logout

{% endcapture %}
{% include pyodide-exercise.html id="m5-override-dasar" title="Override method login()" prompt="Tuliskan kembali method login() pada dua child class dengan isi yang berbeda. Biarkan method logout() tetap diwarisi tanpa perubahan." starter=m5_override_dasar %}

### 2. `super()` di dalam method yang dioverride

`super()` juga dapat dipakai ketika child class ingin memanggil method milik parent class. Cara ini digunakan agar perilaku parent tetap berjalan, lalu child class menambahkan perilakunya sendiri.

```python
class Kendaraan:
    def __init__(self, merk, tahun):
        self.merk = merk
        self.tahun = tahun

    def nyalakan(self):
        print(f"{self.merk} menyala")

class Mobil(Kendaraan):
    def nyalakan(self):
        super().nyalakan()
        print("Silakan pasang seatbelt Anda")

class Motor(Kendaraan):
    def nyalakan(self):
        super().nyalakan()
        print("Silakan gunakan helm Anda")

mobil = Mobil("Avanza", 2022)
motor = Motor("Vario", 2023)
mobil.nyalakan()
motor.nyalakan()
```

Output yang diharapkan:

```text
Avanza menyala
Silakan pasang seatbelt Anda
Vario menyala
Silakan gunakan helm Anda
```

Baris `super().nyalakan()` menjalankan `nyalakan()` milik `Kendaraan`. Setelah baris tersebut selesai, child class melanjutkan dengan pesan tambahannya.

{% capture m5_override_super %}class Kendaraan:
    def __init__(self, merk, tahun):
        self.merk = merk
        self.tahun = tahun

    def nyalakan(self):
        print(f"{self.merk} menyala")

class Mobil(Kendaraan):
    def nyalakan(self): # TODO: jalankan nyalakan() milik parent melalui super() # TODO: cetak "Silakan pasang seatbelt Anda"
        pass

class Motor(Kendaraan):
    def nyalakan(self): # TODO: jalankan nyalakan() milik parent melalui super() # TODO: cetak "Silakan gunakan helm Anda"
        pass

# Program utama

Mobil("Avanza", 2022).nyalakan()
Motor("Vario", 2023).nyalakan()

# Output yang diharapkan:

# Avanza menyala

# Silakan pasang seatbelt Anda

# Vario menyala

# Silakan gunakan helm Anda

{% endcapture %}
{% include pyodide-exercise.html id="m5-override-super" title="Override dengan super()" prompt="Panggil method milik parent melalui super(), lalu tambahkan satu baris perilaku khusus milik child class." starter=m5_override_super %}

### 3. Override dengan dan tanpa `super()`

Terdapat dua bentuk override yang dapat dipilih sesuai kebutuhan.

| Bentuk            | Penulisan        | Akibat                                        |
| :---------------- | :--------------- | :-------------------------------------------- |
| Override penuh    | tanpa `super()`  | Perilaku parent digantikan seluruhnya         |
| Override tambahan | dengan `super()` | Perilaku parent tetap berjalan, lalu ditambah |

```python
class Mahasiswa(User):
    def login(self):
        super().login()
        print(f"Selamat datang, Mahasiswa {self.nama}!")

    def logout(self):
        print("Sampai jumpa")
```

Method `login()` menggunakan override tambahan, sedangkan `logout()` menggunakan override penuh.

{% capture m5_override_dua_bentuk %}class User:
    def __init__(self, nama):
        self.nama = nama

    def login(self):
        print(f"{self.nama} berhasil login")

    def logout(self):
        print(f"{self.nama} berhasil logout")

class Mahasiswa(User):
    def login(self): # TODO: jalankan login() milik parent, lalu cetak # "Selamat datang, Mahasiswa <nama>!"
        pass

    def logout(self):
        # TODO: ganti seluruh perilaku parent, cukup cetak "Sampai jumpa"
        pass

# Program utama

mahasiswa = Mahasiswa("Andi")
mahasiswa.login()
mahasiswa.logout()

# Output yang diharapkan:

# Andi berhasil login

# Selamat datang, Mahasiswa Andi!

# Sampai jumpa

{% endcapture %}
{% include pyodide-exercise.html id="m5-override-dua-bentuk" title="Override penuh dan override tambahan" prompt="Terapkan dua bentuk override pada satu class, yaitu login() yang tetap menjalankan perilaku parent dan logout() yang menggantinya seluruhnya." starter=m5_override_dua_bentuk %}

### 4. Kompatibilitas parameter

Pada override, nama dan parameter method yang dioverride harus kompatibel dengan method di parent class. Kompatibel berarti method di child class tetap dapat dipanggil dengan cara yang sama seperti method di parent class.

```python
class User:
    def login(self, perangkat="web"):
        print(f"login melalui {perangkat}")

class Dosen(User):
    def login(self, perangkat="web"):
        super().login(perangkat)
        print("Halaman dosen dibuka")
```

Jika parameter `perangkat` dihilangkan pada child class, pemanggilan `dosen.login("mobile")` akan menghasilkan `TypeError`. Kode yang sebelumnya berjalan pada parent class menjadi gagal ketika object child class digunakan.

{% capture m5_override_parameter %}class User:
    def __init__(self, nama):
        self.nama = nama

    def login(self, perangkat="web"):
        print(f"{self.nama} login melalui {perangkat}")

class DosenSalah(User): # Method ini sengaja dibuat tidak kompatibel, biarkan apa adanya
    def login(self):
        print("Halaman dosen dibuka")

class DosenBenar(User): # TODO: override login() dengan parameter yang kompatibel, yaitu perangkat="web" # TODO: jalankan login() milik parent, lalu cetak "Halaman dosen dibuka"
    pass

# Program utama

try:
    DosenSalah("Obie").login("mobile")
except TypeError as error:
    print("TypeError:", error)

DosenBenar("Obie").login()
DosenBenar("Obie").login("mobile")

# Output yang diharapkan:

# TypeError: DosenSalah.login() takes 1 positional argument but 2 were given

# Obie login melalui web

# Halaman dosen dibuka

# Obie login melalui mobile

# Halaman dosen dibuka

# (teks pesan error dapat sedikit berbeda antarversi Python)

{% endcapture %}
{% include pyodide-exercise.html id="m5-override-parameter" title="Kompatibilitas parameter saat override" prompt="Jalankan kode untuk melihat error dari override dengan parameter yang tidak kompatibel, lalu lengkapi class kedua dengan parameter yang sesuai." starter=m5_override_parameter %}

---

## F. LATIHAN TERAPAN: USER, DOSEN, DAN MAHASISWA

Rancangan class berikut menggabungkan inheritance, `super()`, dan method overriding.

| Class               | Attribute                      | Method                                             |
| :------------------ | :----------------------------- | :------------------------------------------------- |
| `User` (parent)     | nama, email                    | `login()`, `logout()`                              |
| `Dosen` (child)     | nip (19 digit), matkul_diajar  | `input_nilai()`, override `login()` dan `logout()` |
| `Mahasiswa` (child) | nim (11 digit), matkul_diambil | `cek_nilai()`, override `login()` dan `logout()`   |

Ketentuan yang harus dipenuhi adalah sebagai berikut:

1. `Dosen` dan `Mahasiswa` mewarisi `User`.
2. Constructor child class menggunakan `super()` untuk menginisialisasi attribute milik `User`.
3. Method `login()` dioverride pada `Dosen` dan `Mahasiswa`.
4. Method `login()` pada child class menjalankan `super().login()` lalu menambahkan pesan khusus.
5. Pesan khusus `Dosen` adalah "Selamat datang, Dosen [nama]!".
6. Pesan khusus `Mahasiswa` adalah "Selamat datang, Mahasiswa [nama]!".
7. Dibuat minimal satu object `Dosen` dan satu object `Mahasiswa`, lalu seluruh method diuji.

{% capture m5_letscode_user %}class User:
    def __init__(self, nama, email): # TODO: isi attribute nama dan email
        pass

    def login(self):
        # TODO: cetak "<nama> berhasil login"
        pass

    def logout(self):
        # TODO: cetak "<nama> berhasil logout"
        pass

class Dosen(User):
    def __init__(self, nama, email, nip, matkul_diajar): # TODO: panggil constructor parent untuk nama dan email # TODO: isi attribute nip dan matkul_diajar
        pass

    def login(self):
        # TODO: jalankan login() milik parent
        # TODO: cetak "Selamat datang, Dosen <nama>!"
        pass

    def logout(self):
        # TODO: jalankan logout() milik parent
        # TODO: cetak "Sesi dosen ditutup"
        pass

    def input_nilai(self, nilai):
        # TODO: cetak "Nilai <nilai> untuk <matkul_diajar> tersimpan"
        pass

class Mahasiswa(User):
    def __init__(self, nama, email, nim, matkul_diambil): # TODO: panggil constructor parent untuk nama dan email # TODO: isi attribute nim dan matkul_diambil
        pass

    def login(self):
        # TODO: jalankan login() milik parent
        # TODO: cetak "Selamat datang, Mahasiswa <nama>!"
        pass

    def logout(self):
        # TODO: jalankan logout() milik parent
        # TODO: cetak "Sesi mahasiswa ditutup"
        pass

    def cek_nilai(self):
        # TODO: cetak "Nilai <matkul_diambil> belum tersedia"
        pass

# Program utama

dosen = Dosen("Obie", "obie@unesa.ac.id", "1990010120200110001", "PBO")
mahasiswa = Mahasiswa("Andi", "andi@mhs.unesa.ac.id", "25051204001", "PBO")

dosen.login()
dosen.input_nilai(90)
dosen.logout()
print("---")
mahasiswa.login()
mahasiswa.cek_nilai()
mahasiswa.logout()

# Output yang diharapkan:

# Obie berhasil login

# Selamat datang, Dosen Obie!

# Nilai 90 untuk PBO tersimpan

# Obie berhasil logout

# Sesi dosen ditutup

# ---

# Andi berhasil login

# Selamat datang, Mahasiswa Andi!

# Nilai PBO belum tersedia

# Andi berhasil logout

# Sesi mahasiswa ditutup

{% endcapture %}
{% include pyodide-exercise.html id="m5-letscode-user-dosen-mahasiswa" title="Program User, Dosen, dan Mahasiswa" prompt="Lengkapi satu parent class dan dua child class. Gunakan super() pada constructor dan pada method login() serta logout() yang dioverride." starter=m5_letscode_user %}

Panjang `nip` dan `nim` dapat diperiksa dengan validasi sederhana pada constructor, sebagaimana dipelajari pada modul sebelumnya.

{% capture m5_validasi_nip %}class User:
    def __init__(self, nama, email):
        self.nama = nama
        self.email = email

class Dosen(User):
    def __init__(self, nama, email, nip): # TODO: panggil constructor parent # TODO: raise ValueError("NIP harus 19 digit.") jika panjang nip bukan 19 # TODO: isi attribute nip
        pass

class Mahasiswa(User):
    def __init__(self, nama, email, nim): # TODO: panggil constructor parent # TODO: raise ValueError("NIM harus 11 digit.") jika panjang nim bukan 11 # TODO: isi attribute nim
        pass

# Program utama

data = [
    ("dosen", "Obie", "1990010120200110001"),
    ("dosen", "Rina", "199001"),
    ("mahasiswa", "Andi", "25051204001"),
    ("mahasiswa", "Sari", "2505"),
]

for peran, nama, nomor in data:
    try:
        if peran == "dosen":
            orang = Dosen(nama, "email@unesa.ac.id", nomor)
        else:
            orang = Mahasiswa(nama, "email@unesa.ac.id", nomor)
        print("OK", nama)
    except ValueError as error:
        print("GAGAL", nama, error)

# Output yang diharapkan:

# OK Obie

# GAGAL Rina NIP harus 19 digit.

# OK Andi

# GAGAL Sari NIM harus 11 digit.

{% endcapture %}
{% include pyodide-exercise.html id="m5-validasi-nip-nim" title="Validasi pada constructor child class" prompt="Panggil constructor parent terlebih dahulu, lalu tambahkan pemeriksaan panjang NIP dan NIM pada constructor masing-masing child class." starter=m5_validasi_nip %}

---

## G. MULTILEVEL INHERITANCE

### 1. Pengertian

Multilevel inheritance atau nested inheritance adalah pewarisan bertingkat, yaitu ketika sebuah class mewarisi class yang juga merupakan class turunan. Susunan tersebut membentuk sebuah rantai, misalnya kakek, ayah, lalu cucu.

```text
Class A (Grandparent)
        |
Class B (Parent)
        |
Class C (Child)
```

Jika `C` mewarisi `B` dan `B` mewarisi `A`, maka `C` otomatis juga mewarisi `A`. Makin ke bawah, makin banyak attribute dan method yang dimiliki sebuah class.

### 2. Penelusuran attribute dan method

Ketika sebuah attribute atau method dipanggil, Python menelusuri class `C` terlebih dahulu, kemudian `B`, kemudian `A`, sampai attribute atau method tersebut ditemukan.

```python
class Kendaraan:
    def __init__(self, merk, tahun):
        self.merk = merk
        self.tahun = tahun

    def nyalakan(self):
        print(f"{self.merk} menyala")

class Mobil(Kendaraan):
    def __init__(self, merk, tahun, jumlah_pintu):
        super().__init__(merk, tahun)
        self.jumlah_pintu = jumlah_pintu

    def buka_bagasi(self):
        print(f"Bagasi {self.merk} dibuka")

class MobilListrik(Mobil):
    def __init__(self, merk, tahun, jumlah_pintu, kapasitas_baterai):
        super().__init__(merk, tahun, jumlah_pintu)
        self.kapasitas_baterai = kapasitas_baterai

    def isi_baterai(self):
        print(f"{self.merk} sedang mengisi baterai")

mobil = MobilListrik("Tesla", 2024, 4, 75)
mobil.nyalakan()
mobil.buka_bagasi()
mobil.isi_baterai()
```

Output yang diharapkan:

```text
Tesla menyala
Bagasi Tesla dibuka
Tesla sedang mengisi baterai
```

Object `mobil` memiliki empat attribute dan tiga method meskipun class `MobilListrik` hanya menuliskan satu attribute dan satu method tambahan.

Perhatikan bahwa `super()` pada `MobilListrik` memanggil constructor `Mobil`, kemudian `super()` pada `Mobil` memanggil constructor `Kendaraan`. Rantai tersebut berjalan otomatis selama setiap class memanggil `super()`.

{% capture m5_multilevel_kendaraan %}class Kendaraan:
    def __init__(self, merk, tahun):
        self.merk = merk
        self.tahun = tahun

    def nyalakan(self):
        print(f"{self.merk} menyala")

class Mobil(Kendaraan):
    def __init__(self, merk, tahun, jumlah_pintu): # TODO: panggil constructor Kendaraan, lalu isi jumlah_pintu
        pass

    def buka_bagasi(self):
        print(f"Bagasi {self.merk} dibuka")

class MobilListrik(Mobil):
    def __init__(self, merk, tahun, jumlah_pintu, kapasitas_baterai): # TODO: panggil constructor Mobil, lalu isi kapasitas_baterai
        pass

    def isi_baterai(self):
        # TODO: cetak "<merk> sedang mengisi baterai"
        pass

# Program utama

mobil = MobilListrik("Tesla", 2024, 4, 75)
print(mobil.merk, mobil.tahun, mobil.jumlah_pintu, mobil.kapasitas_baterai)
mobil.nyalakan()
mobil.buka_bagasi()
mobil.isi_baterai()

# Output yang diharapkan:

# Tesla 2024 4 75

# Tesla menyala

# Bagasi Tesla dibuka

# Tesla sedang mengisi baterai

{% endcapture %}
{% include pyodide-exercise.html id="m5-multilevel-kendaraan" title="Multilevel inheritance tiga tingkat" prompt="Susun rantai pewarisan tiga tingkat. Setiap child class memanggil constructor parent di atasnya melalui super() agar seluruh attribute terisi." starter=m5_multilevel_kendaraan %}

### 3. Override pada rantai pewarisan

Method yang sama dapat dioverride pada lebih dari satu tingkat. Pemanggilan `super()` akan menjalankan method milik class tepat di atasnya pada rantai tersebut.

{% capture m5_multilevel_sivitas %}class User:
    def __init__(self, nama, email):
        self.nama = nama
        self.email = email

    def login(self):
        print(f"{self.nama} berhasil login")

class Mahasiswa(User):
    def __init__(self, nama, email, nim):
        super().__init__(nama, email)
        self.nim = nim

    def login(self):
        super().login()
        print(f"Selamat datang, Mahasiswa {self.nama}!")

    def cek_nilai(self):
        print(f"{self.nim} membuka daftar nilai")

class AsistenPraktikum(Mahasiswa):
    def __init__(self, nama, email, nim, matkul_asistensi): # TODO: panggil constructor Mahasiswa, lalu isi matkul_asistensi
        pass

    def login(self):
        # TODO: jalankan login() milik Mahasiswa melalui super()
        # TODO: cetak "Mode asisten praktikum <matkul_asistensi> aktif"
        pass

    def rekap_kehadiran(self):
        # TODO: cetak "<nama> merekap kehadiran praktikum <matkul_asistensi>"
        pass

# Program utama

asisten = AsistenPraktikum("Andi", "andi@mhs.unesa.ac.id", "25051204001", "PBO")
asisten.login()
asisten.cek_nilai()
asisten.rekap_kehadiran()
print(isinstance(asisten, Mahasiswa), isinstance(asisten, User))

# Output yang diharapkan:

# Andi berhasil login

# Selamat datang, Mahasiswa Andi!

# Mode asisten praktikum PBO aktif

# 25051204001 membuka daftar nilai

# Andi merekap kehadiran praktikum PBO

# True True

{% endcapture %}
{% include pyodide-exercise.html id="m5-multilevel-asisten" title="Override bertingkat pada multilevel inheritance" prompt="Tambahkan tingkat ketiga pada rantai User dan Mahasiswa. Override login() sekali lagi dan amati urutan pesan yang tercetak." starter=m5_multilevel_sivitas %}

---

## H. MULTIPLE INHERITANCE

### 1. Pengertian

Multiple inheritance adalah pewarisan ketika satu child class memiliki lebih dari satu parent class, sehingga child class tersebut menggabungkan attribute dan method dari semua parent-nya.

```python
class C(A, B):
    pass
```

Class `C` mewarisi dari `A` dan `B` sekaligus. Bentuk tersebut cocok untuk peran ganda, misalnya asisten dosen yang berperan sebagai mahasiswa sekaligus pengajar.

Parent yang ditulis lebih kiri diprioritaskan. Aturan pengurutannya disebut MRO.

### 2. Memanggil constructor lebih dari satu parent

Ketika kedua parent memiliki `__init__()` sendiri, constructor keduanya dapat dipanggil secara langsung melalui nama class masing-masing.

```python
class Mobil:
    def __init__(self, merk, tahun):
        self.merk = merk
        self.tahun = tahun

    def berkendara(self):
        print(f"{self.merk} sedang berkendara di jalan")

class Perahu:
    def __init__(self, kapasitas_penumpang, jenis_mesin):
        self.kapasitas_penumpang = kapasitas_penumpang
        self.jenis_mesin = jenis_mesin

    def berlayar(self):
        print("Perahu sedang berlayar di air")

class MobilAmfibi(Mobil, Perahu):
    def __init__(self, merk, tahun, kapasitas_penumpang, jenis_mesin):
        Mobil.__init__(self, merk, tahun)
        Perahu.__init__(self, kapasitas_penumpang, jenis_mesin)

    def berpindah_mode(self):
        print("Mobil berpindah dari mode darat ke mode air.")

mobil_amfibi = MobilAmfibi("Gibbs Aquada", 2024, 4, "Jet Propulsion")
print("Merk:", mobil_amfibi.merk)
print("Jenis mesin:", mobil_amfibi.jenis_mesin)
mobil_amfibi.berkendara()
mobil_amfibi.berlayar()
mobil_amfibi.berpindah_mode()
```

Output yang diharapkan:

```text
Merk: Gibbs Aquada
Jenis mesin: Jet Propulsion
Gibbs Aquada sedang berkendara di jalan
Perahu sedang berlayar di air
Mobil berpindah dari mode darat ke mode air.
```

Perhatikan bahwa `self` dituliskan secara eksplisit pada `Mobil.__init__(self, ...)`. Penulisan tersebut berbeda dengan `super().__init__(...)` yang mengisi `self` secara otomatis.

{% capture m5_multiple_dasar %}class Mobil:
    def __init__(self, merk, tahun):
        self.merk = merk
        self.tahun = tahun

    def berkendara(self):
        print(f"{self.merk} sedang berkendara di jalan")

class Perahu:
    def __init__(self, kapasitas_penumpang, jenis_mesin):
        self.kapasitas_penumpang = kapasitas_penumpang
        self.jenis_mesin = jenis_mesin

    def berlayar(self):
        print("Perahu sedang berlayar di air")

# TODO: buat class MobilAmfibi yang mewarisi Mobil dan Perahu

# TODO: pada constructor, panggil constructor kedua parent secara langsung

# TODO: tambahkan method berpindah_mode() yang mencetak

# "Mobil berpindah dari mode darat ke mode air."

# Program utama

mobil_amfibi = MobilAmfibi("Gibbs Aquada", 2024, 4, "Jet Propulsion")
print("Merk:", mobil_amfibi.merk)
print("Tahun:", mobil_amfibi.tahun)
print("Kapasitas penumpang:", mobil_amfibi.kapasitas_penumpang)
print("Jenis mesin:", mobil_amfibi.jenis_mesin)
mobil_amfibi.berkendara()
mobil_amfibi.berlayar()
mobil_amfibi.berpindah_mode()

# Output yang diharapkan:

# Merk: Gibbs Aquada

# Tahun: 2024

# Kapasitas penumpang: 4

# Jenis mesin: Jet Propulsion

# Gibbs Aquada sedang berkendara di jalan

# Perahu sedang berlayar di air

# Mobil berpindah dari mode darat ke mode air.

{% endcapture %}
{% include pyodide-exercise.html id="m5-multiple-dasar" title="Multiple inheritance dua parent" prompt="Buat satu child class dari dua parent class yang tidak berhubungan. Panggil constructor kedua parent secara langsung agar seluruh attribute terisi." starter=m5_multiple_dasar %}

### 3. Multiple inheritance untuk peran ganda

{% capture m5_multiple_asisten %}class Mahasiswa:
    def __init__(self, nama, nim):
        self.nama = nama
        self.nim = nim

    def mengambil_matkul(self, matkul):
        print(f"{self.nama} mengambil {matkul}")

class Pengajar:
    def __init__(self, matkul_diajar):
        self.matkul_diajar = matkul_diajar

    def mengajar(self):
        print(f"Mengajar {self.matkul_diajar}")

class AsistenDosen(Mahasiswa, Pengajar):
    def __init__(self, nama, nim, matkul_diajar): # TODO: panggil constructor Mahasiswa untuk nama dan nim # TODO: panggil constructor Pengajar untuk matkul_diajar
        pass

    def input_nilai(self, nilai):
        # TODO: cetak "<nama> menginput nilai <nilai> untuk <matkul_diajar>"
        pass

# Program utama

asisten = AsistenDosen("Andi", "25051204001", "PBO")
asisten.mengambil_matkul("Struktur Data")
asisten.mengajar()
asisten.input_nilai(90)
print(isinstance(asisten, Mahasiswa), isinstance(asisten, Pengajar))

# Output yang diharapkan:

# Andi mengambil Struktur Data

# Mengajar PBO

# Andi menginput nilai 90 untuk PBO

# True True

{% endcapture %}
{% include pyodide-exercise.html id="m5-multiple-asisten-dosen" title="Peran ganda dengan multiple inheritance" prompt="Gabungkan peran Mahasiswa dan Pengajar ke dalam satu class AsistenDosen. Object hasilnya harus dikenali sebagai object kedua parent." starter=m5_multiple_asisten %}

---

## I. METHOD RESOLUTION ORDER (MRO)

### 1. Diamond problem

Diamond problem terjadi ketika sebuah child class mewarisi dari dua parent class yang memiliki satu base class yang sama.

```text
            Class A (Grandparent)
             /              \
    Class B (Parent 1)   Class C (Parent 2)
             \              /
            Class D (Child)
```

Pada susunan tersebut, muncul pertanyaan method milik siapa yang dijalankan ketika `B` dan `C` sama-sama memiliki method dengan nama yang sama.

### 2. Pengertian MRO

Method Resolution Order (MRO) adalah urutan yang digunakan Python untuk mencari method atau attribute ketika sebuah object memanggil sesuatu yang bisa berasal dari beberapa class.

```python
class A:
    def hello(self):
        print("Hello from A")

class B:
    def hello(self):
        print("Hello from B")

class C(A, B):
    pass

obj = C()
obj.hello()
print(C.mro())
```

Output yang diharapkan:

```text
Hello from A
[<class '__main__.C'>, <class '__main__.A'>, <class '__main__.B'>, <class 'object'>]
```

Method `hello()` milik `A` yang dijalankan karena `A` ditulis lebih kiri pada `class C(A, B)`. Urutan pencariannya adalah `C`, lalu `A`, lalu `B`, lalu `object`.

Class `object` adalah base class bawaan Python. Semua class pada Python merupakan turunan dari `object`, meskipun hal tersebut tidak dituliskan.

### 3. Cara melihat MRO

MRO dapat dilihat melalui dua cara yang memberikan hasil sama.

```python
print(C.mro())
print(C.__mro__)
```

Penulisan `C.mro` tanpa tanda kurung tidak menampilkan urutan MRO, melainkan menampilkan object method-nya.

{% capture m5_mro %}class A:
    def hello(self):
        print("Hello from A")

class B:
    def hello(self):
        print("Hello from B")

class C(A, B):
    pass

# TODO: buat class D yang mewarisi B dan A dengan urutan terbalik dari class C

# Program utama

C().hello()
D().hello()
print([kelas.__name__ for kelas in C.mro()])
print([kelas.__name__ for kelas in D.mro()])

# Output yang diharapkan:

# Hello from A

# Hello from B

# ['C', 'A', 'B', 'object']

# ['D', 'B', 'A', 'object']

{% endcapture %}
{% include pyodide-exercise.html id="m5-mro-urutan" title="Membaca urutan MRO" prompt="Buat dua child class dengan urutan parent yang berbeda, lalu bandingkan method mana yang dijalankan dan bagaimana urutan MRO-nya." starter=m5_mro %}

### 4. MRO pada susunan diamond

```python
class Karakter:
    def status(self):
        print("Karakter")

class Warrior(Karakter):
    def status(self):
        print("Warrior")
        super().status()

class MagicUser(Karakter):
    def status(self):
        print("MagicUser")
        super().status()

class Paladin(Warrior, MagicUser):
    def status(self):
        print("Paladin")
        super().status()

Paladin().status()
```

Output yang diharapkan:

```text
Paladin
Warrior
MagicUser
Karakter
```

Meskipun `Warrior` merupakan turunan langsung dari `Karakter`, pemanggilan `super().status()` di dalam `Warrior` tidak langsung menuju `Karakter`. Pemanggilan tersebut mengikuti urutan MRO milik object yang sedang berjalan, yaitu `Paladin`, `Warrior`, `MagicUser`, `Karakter`.

Dengan demikian, `super()` tidak selalu berarti parent langsung. `super()` berarti class berikutnya pada urutan MRO.

{% capture m5_diamond %}class Karakter:
    def status(self):
        print("Karakter")

class Warrior(Karakter):
    def status(self): # TODO: cetak "Warrior", lalu lanjutkan ke class berikutnya melalui super()
        pass

class MagicUser(Karakter):
    def status(self): # TODO: cetak "MagicUser", lalu lanjutkan ke class berikutnya melalui super()
        pass

class Paladin(Warrior, MagicUser):
    def status(self): # TODO: cetak "Paladin", lalu lanjutkan ke class berikutnya melalui super()
        pass

# Program utama

Paladin().status()
print([kelas.__name__ for kelas in Paladin.mro()])

# Output yang diharapkan:

# Paladin

# Warrior

# MagicUser

# Karakter

# ['Paladin', 'Warrior', 'MagicUser', 'Karakter', 'object']

{% endcapture %}
{% include pyodide-exercise.html id="m5-diamond-mro" title="super() pada susunan diamond" prompt="Panggil super() pada setiap tingkat, lalu amati bahwa urutan eksekusinya mengikuti MRO dan bukan sekadar parent langsung." starter=m5_diamond %}

---

## J. JENIS-JENIS INHERITANCE

| Jenis                    | Susunan                         | Contoh                                                    |
| :----------------------- | :------------------------------ | :-------------------------------------------------------- |
| Single inheritance       | Satu parent, satu child         | `Mobil(Kendaraan)`                                        |
| Multilevel inheritance   | Rantai bertingkat               | `Mobil(Kendaraan)` lalu `MobilListrik(Mobil)`             |
| Hierarchical inheritance | Satu parent, beberapa child     | `Dosen(User)`, `Mahasiswa(User)`, `Tendik(User)`          |
| Multiple inheritance     | Satu child, beberapa parent     | `AsistenDosen(Mahasiswa, Pengajar)`                       |
| Hybrid inheritance       | Gabungan beberapa jenis di atas | `Paladin(Warrior, MagicUser)` lalu `HolyPaladin(Paladin)` |

Pada beberapa bahasa pemrograman lain, misalnya Java, multiple inheritance tidak diizinkan antarclass dan digantikan oleh interface. Python mengizinkan multiple inheritance antarclass secara langsung, dengan MRO sebagai aturan penyelesaiannya.

---

## K. STUDI KASUS TERPADU

Sebuah game memiliki berbagai jenis karakter dengan kemampuan yang berbeda. Setiap karakter memiliki nama dan HP, serta dapat melakukan aktivitas dasar seperti bergerak dan menampilkan status.

Dalam game tersebut terdapat:

1. Karakter `Warrior` yang memiliki kekuatan untuk menyerang.
2. Karakter `MagicUser` yang memiliki mana untuk menggunakan sihir.
3. Karakter `Paladin` yang memiliki kemampuan `Warrior` sekaligus `MagicUser`, serta memiliki kemampuan khusus untuk menyembuhkan.
4. Karakter `HolyPaladin` yang merupakan pengembangan dari `Paladin` dan memiliki kemampuan sihir khusus.

```text
                    Karakter
                    nama, hp
          bergerak(), tampilkan_status()
                 /            \
           Warrior          MagicUser
           kekuatan            mana
          menyerang()   menggunakan_sihir()
                 \            /
                    Paladin
                 menyembuhkan()
                       |
                   HolyPaladin
                   sihir_suci()
```

Susunan tersebut menggunakan seluruh materi modul ini sekaligus. `Warrior` dan `MagicUser` merupakan single inheritance dari `Karakter`. `Paladin` merupakan multiple inheritance. `HolyPaladin` merupakan multilevel inheritance dari `Paladin`.

### 1. Karakter dasar dan dua turunannya

{% capture m5_game_dasar %}class Karakter:
    def __init__(self, nama, hp): # TODO: isi attribute nama dan hp
        pass

    def bergerak(self):
        # TODO: cetak "<nama> bergerak"
        pass

    def tampilkan_status(self):
        # TODO: cetak "<nama> | HP: <hp>"
        pass

class Warrior(Karakter):
    def __init__(self, nama, hp, kekuatan): # TODO: panggil constructor Karakter, lalu isi kekuatan
        pass

    def menyerang(self):
        # TODO: cetak "<nama> menyerang dengan kekuatan <kekuatan>"
        pass

    def tampilkan_status(self):
        # TODO: jalankan tampilkan_status() milik parent melalui super()
        # TODO: cetak "Kekuatan: <kekuatan>"
        pass

class MagicUser(Karakter):
    def __init__(self, nama, hp, mana): # TODO: panggil constructor Karakter, lalu isi mana
        pass

    def menggunakan_sihir(self):
        # TODO: cetak "<nama> menggunakan sihir, sisa mana <mana>"
        pass

    def tampilkan_status(self):
        # TODO: jalankan tampilkan_status() milik parent melalui super()
        # TODO: cetak "Mana: <mana>"
        pass

# Program utama

warrior = Warrior("Arthas", 120, 30)
magic = MagicUser("Jaina", 80, 50)

warrior.bergerak()
warrior.menyerang()
warrior.tampilkan_status()
print("---")
magic.bergerak()
magic.menggunakan_sihir()
magic.tampilkan_status()

# Output yang diharapkan:

# Arthas bergerak

# Arthas menyerang dengan kekuatan 30

# Arthas | HP: 120

# Kekuatan: 30

# ---

# Jaina bergerak

# Jaina menggunakan sihir, sisa mana 50

# Jaina | HP: 80

# Mana: 50

{% endcapture %}
{% include pyodide-exercise.html id="m5-studi-kasus-game-dasar" title="Karakter, Warrior, dan MagicUser" prompt="Lengkapi satu parent class dan dua child class. Gunakan super() pada constructor dan pada method tampilkan_status() yang dioverride." starter=m5_game_dasar %}

### 2. Paladin dan HolyPaladin

Class `Paladin` mewarisi `Warrior` dan `MagicUser` sekaligus. Constructor kedua parent dipanggil secara langsung melalui nama class masing-masing.

Sebelum melengkapi latihan berikutnya, terdapat satu hal penting yang perlu diperhatikan. Pada latihan sebelumnya, constructor `Warrior` dan `MagicUser` menggunakan `super().__init__(nama, hp)`. Penulisan tersebut benar selama kedua class dipakai sendiri-sendiri.

Namun, `Warrior` dan `MagicUser` kini digabungkan menjadi `Paladin`. Sesuai pembahasan pada bagian I, `super()` mengikuti urutan MRO milik object yang sedang dibuat, bukan parent langsung. Urutan MRO `Paladin` adalah `Paladin`, `Warrior`, `MagicUser`, `Karakter`.

Akibatnya, `super().__init__(nama, hp)` di dalam `Warrior` tidak menuju `Karakter`, melainkan menuju `MagicUser`. Class `MagicUser` membutuhkan `mana`, sehingga muncul error berikut:

```text
TypeError: MagicUser.__init__() missing 1 required positional argument: 'mana'
```

Cara paling sederhana untuk mengatasinya adalah memanggil constructor `Karakter` secara langsung melalui nama class, yaitu `Karakter.__init__(self, nama, hp)`. Penulisan tersebut tidak mengikuti MRO, sehingga selalu menuju class yang namanya ditulis.

Perhatikan pula bahwa karena `Warrior` dan `MagicUser` sama-sama merupakan turunan `Karakter`, constructor `Karakter` akan terpanggil dua kali. Pada program ini hal tersebut tidak menimbulkan masalah karena nilai `nama` dan `hp` yang diisi ulang sama.

{% capture m5_game_paladin %}class Karakter:
    def __init__(self, nama, hp):
        self.nama = nama
        self.hp = hp

    def bergerak(self):
        print(f"{self.nama} bergerak")

    def tampilkan_status(self):
        print(f"{self.nama} | HP: {self.hp}")

class Warrior(Karakter):
    def __init__(self, nama, hp, kekuatan): # constructor Karakter dipanggil langsung, bukan melalui super(), # karena class ini akan digabungkan melalui multiple inheritance
        Karakter.__init__(self, nama, hp)
        self.kekuatan = kekuatan

    def menyerang(self):
        print(f"{self.nama} menyerang dengan kekuatan {self.kekuatan}")

class MagicUser(Karakter):
    def __init__(self, nama, hp, mana):
        Karakter.__init__(self, nama, hp)
        self.mana = mana

    def menggunakan_sihir(self):
        print(f"{self.nama} menggunakan sihir, sisa mana {self.mana}")

class Paladin(Warrior, MagicUser):
    def __init__(self, nama, hp, kekuatan, mana): # TODO: panggil constructor Warrior untuk nama, hp, dan kekuatan # TODO: panggil constructor MagicUser untuk nama, hp, dan mana
        pass

    def menyembuhkan(self, target):
        # TODO: cetak "<nama> menyembuhkan <target>"
        pass

    def tampilkan_status(self):
        # TODO: jalankan tampilkan_status() milik parent melalui super()
        # TODO: cetak "Kekuatan: <kekuatan> | Mana: <mana>"
        pass

class HolyPaladin(Paladin):
    def __init__(self, nama, hp, kekuatan, mana, sihir_khusus): # TODO: panggil constructor Paladin, lalu isi sihir_khusus
        pass

    def sihir_suci(self):
        # TODO: cetak "<nama> merapalkan <sihir_khusus>"
        pass

# Program utama

paladin = Paladin("Uther", 150, 40, 60)
holy = HolyPaladin("Tirion", 180, 45, 70, "Divine Shield")

paladin.menyerang()
paladin.menggunakan_sihir()
paladin.menyembuhkan("Arthas")
paladin.tampilkan_status()
print("---")
holy.bergerak()
holy.menyerang()
holy.menyembuhkan("Jaina")
holy.sihir_suci()
holy.tampilkan_status()

# Output yang diharapkan:

# Uther menyerang dengan kekuatan 40

# Uther menggunakan sihir, sisa mana 60

# Uther menyembuhkan Arthas

# Uther | HP: 150

# Kekuatan: 40 | Mana: 60

# ---

# Tirion bergerak

# Tirion menyerang dengan kekuatan 45

# Tirion menyembuhkan Jaina

# Tirion merapalkan Divine Shield

# Tirion | HP: 180

# Kekuatan: 45 | Mana: 70

{% endcapture %}
{% include pyodide-exercise.html id="m5-studi-kasus-game-paladin" title="Paladin dan HolyPaladin" prompt="Gabungkan Warrior dan MagicUser menjadi Paladin melalui multiple inheritance, lalu kembangkan Paladin menjadi HolyPaladin melalui multilevel inheritance." starter=m5_game_paladin %}

### 3. Sistem pengguna akademik

Studi kasus terakhir mengembalikan pembahasan pada sistem informasi akademik yang dibahas pada bagian pendahuluan.

{% capture m5_studi_kasus_sivitas %}class User:
    def __init__(self, nama, email, username, password): # TODO: isi keempat attribute
        pass

    def login(self):
        # TODO: cetak "<username> berhasil login"
        pass

    def logout(self):
        # TODO: cetak "<username> berhasil logout"
        pass

    def tampilkan_identitas(self):
        # TODO: cetak "<nama> <email>"
        pass

class Dosen(User):
    def __init__(self, nama, email, username, password, nip, matkul_diajar): # TODO: panggil constructor parent, lalu isi nip dan matkul_diajar
        pass

    def login(self):
        # TODO: jalankan login() milik parent
        # TODO: cetak "Selamat datang, Dosen <nama>!"
        pass

    def mengajar_matkul(self):
        # TODO: cetak "<nama> mengajar <matkul_diajar>"
        pass

class Mahasiswa(User):
    def __init__(self, nama, email, username, password, nim, matkul_diambil): # TODO: panggil constructor parent, lalu isi nim dan matkul_diambil
        pass

    def login(self):
        # TODO: jalankan login() milik parent
        # TODO: cetak "Selamat datang, Mahasiswa <nama>!"
        pass

    def mengambil_matkul(self):
        # TODO: cetak "<nama> mengambil <matkul_diambil>"
        pass

class Tendik(User):
    def __init__(self, nama, email, username, password, nip): # TODO: panggil constructor parent, lalu isi nip
        pass

    def input_data_mahasiswa(self):
        # TODO: cetak "<nama> menginput data mahasiswa"
        pass

# Program utama

daftar_pengguna = [
    Dosen("Obie", "obie@unesa.ac.id", "obie01", "rahasia",
    "1990010120200110001", "PBO"),
    Mahasiswa("Andi", "andi@mhs.unesa.ac.id", "andi01", "rahasia",
    "25051204001", "PBO"),
    Tendik("Rina", "rina@unesa.ac.id", "rina01", "rahasia",
    "1988010120150120002"),
]

for pengguna in daftar_pengguna:
    pengguna.login()
    pengguna.tampilkan_identitas()
    pengguna.logout()
    print("---")

# Output yang diharapkan:

# obie01 berhasil login

# Selamat datang, Dosen Obie!

# Obie obie@unesa.ac.id

# obie01 berhasil logout

# ---

# andi01 berhasil login

# Selamat datang, Mahasiswa Andi!

# Andi andi@mhs.unesa.ac.id

# andi01 berhasil logout

# ---

# rina01 berhasil login

# Rina rina@unesa.ac.id

# rina01 berhasil logout

# ---

{% endcapture %}
{% include pyodide-exercise.html id="m5-studi-kasus-sivitas" title="Sistem pengguna akademik" prompt="Lengkapi class User beserta tiga class turunannya. Perhatikan bahwa Tendik tidak melakukan override login(), sehingga pesan yang tercetak berbeda dari dua class lainnya." starter=m5_studi_kasus_sivitas %}

Perhatikan bahwa satu perulangan yang sama dapat memanggil `login()` pada ketiga object, meskipun isi method tersebut berbeda-beda. Kemampuan tersebut menjadi dasar pembahasan polymorphism pada modul berikutnya.

---

## L. RINGKASAN

| Konsep                     | Penanda                          | Kegunaan                                                    |
| :------------------------- | :------------------------------- | :---------------------------------------------------------- |
| Inheritance                | `class Child(Parent)`            | Mewarisi attribute dan method agar tidak ditulis ulang      |
| Hubungan is-a              | `isinstance()`, `issubclass()`   | Menandai bahwa child merupakan jenis dari parent            |
| `super()` pada constructor | `super().__init__(...)`          | Menjalankan constructor parent agar attribute parent terisi |
| Method overriding          | method dengan nama sama di child | Menyesuaikan perilaku warisan dengan karakteristik child    |
| `super()` pada method      | `super().nama_method()`          | Menjalankan perilaku parent lalu menambahkan perilaku child |
| Multilevel inheritance     | rantai `A` ke `B` ke `C`         | Menambah kekhususan secara bertingkat                       |
| Multiple inheritance       | `class C(A, B)`                  | Menggabungkan peran dari lebih dari satu parent             |
| MRO                        | `C.mro()`, `C.__mro__`           | Melihat urutan pencarian method dan attribute               |

Hal yang perlu diperhatikan saat menggunakan inheritance:

1. Inheritance digunakan ketika hubungan child is-a parent benar-benar terpenuhi.
2. Child class yang menuliskan `__init__()` sendiri wajib memanggil constructor parent.
3. `self` tidak dituliskan pada `super().__init__(...)`, tetapi dituliskan pada `Parent.__init__(self, ...)`.
4. Parameter method yang dioverride harus tetap kompatibel dengan method di parent class.
5. Pada multiple inheritance, parent yang ditulis lebih kiri diprioritaskan sesuai MRO.
6. `super()` mengacu pada class berikutnya dalam urutan MRO, bukan selalu pada parent langsung.
