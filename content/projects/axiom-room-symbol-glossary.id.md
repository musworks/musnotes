---
title: "Glosarium Simbol Axiom Room"
date: 2026-05-30T22:00:00+07:00
draft: false
math: false
type: "garden-note"
summary: "Panduan singkat untuk membaca simbol-simbol logika yang digunakan di Axiom Room."
categories: ["Digital Works", "Logic"]
tags: ["axiom room", "logic puzzle", "symbol glossary", "propositional logic"]
---

Axiom Room memakai sekumpulan kecil simbol logika untuk mengubah penalaran menjadi blok-blok yang bisa dimainkan. Halaman ini adalah glosarium singkat untuk simbol yang muncul di dua belas level pertama.

Simbol-simbol ini bukan hiasan agar logika terlihat lebih jauh dan dingin. Mereka adalah mesin kecil. Setiap simbol menentukan bagaimana sebuah pernyataan bergerak, bercabang, bergabung, atau gagal di dalam ruangan.

{{< mus-divider >}}

## Simbol inti

{{< rawhtml >}}
<div class="mus-glossary">
  <section class="mus-glossary__item">
    <div class="mus-glossary__head">
      <div class="mus-glossary__symbol mus-glossary__symbol--cluster">
        <span class="mus-glossary__label">Simbol</span>
        <code>P</code>
        <code>Q</code>
        <code>R</code>
        <code>S</code>
        <code>T</code>
      </div>
      <p class="mus-glossary__read">Dibaca sebagai: proposisi</p>
    </div>
    <div class="mus-glossary__body">
      <p class="mus-glossary__meaning">Blok pernyataan dasar. Huruf-huruf ini mewakili klaim sederhana tanpa menjelaskan isi klaimnya.</p>
      <p class="mus-glossary__example">
        <span class="mus-glossary__label">Contoh</span>
        <code>P</code>
      </p>
    </div>
  </section>

  <section class="mus-glossary__item">
    <div class="mus-glossary__head">
      <div class="mus-glossary__symbol">
        <span class="mus-glossary__label">Simbol</span>
        <code>→</code>
      </div>
      <p class="mus-glossary__read">Dibaca sebagai: jika... maka...</p>
    </div>
    <div class="mus-glossary__body">
      <p class="mus-glossary__meaning">Implikasi. Pernyataan di sebelah kiri mengarah pada pernyataan di sebelah kanan.</p>
      <p class="mus-glossary__example">
        <span class="mus-glossary__label">Contoh</span>
        <code>P → Q</code>
      </p>
    </div>
  </section>

  <section class="mus-glossary__item">
    <div class="mus-glossary__head">
      <div class="mus-glossary__symbol">
        <span class="mus-glossary__label">Simbol</span>
        <code>¬</code>
      </div>
      <p class="mus-glossary__read">Dibaca sebagai: tidak / bukan</p>
    </div>
    <div class="mus-glossary__body">
      <p class="mus-glossary__meaning">Negasi. Simbol ini menyangkal sebuah pernyataan atau menandai bahwa pernyataan tersebut tidak berlaku.</p>
      <p class="mus-glossary__example">
        <span class="mus-glossary__label">Contoh</span>
        <code>¬Q</code>
      </p>
    </div>
  </section>

  <section class="mus-glossary__item">
    <div class="mus-glossary__head">
      <div class="mus-glossary__symbol">
        <span class="mus-glossary__label">Simbol</span>
        <code>¬¬</code>
      </div>
      <p class="mus-glossary__read">Dibaca sebagai: tidak tidak</p>
    </div>
    <div class="mus-glossary__body">
      <p class="mus-glossary__meaning">Negasi ganda. Di dalam game, bentuk ini bisa dibuka kembali menjadi pernyataan asal.</p>
      <p class="mus-glossary__example">
        <span class="mus-glossary__label">Contoh</span>
        <code>¬¬P</code> menjadi <code>P</code>
      </p>
    </div>
  </section>

  <section class="mus-glossary__item">
    <div class="mus-glossary__head">
      <div class="mus-glossary__symbol">
        <span class="mus-glossary__label">Simbol</span>
        <code>∧</code>
      </div>
      <p class="mus-glossary__read">Dibaca sebagai: dan</p>
    </div>
    <div class="mus-glossary__body">
      <p class="mus-glossary__meaning">Konjungsi. Dua pernyataan digabung menjadi satu blok.</p>
      <p class="mus-glossary__example">
        <span class="mus-glossary__label">Contoh</span>
        <code>P ∧ Q</code>
      </p>
    </div>
  </section>

  <section class="mus-glossary__item">
    <div class="mus-glossary__head">
      <div class="mus-glossary__symbol">
        <span class="mus-glossary__label">Simbol</span>
        <code>∨</code>
      </div>
      <p class="mus-glossary__read">Dibaca sebagai: atau</p>
    </div>
    <div class="mus-glossary__body">
      <p class="mus-glossary__meaning">Disjungsi. Minimal satu cabang tersedia. Jika satu cabang disangkal, cabang lain dapat tersisa.</p>
      <p class="mus-glossary__example">
        <span class="mus-glossary__label">Contoh</span>
        <code>P ∨ Q</code>
      </p>
    </div>
  </section>

  <section class="mus-glossary__item">
    <div class="mus-glossary__head">
      <div class="mus-glossary__symbol">
        <span class="mus-glossary__label">Simbol</span>
        <code>⊢</code>
      </div>
      <p class="mus-glossary__read">Dibaca sebagai: maka terbukti / menghasilkan</p>
    </div>
    <div class="mus-glossary__body">
      <p class="mus-glossary__meaning">Blok yang dipilih menghasilkan inferensi yang valid.</p>
      <p class="mus-glossary__example">
        <span class="mus-glossary__label">Contoh</span>
        <code>P, P → Q ⊢ Q</code>
      </p>
    </div>
  </section>

  <section class="mus-glossary__item">
    <div class="mus-glossary__head">
      <div class="mus-glossary__symbol">
        <span class="mus-glossary__label">Simbol</span>
        <code>⊬</code>
      </div>
      <p class="mus-glossary__read">Dibaca sebagai: tidak menghasilkan</p>
    </div>
    <div class="mus-glossary__body">
      <p class="mus-glossary__meaning">Blok yang dipilih tidak menghasilkan inferensi valid pada level tersebut.</p>
      <p class="mus-glossary__example">
        <span class="mus-glossary__label">Contoh</span>
        <code>P → Q, Q ⊬ P</code>
      </p>
    </div>
  </section>

  <section class="mus-glossary__item">
    <div class="mus-glossary__head">
      <div class="mus-glossary__symbol">
        <span class="mus-glossary__label">Simbol</span>
        <code>■ Q.E.D.</code>
      </div>
      <p class="mus-glossary__read">Dibaca sebagai: bukti selesai</p>
    </div>
    <div class="mus-glossary__body">
      <p class="mus-glossary__meaning">Target telah dicapai. Ruangan menerima pembuktiannya.</p>
      <p class="mus-glossary__example">
        <span class="mus-glossary__label">Contoh</span>
        <code>■ Q.E.D.</code>
      </p>
    </div>
  </section>
