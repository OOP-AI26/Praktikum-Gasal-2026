# Assignment 4: Abstract Method, Data Class, Mutability, dan Typing Style

**Tingkat:** Medium to Hard

## Yang Harus Diterapkan

Setiap variant meminta kamu untuk menerapkan sebagian dari hal berikut:

- membuat abstract class dengan `ABC`, abstract method, dan abstract property;
- menyusun abstract class bertingkat, yaitu class turunan yang masih abstract karena belum mengimplementasikan seluruh abstract method;
- membuat data class dengan nilai default, `field(default_factory=list)`, dan validasi di `__post_init__()`;
- membuat frozen data class, termasuk `order=True` untuk pengurutan, serta membuat versi baru dengan `replace()`;
- menghindari aliasing, default argument mutable, dan list yang tanpa sengaja dipakai bersama;
- memilih antara `copy.copy()`, `copy.deepcopy()`, dan salinan list biasa;
- menerapkan duck typing dengan `try`/`except AttributeError`, nominal typing dengan `isinstance()`, atau `Protocol` dengan `@runtime_checkable`;
- menuliskan type hints pada parameter dan nilai kembalian.

## Aturan Pengerjaan

- Masukkan NIM untuk memuat variant. Variant yang sama akan muncul lagi jika NIM yang sama digunakan.
- Lengkapi bagian `TODO` pada starter code. Program utama, signature, label output, dan test case tidak perlu diubah.
- Abstract class wajib mewarisi `ABC`. Jangan mengganti abstract method dengan `raise NotImplementedError`.
- Field list pada data class wajib memakai `field(default_factory=list)`. Default parameter berupa list wajib diganti dengan `None`.
- Record yang diminta frozen tidak boleh diubah langsung. Gunakan `replace()` untuk membuat versi barunya.
- Method yang diminta mengembalikan hasil terurut tidak boleh mengubah urutan list asli.
- Jika operasi tidak valid, kembalikan nilai sesuai kontrak dan pertahankan state yang harus dipertahankan.
- Output dibandingkan secara tepat. Jangan menambahkan `print` lain.

## Saran Pengerjaan

1. Baca format input dan urutan operasi pada bagian paling bawah starter code.
2. Tentukan class mana yang abstract, lalu tulis seluruh abstract method dan abstract property-nya lebih dahulu.
3. Lengkapi concrete class satu per satu. Jika object tidak bisa dibuat, baca pesan `TypeError`-nya karena nama method yang belum ada selalu disebutkan.
4. Kerjakan data class setelah hierarki class selesai. Periksa type hint dan urutan field.
5. Setiap kali menemukan list, tanyakan apakah list tersebut seharusnya milik satu object atau dipakai bersama.
6. Jalankan **Run Tests**. Gunakan detail test yang gagal untuk membandingkan state dan output.

## Catatan tentang Mutability

Banyak test pada homework ini sengaja membuat object kedua, menyimpan object lama, atau membuat salinan lebih dahulu sebelum data diubah. Test tersebut memeriksa bahwa perubahan pada satu object tidak ikut terlihat pada object lain.

Kesalahan yang paling sering terjadi adalah:

- menulis `krs: list = []` atau `def __init__(self, riwayat=[])`, sehingga semua object berbagi list yang sama;
- menulis `self.isi = isi_lain` tanpa menyalin, sehingga dua object menunjuk list yang sama;
- memakai `copy.copy()` untuk object yang berisi list, padahal list di dalamnya ikut dipakai bersama;
- memakai `list.sort()` di dalam method yang seharusnya hanya mengembalikan hasil terurut.

## Penilaian Mandiri

Sebelum mengumpulkan, pastikan kamu dapat menjelaskan:

- mengapa abstract class tidak dapat dibuat object-nya dan kapan error tersebut muncul;
- mengapa child dari abstract class dapat tetap menjadi abstract;
- apa yang dibuat otomatis oleh `@dataclass` dan mengapa field list memerlukan `default_factory`;
- perbedaan mengubah frozen data class secara langsung dengan membuat versi baru melalui `replace()`;
- perbedaan `is` dan `==`, serta perbedaan shallow copy dan deep copy;
- kapan memakai duck typing, `isinstance()`, atau `Protocol`.
