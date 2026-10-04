---
title: Quick Review 6
layout: default
parent: Quick Review
tampil: true
nav_order: 3
---
# Quick Review - Chapter 6

Recall singkat sebelum masuk ke study case. Fokusnya adalah cara membuat kontrak yang wajib dipenuhi child class, menyimpan data dengan ringkas, menjaga data agar tidak berubah tanpa disengaja, dan memilih cara memeriksa jenis object.

## Main topics

1. **Abstract class dan abstract method**
   - Abstract class dibuat dengan mewarisi `ABC`; method wajib diberi `@abstractmethod`.
   - Abstract class tidak dapat dibuat object-nya. Child yang belum mengimplementasikan seluruh abstract method juga tidak bisa.
   - Error muncul saat object dibuat (`TypeError`), bukan saat method dipanggil seperti pada `NotImplementedError`.
   - Abstract class tetap boleh punya constructor dan concrete method yang memanggil abstract method lewat `self`.

2. **Abstract property dan abstract bertingkat**
   - Abstract property ditulis `@property` lalu `@abstractmethod`; `@abstractmethod` selalu paling dekat dengan `def`.
   - Child wajib menyediakan property tersebut, misalnya tarif atau jumlah roda.
   - Child yang baru mengimplementasikan sebagian abstract method masih tetap abstract.

3. **Data class**
   - `@dataclass` membuat `__init__()`, `__repr__()`, dan `__eq__()` otomatis dari field.
   - Field ditulis `nama: tipe`; type hint wajib ada agar dikenali sebagai field.
   - Field tanpa default ditulis sebelum field yang memiliki default.
   - Default list/dict/set wajib memakai `field(default_factory=list)`.
   - Validasi ditulis di `__post_init__()`, bukan di `__init__()`.

4. **Data class immutable**
   - `@dataclass(frozen=True)` menolak perubahan field dengan `FrozenInstanceError`.
   - Perubahan dibuat sebagai object baru dengan `replace(objek, field=nilai_baru)`; object lama tetap utuh.
   - `frozen=True` tidak membekukan isi list di dalam field. Pakai tuple jika isinya juga tidak boleh berubah.

5. **Mutability**
   - Immutable: `int`, `float`, `bool`, `str`, `tuple`. Mutable: `list`, `dict`, `set`, object biasa.
   - `b = a` tidak menyalin object, hanya menambah label kedua (aliasing).
   - `is` memeriksa object yang sama; `==` memeriksa isi yang sama.
   - Jangan pakai `[]` sebagai default parameter atau class attribute yang seharusnya milik tiap object.
   - `copy.copy()` menyalin bagian luar saja; `copy.deepcopy()` ikut menyalin list di dalamnya.

6. **Typing style**
   - Dynamic typing: tipe melekat pada object, bukan variabel.
   - Duck typing: cukup pastikan object punya method yang dibutuhkan (`try`/`except AttributeError` atau `hasattr()`).
   - Nominal typing: `isinstance(objek, Kendaraan)`; paling kuat jika digabung dengan abstract class.
   - Type hints (`nim: str`, `-> int`, `list[str]`) tidak dipaksakan Python, tetapi diperiksa Pylance atau `mypy`.
   - `Protocol` + `@runtime_checkable` menuliskan kontrak duck typing tanpa inheritance.

## Pro Tip

1. Tentukan dulu class mana yang abstract dan method mana yang wajib diimplementasikan.
2. Selesaikan abstract class lebih dahulu, lalu lengkapi concrete class satu per satu.
3. Jika object tidak bisa dibuat, baca pesan `TypeError`-nya; nama method yang belum ada selalu disebutkan.
4. Untuk class yang hanya menyimpan data, pertimbangkan `@dataclass` sebelum menulis constructor manual.
5. Setiap kali melihat list sebagai default atau class attribute, curigai data yang tercampur antarobject.
6. Jika data harus disalin, tanyakan apakah isinya juga perlu disalin (`deepcopy`).
7. Cocokkan nama class, signature method, label, dan format output dengan starter code.

> Playground berikut bukan jawaban study case. Gunakan untuk mengingat kembali abstract class, data class, mutability, dan typing style.

## Playground: abstract class, data class, dan mutability