</div>
{{< /rawhtml >}}

{{< mus-divider >}}

## Aturan yang digunakan di dua belas level pertama

{{< rawhtml >}}
<div class="mus-glossary">
  <section class="mus-glossary__item">
    <div class="mus-glossary__head">
      <div class="mus-glossary__symbol">
        <span class="mus-glossary__label">Aturan</span>
        <code>Modus Ponens</code>
      </div>
      <p class="mus-glossary__read">Muncul di: Level 1, 4, 6, 8, 9, 10, 11, 12</p>
    </div>
    <div class="mus-glossary__body">
      <p class="mus-glossary__meaning">Jika P mengarah ke Q, dan P tersedia, maka Q mengikuti.</p>
      <p class="mus-glossary__example">
        <span class="mus-glossary__label">Pola</span>
        <code>P → Q</code>, <code>P</code> ⟶ <code>Q</code>
      </p>
    </div>
  </section>

  <section class="mus-glossary__item">
    <div class="mus-glossary__head">
      <div class="mus-glossary__symbol">
        <span class="mus-glossary__label">Aturan</span>
        <code>Modus Tollens</code>
      </div>
      <p class="mus-glossary__read">Muncul di: Level 2, 4</p>
    </div>
    <div class="mus-glossary__body">
      <p class="mus-glossary__meaning">Jika P seharusnya mengarah ke Q, tetapi Q tidak berlaku, maka P tidak dapat diterima.</p>
      <p class="mus-glossary__example">
        <span class="mus-glossary__label">Pola</span>
        <code>P → Q</code>, <code>¬Q</code> ⟶ <code>¬P</code>
      </p>
    </div>
  </section>

  <section class="mus-glossary__item">
    <div class="mus-glossary__head">
      <div class="mus-glossary__symbol">
        <span class="mus-glossary__label">Aturan</span>
        <code>Silogisme Hipotetis</code>
      </div>
      <p class="mus-glossary__read">Muncul di: Level 3</p>
    </div>
    <div class="mus-glossary__body">
      <p class="mus-glossary__meaning">Dua implikasi dapat disambungkan menjadi rantai yang lebih panjang.</p>
      <p class="mus-glossary__example">
        <span class="mus-glossary__label">Pola</span>
        <code>P → Q</code>, <code>Q → R</code> ⟶ <code>P → R</code>
      </p>
    </div>
  </section>

  <section class="mus-glossary__item">
    <div class="mus-glossary__head">
      <div class="mus-glossary__symbol">
        <span class="mus-glossary__label">Aturan</span>
        <code>Introduksi Konjungsi</code>
      </div>
      <p class="mus-glossary__read">Muncul di: Level 5</p>
    </div>
    <div class="mus-glossary__body">
      <p class="mus-glossary__meaning">Jika dua pernyataan sama-sama tersedia, keduanya dapat digabung.</p>
      <p class="mus-glossary__example">
        <span class="mus-glossary__label">Pola</span>
        <code>P</code>, <code>Q</code> ⟶ <code>P ∧ Q</code>
      </p>
    </div>
  </section>

  <section class="mus-glossary__item">
    <div class="mus-glossary__head">
      <div class="mus-glossary__symbol">
        <span class="mus-glossary__label">Aturan</span>
        <code>Simplifikasi</code>
      </div>
      <p class="mus-glossary__read">Muncul di: Level 6</p>
    </div>
    <div class="mus-glossary__body">
      <p class="mus-glossary__meaning">Sebuah konjungsi dapat melepaskan salah satu bagiannya.</p>
      <p class="mus-glossary__example">
        <span class="mus-glossary__label">Pola</span>
        <code>P ∧ Q</code> ⟶ <code>P</code>
      </p>
    </div>
  </section>

  <section class="mus-glossary__item">
    <div class="mus-glossary__head">
      <div class="mus-glossary__symbol">
        <span class="mus-glossary__label">Aturan</span>
        <code>Silogisme Disjungtif</code>
      </div>
      <p class="mus-glossary__read">Muncul di: Level 7</p>
    </div>
    <div class="mus-glossary__body">
      <p class="mus-glossary__meaning">Jika salah satu cabang dari pernyataan atau disangkal, cabang lainnya tersisa.</p>
      <p class="mus-glossary__example">
        <span class="mus-glossary__label">Pola</span>
        <code>P ∨ Q</code>, <code>¬P</code> ⟶ <code>Q</code>
      </p>
    </div>
  </section>

  <section class="mus-glossary__item">
    <div class="mus-glossary__head">
      <div class="mus-glossary__symbol">
        <span class="mus-glossary__label">Aturan</span>
        <code>Negasi Ganda</code>
      </div>
      <p class="mus-glossary__read">Muncul di: Level 8</p>
    </div>
    <div class="mus-glossary__body">
      <p class="mus-glossary__meaning">Pernyataan yang disangkal dua kali kembali menjadi pernyataan asal.</p>
      <p class="mus-glossary__example">
        <span class="mus-glossary__label">Pola</span>
        <code>¬¬P</code> ⟶ <code>P</code>
      </p>
    </div>
  </section>

  <section class="mus-glossary__item">
    <div class="mus-glossary__head">
      <div class="mus-glossary__symbol">
        <span class="mus-glossary__label">Aturan</span>
        <code>Kontraposisi</code>
      </div>
      <p class="mus-glossary__read">Muncul di: Level 9</p>
    </div>
    <div class="mus-glossary__body">
      <p class="mus-glossary__meaning">Implikasi dapat ditulis ulang dengan membalik urutan dan menegasikan kedua sisinya.</p>
      <p class="mus-glossary__example">
        <span class="mus-glossary__label">Pola</span>
        <code>P → Q</code> ⟶ <code>¬Q → ¬P</code>
      </p>
    </div>
  </section>
