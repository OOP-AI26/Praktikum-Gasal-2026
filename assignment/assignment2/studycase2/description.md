# Assignment 2: Class Method, Static Method, dan Decorator


<a href="https://colab.research.google.com/drive/1F8IYRt5GoCE17mh8oI6jvEcphj16fqv8?usp=sharing"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open In Colab"></a>
**Tingkat:** Easy

Pada Live Practicum 2, kamu akan melengkapi satu class yang memakai beberapa jenis method dan decorator sederhana. Setiap kelas mendapatkan study case yang berbeda, tetapi semua case menguji ide yang sama.

## Tujuan Pembelajaran

Setelah menyelesaikan tugas ini, kamu diharapkan dapat:

- membedakan instance method, `@classmethod`, dan `@staticmethod`;
- membuat class method sebagai factory method untuk membuat object dari teks;
- membuat static method untuk validasi yang tidak bergantung pada object;
- membuat custom decorator dengan wrapper yang menerima `*args` dan `**kwargs`;
- memasang dua decorator pada satu method (chaining decorator);
- meneruskan argument ke function asli tanpa mengubah urutan atau nilainya.

## Cara Mengerjakan

1. Pilih kelas sesuai jadwal praktikum.
2. Baca kontrak class dan urutan pemanggilan pada starter code.
3. Lengkapi bagian `TODO` saja. Jangan mengubah program utama.
4. Jalankan **Run** untuk mencoba program, lalu gunakan **Run Tests** untuk memeriksa semua kasus.

## Istilah Penting

- **Instance method** memiliki parameter `self` dan bekerja pada satu object.
- **Class method** memakai `cls` dan diberi penanda `@classmethod`. Method ini dapat membuat object melalui `cls(...)`, sehingga tetap benar ketika class dikembangkan.
- **Static method** tidak menerima `self` atau `cls`. Method ini cocok untuk validasi umum yang masih berkaitan dengan class.
- **Decorator** menerima sebuah function, membungkusnya dengan function lain, lalu mengembalikan function baru.
- Pada decorator, gunakan `*args` dan `**kwargs` agar wrapper dapat menerima pemanggilan positional maupun keyword arguments.
- **Chaining** berarti memasang lebih dari satu decorator pada method. Decorator yang ditulis paling dekat dengan `def` membungkus function lebih dahulu. Saat method dipanggil, wrapper paling luar berjalan lebih dahulu, lalu memanggil wrapper di dalamnya.

## Aturan

- Gunakan Python standar saja; tidak perlu library tambahan.
- Jangan menggunakan inheritance pada assignment ini.
- Jangan mengubah nama class, method, parameter, label output, atau urutan pemanggilan program utama.
- Method yang ditolak harus mengembalikan nilai sesuai kontrak dan tidak boleh mengubah state yang disebutkan.
- Counter class harus diubah melalui nama class, misalnya `NamaClass.total_object`.
- Semua wrapper decorator harus meneruskan `*args` dan `**kwargs` ke function yang dibungkus.

## Checklist

- Apakah object dibuat melalui class method pada program utama?
- Apakah validasi umum dibuat sebagai static method?
- Apakah setiap decorator memiliki `wrapper(*args, **kwargs)`?
- Apakah dua decorator benar-benar dipasang pada method sesuai starter code?
- Apakah operasi gagal meninggalkan state object seperti sebelumnya?
- Apakah output memiliki label dan urutan yang sama dengan soal?
