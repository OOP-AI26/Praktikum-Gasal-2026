# Assignment 4: Abstract Method dan Data Class

**Tingkat:** Easy

Pada Live Practicum 4, kamu akan menyusun satu abstract class beserta dua concrete class, satu frozen data class untuk record yang tidak boleh berubah, dan satu data class yang menyimpan riwayat dalam bentuk list. Setiap kelas mendapatkan study case yang berbeda, tetapi semua case menguji ide yang sama.

## Tujuan Pembelajaran

Setelah menyelesaikan tugas ini, kamu diharapkan dapat:

- membuat abstract class dengan `ABC` dan menandai method wajib dengan `@abstractmethod`;
- menulis concrete method di dalam abstract class yang memanggil abstract method melalui `self`;
- mengimplementasikan seluruh abstract method pada concrete class;
- membuat data class dengan `@dataclass` dan field list melalui `field(default_factory=list)`;
- membuat record yang tidak dapat diubah dengan `@dataclass(frozen=True)`;
- menjelaskan mengapa list milik dua object tidak boleh tercampur.

## Cara Mengerjakan

1. Pilih kelas sesuai jadwal praktikum.
2. Baca kontrak setiap class dan urutan pemanggilan pada starter code.
3. Lengkapi bagian `TODO` saja. Jangan mengubah program utama.
4. Jalankan **Run** untuk mencoba program, lalu gunakan **Run Tests** untuk memeriksa semua kasus.

## Istilah Penting

- **Abstract class** adalah class yang tidak dapat dibuat object-nya secara langsung. Abstract class berfungsi sebagai kontrak bagi class turunannya.
- **Abstract method** adalah method yang hanya dideklarasikan tanpa implementasi dan wajib diimplementasikan oleh setiap concrete class.
- **Concrete class** adalah class turunan yang sudah mengimplementasikan seluruh abstract method, sehingga object-nya dapat dibuat.
- **Data class** adalah class yang `__init__()`, `__repr__()`, dan `__eq__()`-nya dibuat otomatis oleh `@dataclass` dari daftar field.
- **Frozen data class** adalah data class yang field-nya tidak dapat diubah setelah object dibuat. Upaya mengubahnya menghasilkan `FrozenInstanceError`.
- **`default_factory`** membuat list baru untuk setiap object, sehingga list tidak dipakai bersama oleh beberapa object.

## Aturan

- Gunakan Python standar saja; tidak perlu library tambahan.
- Jangan mengubah nama class, method, parameter, label output, atau urutan pemanggilan program utama.
- Abstract class wajib mewarisi `ABC`. Jangan mengganti abstract method dengan `raise NotImplementedError`.
- Field list pada data class wajib memakai `field(default_factory=list)`, bukan `[]` maupun class attribute biasa.
- Operasi yang ditolak harus mengembalikan `False` dan tidak boleh menambah isi list.

## Checklist

- Apakah abstract class tidak dapat dibuat object-nya, sehingga baris `Abstract` bernilai `True`?
- Apakah kedua concrete class mengimplementasikan seluruh abstract method?
- Apakah class attribute yang ditimpa oleh concrete class ikut dipakai saat validasi?
- Apakah record yang disimpan tidak dapat diubah, sehingga baris `... Bisa Diubah` bernilai `False`?
- Apakah object data class kedua tetap memiliki list kosong?
- Apakah output memiliki label dan urutan yang sama dengan soal?