{% include pyodide-exercise.html id="quickreview-ch6-playground" title="Chapter 6 - Abstract class, data class, dan mutability" prompt="Jalankan starter code terlebih dahulu. Setelah itu, coba hapus property tarif_per_jam dari Motor, hapus frozen=True pada Karcis, ganti field(default_factory=list) dengan [], atau ganti alias = andi dengan copy.deepcopy(andi). Amati error atau output yang berubah." starter="import copy
from abc import ABC, abstractmethod
from dataclasses import dataclass, field, replace, FrozenInstanceError


class Kendaraan(ABC):
    def __init__(self, plat_nomor):
        self.plat_nomor = plat_nomor

    @property
    @abstractmethod
    def tarif_per_jam(self):
        pass

    def hitung_biaya(self, jam):
        return self.tarif_per_jam * jam


class Mobil(Kendaraan):
    @property
    def tarif_per_jam(self):
        return 5000


class Motor(Kendaraan):
    @property
    def tarif_per_jam(self):
        return 2000


@dataclass(frozen=True)
class Karcis:
    plat_nomor: str
    jam_masuk: int


@dataclass
class Mahasiswa:
    nama: str
    krs: list[str] = field(default_factory=list)


class Proyektor:
    def nyalakan(self) -> str:
        return 'Proyektor menampilkan slide'


# 1. Abstract class
try:
    Kendaraan('L 0000 XX')
except TypeError:
    print('Kendaraan      : abstract, tidak bisa dibuat')
print('Biaya mobil 3j :', Mobil('L 1234 AB').hitung_biaya(3))
print('Biaya motor 3j :', Motor('W 5678 EF').hitung_biaya(3))

# 2. Data class frozen
karcis = Karcis('L 1234 AB', 7)
print('Karcis         :', karcis)
try:
    karcis.jam_masuk = 9
except FrozenInstanceError:
    print('Ubah karcis    : ditolak, karcis frozen')
print('Karcis revisi  :', replace(karcis, jam_masuk=9))

# 3. Mutability
andi = Mahasiswa('Andi')
sari = Mahasiswa('Sari')
alias = andi
alias.krs.append('PBO')
print('KRS Andi       :', andi.krs)
print('KRS Sari       :', sari.krs)
print('alias is andi  :', alias is andi)
print('isi sama (==)  :', andi == Mahasiswa('Andi', ['PBO']))

# 4. Duck typing
for benda in [Proyektor(), Mobil('L 1234 AB')]:
    try:
        print('Nyalakan       :', benda.nyalakan())
    except AttributeError:
        print('Nyalakan       :', type(benda).__name__, 'tidak punya nyalakan()')
" %}

Tampilan dari kode tersebut secara visual, ada di [sini](https://pythontutor.com/render.html#code=import%20copy%0Afrom%20abc%20import%20ABC%2C%20abstractmethod%0Afrom%20dataclasses%20import%20dataclass%2C%20field%2C%20replace%2C%20FrozenInstanceError%0A%0A%0Aclass%20Kendaraan%28ABC%29%3A%0A%20%20%20%20def%20__init__%28self%2C%20plat_nomor%29%3A%0A%20%20%20%20%20%20%20%20self.plat_nomor%20%3D%20plat_nomor%0A%0A%20%20%20%20%40property%0A%20%20%20%20%40abstractmethod%0A%20%20%20%20def%20tarif_per_jam%28self%29%3A%0A%20%20%20%20%20%20%20%20pass%0A%0A%20%20%20%20def%20hitung_biaya%28self%2C%20jam%29%3A%0A%20%20%20%20%20%20%20%20return%20self.tarif_per_jam%20%2A%20jam%0A%0A%0Aclass%20Mobil%28Kendaraan%29%3A%0A%20%20%20%20%40property%0A%20%20%20%20def%20tarif_per_jam%28self%29%3A%0A%20%20%20%20%20%20%20%20return%205000%0A%0A%0Aclass%20Motor%28Kendaraan%29%3A%0A%20%20%20%20%40property%0A%20%20%20%20def%20tarif_per_jam%28self%29%3A%0A%20%20%20%20%20%20%20%20return%202000%0A%0A%0A%40dataclass%28frozen%3DTrue%29%0Aclass%20Karcis%3A%0A%20%20%20%20plat_nomor%3A%20str%0A%20%20%20%20jam_masuk%3A%20int%0A%0A%0A%40dataclass%0Aclass%20Mahasiswa%3A%0A%20%20%20%20nama%3A%20str%0A%20%20%20%20krs%3A%20list%5Bstr%5D%20%3D%20field%28default_factory%3Dlist%29%0A%0A%0Aclass%20Proyektor%3A%0A%20%20%20%20def%20nyalakan%28self%29%20-%3E%20str%3A%0A%20%20%20%20%20%20%20%20return%20%27Proyektor%20menampilkan%20slide%27%0A%0A%0A%23%201.%20Abstract%20class%0Atry%3A%0A%20%20%20%20Kendaraan%28%27L%200000%20XX%27%29%0Aexcept%20TypeError%3A%0A%20%20%20%20print%28%27Kendaraan%20%20%20%20%20%20%3A%20abstract%2C%20tidak%20bisa%20dibuat%27%29%0Aprint%28%27Biaya%20mobil%203j%20%3A%27%2C%20Mobil%28%27L%201234%20AB%27%29.hitung_biaya%283%29%29%0Aprint%28%27Biaya%20motor%203j%20%3A%27%2C%20Motor%28%27W%205678%20EF%27%29.hitung_biaya%283%29%29%0A%0A%23%202.%20Data%20class%20frozen%0Akarcis%20%3D%20Karcis%28%27L%201234%20AB%27%2C%207%29%0Aprint%28%27Karcis%20%20%20%20%20%20%20%20%20%3A%27%2C%20karcis%29%0Atry%3A%0A%20%20%20%20karcis.jam_masuk%20%3D%209%0Aexcept%20FrozenInstanceError%3A%0A%20%20%20%20print%28%27Ubah%20karcis%20%20%20%20%3A%20ditolak%2C%20karcis%20frozen%27%29%0Aprint%28%27Karcis%20revisi%20%20%3A%27%2C%20replace%28karcis%2C%20jam_masuk%3D9%29%29%0A%0A%23%203.%20Mutability%0Aandi%20%3D%20Mahasiswa%28%27Andi%27%29%0Asari%20%3D%20Mahasiswa%28%27Sari%27%29%0Aalias%20%3D%20andi%0Aalias.krs.append%28%27PBO%27%29%0Aprint%28%27KRS%20Andi%20%20%20%20%20%20%20%3A%27%2C%20andi.krs%29%0Aprint%28%27KRS%20Sari%20%20%20%20%20%20%20%3A%27%2C%20sari.krs%29%0Aprint%28%27alias%20is%20andi%20%20%3A%27%2C%20alias%20is%20andi%29%0Aprint%28%27isi%20sama%20%28%3D%3D%29%20%20%3A%27%2C%20andi%20%3D%3D%20Mahasiswa%28%27Andi%27%2C%20%5B%27PBO%27%5D%29%29%0A%0A%23%204.%20Duck%20typing%0Afor%20benda%20in%20%5BProyektor%28%29%2C%20Mobil%28%27L%201234%20AB%27%29%5D%3A%0A%20%20%20%20try%3A%0A%20%20%20%20%20%20%20%20print%28%27Nyalakan%20%20%20%20%20%20%20%3A%27%2C%20benda.nyalakan%28%29%29%0A%20%20%20%20except%20AttributeError%3A%0A%20%20%20%20%20%20%20%20print%28%27Nyalakan%20%20%20%20%20%20%20%3A%27%2C%20type%28benda%29.__name__%2C%20%27tidak%20punya%20nyalakan%28%29%27%29%0A&cumulative=false&heapPrimitives=nevernest&mode=display&origin=opt-frontend.js&py=311&rawInputLstJSON=%5B%5D&textReferences=false)

## Checklist sebelum study case

- Pastikan class yang seharusnya tidak bisa dibuat object-nya benar-benar mewarisi `ABC`.
- Pastikan setiap concrete class mengimplementasikan seluruh abstract method dan abstract property.
- Periksa urutan decorator: `@property` atau `@classmethod` di atas, `@abstractmethod` di bawah.
- Pada data class, cek type hint setiap field dan urutan field tanpa default.
- Pastikan field list memakai `default_factory`, bukan `[]`.
- Pada frozen data class, perubahan dibuat dengan `replace()`, bukan dengan mengubah field langsung.
- Pastikan data milik tiap object dibuat di `__init__()`, bukan sebagai class attribute.
- Jangan mengubah program utama, signature, label, atau format output yang sudah disediakan.