</div>
{{< /rawhtml >}}

{{< mus-divider >}}

## Cara membaca blok pembuktian

Pembuktian di Axiom Room dibangun dengan memilih blok-blok simbolik yang cocok. Jika pilihan valid, game menghasilkan blok baru. Jika blok baru itu mencapai target, level selesai.

Contohnya:

{{< rawhtml >}}
<div class="mus-glossary">
  <section class="mus-glossary__item">
    <div class="mus-glossary__head">
      <div class="mus-glossary__symbol">
        <span class="mus-glossary__label">Diberikan</span>
        <code>P → Q</code>
        <code>P</code>
      </div>
      <p class="mus-glossary__read">Aturan: Modus Ponens</p>
    </div>
    <div class="mus-glossary__body">
      <p class="mus-glossary__meaning">Dari implikasi yang tersedia dan pernyataan asalnya, game menghasilkan konsekuensi yang sah.</p>
      <p class="mus-glossary__example">
        <span class="mus-glossary__label">Hasil</span>
        <code>Q</code>
      </p>
    </div>
  </section>

  <section class="mus-glossary__item">
    <div class="mus-glossary__head">
      <div class="mus-glossary__symbol">
        <span class="mus-glossary__label">Diberikan</span>
        <code>P → Q</code>
        <code>¬Q</code>
      </div>
      <p class="mus-glossary__read">Aturan: Modus Tollens</p>
    </div>
    <div class="mus-glossary__body">
      <p class="mus-glossary__meaning">Jika konsekuensi ternyata tidak berlaku, maka pernyataan awalnya ikut ditolak.</p>
      <p class="mus-glossary__example">
        <span class="mus-glossary__label">Hasil</span>
        <code>¬P</code>
      </p>
    </div>
  </section>

  <section class="mus-glossary__item">
    <div class="mus-glossary__head">
      <div class="mus-glossary__symbol">
        <span class="mus-glossary__label">Diberikan</span>
        <code>P ∧ Q</code>
      </div>
      <p class="mus-glossary__read">Aturan: Simplifikasi</p>
    </div>
    <div class="mus-glossary__body">
      <p class="mus-glossary__meaning">Sebuah konjungsi bisa dibuka untuk mengambil bagian yang dibutuhkan dalam pembuktian.</p>
      <p class="mus-glossary__example">
        <span class="mus-glossary__label">Hasil</span>
        <code>P</code>
      </p>
    </div>
  </section>
</div>
{{< /rawhtml >}}

> Di Axiom Room, langkah yang valid belum tentu menjadi langkah kemenangan. Beberapa level memiliki jalur samping, pengecoh, atau pernyataan yang benar tetapi menjauh dari target.

{{< mus-divider >}}

## Catatan kecil

Dua belas level pertama sengaja dibuat sempit. Fokusnya hanya pada beberapa gerakan dasar dalam logika proposisional: mengikuti implikasi, menyangkal konsekuensi, menggabungkan pernyataan, memecah konjungsi, mengeliminasi cabang, dan mengenali status pembuktian.

Tujuannya bukan menghafal simbol seperti membaca label museum. Tujuannya adalah merasakan bagaimana sebuah pembuktian bergerak.
