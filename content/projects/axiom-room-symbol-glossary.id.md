---
title: "Glosarium Simbol Logika di Axiom Room"
date: 2026-06-25T10:00:00+07:00
draft: false
math: false
type: "garden-note"
summary: "Glosarium ringkas untuk membaca simbol, aturan inferensi, dan istilah dasar di Axiom Room."
categories: ["Logic"]
tags: ["axiom room", "logic", "symbol glossary"]
---

Glosarium untuk membaca simbol, aturan inferensi, dan istilah dasar yang muncul di Axiom Room.

## Simbol Logika Dasar

{{< rawhtml >}}

<div class="mus-glossary">

  <section class="mus-glossary__item">
    <div class="mus-glossary__head">
      <div class="mus-glossary__symbol mus-glossary__symbol--cluster">
        <span class="mus-glossary__label">Simbol</span>
        <code>P</code>
        <code>Q</code>
        <code>R</code>
        <code>...</code>
      </div>
      <p class="mus-glossary__read">pernyataan</p>
    </div>
    <div class="mus-glossary__body">
      <p class="mus-glossary__meaning">Huruf kapital dipakai sebagai simbol pernyataan. Maknanya tidak tetap. Dalam satu level, <code>P</code> bisa menjadi titik awal, sementara simbol lain menjadi hasil yang perlu diturunkan.</p>
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
        <code>→</code>
      </div>
      <p class="mus-glossary__read">dibaca sebagai: jika... maka...</p>
    </div>
    <div class="mus-glossary__body">
      <p class="mus-glossary__meaning">Menunjukkan implikasi. Jika pernyataan di kiri tersedia, pernyataan di kanan dapat diturunkan.</p>
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
      <p class="mus-glossary__read">dibaca sebagai: tidak</p>
    </div>
    <div class="mus-glossary__body">
      <p class="mus-glossary__meaning">Menandai negasi dari sebuah pernyataan. <code>¬P</code> berarti <code>P</code> tidak berlaku.</p>
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
      <p class="mus-glossary__read">dibaca sebagai: tidak tidak</p>
    </div>
    <div class="mus-glossary__body">
      <p class="mus-glossary__meaning">Negasi ganda mengembalikan pernyataan ke bentuk positifnya.</p>
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
      <p class="mus-glossary__read">dibaca sebagai: dan</p>
    </div>
    <div class="mus-glossary__body">
      <p class="mus-glossary__meaning">Menunjukkan konjungsi, yaitu gabungan dua pernyataan.</p>
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
      <p class="mus-glossary__read">dibaca sebagai: atau</p>
    </div>
    <div class="mus-glossary__body">
      <p class="mus-glossary__meaning">Menunjukkan disjungsi. Jika satu cabang dieliminasi, cabang lain dapat dipertahankan.</p>
      <p class="mus-glossary__example">
        <span class="mus-glossary__label">Contoh</span>
        <code>P ∨ Q</code>
      </p>
    </div>
  </section>

</div>
{{< /rawhtml >}}

## Aturan Inferensi

{{< rawhtml >}}

<div class="mus-glossary">

  <section class="mus-glossary__item">
    <div class="mus-glossary__head">
      <div class="mus-glossary__symbol">
        <span class="mus-glossary__label">Aturan</span>
        <code>Modus Ponens</code>
      </div>
      <p class="mus-glossary__read">pola: dari syarat ke hasil</p>
    </div>
    <div class="mus-glossary__body">
      <p class="mus-glossary__meaning">Jika implikasi tersedia dan syarat kirinya juga tersedia, hasil di kanan dapat diturunkan.</p>
      <p class="mus-glossary__example">
        <span class="mus-glossary__label">Contoh</span>
        <code>P → Q</code> dan <code>P</code> menghasilkan <code>Q</code>
      </p>
    </div>
  </section>

  <section class="mus-glossary__item">
    <div class="mus-glossary__head">
      <div class="mus-glossary__symbol">
        <span class="mus-glossary__label">Aturan</span>
        <code>Modus Tollens</code>
      </div>
      <p class="mus-glossary__read">pola: dari hasil yang ditolak ke syarat yang ditolak</p>
    </div>
    <div class="mus-glossary__body">
      <p class="mus-glossary__meaning">Jika hasil dari sebuah implikasi ditolak, syarat yang mengarah ke hasil itu juga ditolak.</p>
      <p class="mus-glossary__example">
        <span class="mus-glossary__label">Contoh</span>
        <code>P → Q</code> dan <code>¬Q</code> menghasilkan <code>¬P</code>
      </p>
    </div>
  </section>

  <section class="mus-glossary__item">
    <div class="mus-glossary__head">
      <div class="mus-glossary__symbol">
        <span class="mus-glossary__label">Aturan</span>
        <code>Hypothetical Syllogism</code>
      </div>
      <p class="mus-glossary__read">pola: rantai implikasi</p>
    </div>
    <div class="mus-glossary__body">
      <p class="mus-glossary__meaning">Dua implikasi dapat digabung jika bagian tengahnya cocok.</p>
      <p class="mus-glossary__example">
        <span class="mus-glossary__label">Contoh</span>
        <code>P → Q</code> dan <code>Q → R</code> menghasilkan <code>P → R</code>
      </p>
    </div>
  </section>

  <section class="mus-glossary__item">
    <div class="mus-glossary__head">
      <div class="mus-glossary__symbol">
        <span class="mus-glossary__label">Aturan</span>
        <code>Conjunction Introduction</code>
      </div>
      <p class="mus-glossary__read">pola: menggabungkan pernyataan</p>
    </div>
    <div class="mus-glossary__body">
      <p class="mus-glossary__meaning">Dua pernyataan yang tersedia dapat digabung menjadi satu konjungsi.</p>
      <p class="mus-glossary__example">
        <span class="mus-glossary__label">Contoh</span>
        <code>P</code> dan <code>Q</code> menghasilkan <code>P ∧ Q</code>
      </p>
    </div>
  </section>

  <section class="mus-glossary__item">
    <div class="mus-glossary__head">
      <div class="mus-glossary__symbol">
        <span class="mus-glossary__label">Aturan</span>
        <code>Simplification</code>
      </div>
      <p class="mus-glossary__read">pola: mengambil bagian dari konjungsi</p>
    </div>
    <div class="mus-glossary__body">
      <p class="mus-glossary__meaning">Dari satu pernyataan gabungan, salah satu bagiannya dapat diambil.</p>
      <p class="mus-glossary__example">
        <span class="mus-glossary__label">Contoh</span>
        <code>P ∧ Q</code> menghasilkan <code>P</code>
      </p>
    </div>
  </section>

  <section class="mus-glossary__item">
    <div class="mus-glossary__head">
      <div class="mus-glossary__symbol">
        <span class="mus-glossary__label">Aturan</span>
        <code>Disjunctive Syllogism</code>
      </div>
      <p class="mus-glossary__read">pola: menghapus satu cabang</p>
    </div>
    <div class="mus-glossary__body">
      <p class="mus-glossary__meaning">Jika satu cabang dari disjungsi ditolak, cabang lainnya dapat dipertahankan.</p>
      <p class="mus-glossary__example">
        <span class="mus-glossary__label">Contoh</span>
        <code>P ∨ Q</code> dan <code>¬P</code> menghasilkan <code>Q</code>
      </p>
    </div>
  </section>

  <section class="mus-glossary__item">
    <div class="mus-glossary__head">
      <div class="mus-glossary__symbol">
        <span class="mus-glossary__label">Aturan</span>
        <code>Double Negation</code>
      </div>
      <p class="mus-glossary__read">pola: membuka negasi ganda</p>
    </div>
    <div class="mus-glossary__body">
      <p class="mus-glossary__meaning">Pernyataan dengan dua negasi dapat dibaca kembali sebagai pernyataan positif.</p>
      <p class="mus-glossary__example">
        <span class="mus-glossary__label">Contoh</span>
        <code>¬¬P</code> menghasilkan <code>P</code>
      </p>
    </div>
  </section>

  <section class="mus-glossary__item">
    <div class="mus-glossary__head">
      <div class="mus-glossary__symbol">
        <span class="mus-glossary__label">Aturan</span>
        <code>Contraposition</code>
      </div>
      <p class="mus-glossary__read">pola: membalik implikasi dengan negasi</p>
    </div>
    <div class="mus-glossary__body">
      <p class="mus-glossary__meaning">Implikasi dapat ditulis ulang dengan membalik arah hubungan dan memberi negasi pada kedua sisi.</p>
      <p class="mus-glossary__example">
        <span class="mus-glossary__label">Contoh</span>
        <code>P → Q</code> menjadi <code>¬Q → ¬P</code>
      </p>
    </div>
  </section>

</div>
{{< /rawhtml >}}

## Simbol UI dan Notasi

{{< rawhtml >}}

<div class="mus-glossary">

  <section class="mus-glossary__item">
    <div class="mus-glossary__head">
      <div class="mus-glossary__symbol">
        <span class="mus-glossary__label">Simbol UI</span>
        <code>⊢</code>
      </div>
      <p class="mus-glossary__read">dibaca sebagai: menurunkan / dapat dibuktikan</p>
    </div>
    <div class="mus-glossary__body">
      <p class="mus-glossary__meaning">Menandai inferensi yang sah. Di Proof Log, bagian kiri adalah input, dan bagian kanan adalah hasil turunan.</p>
      <p class="mus-glossary__example">
        <span class="mus-glossary__label">Contoh</span>
        <code>P, P → Q ⊢ Q</code>
      </p>
    </div>
  </section>

  <section class="mus-glossary__item">
    <div class="mus-glossary__head">
      <div class="mus-glossary__symbol">
        <span class="mus-glossary__label">Simbol UI</span>
        <code>⊬</code>
      </div>
      <p class="mus-glossary__read">dibaca sebagai: tidak menurunkan</p>
    </div>
    <div class="mus-glossary__body">
      <p class="mus-glossary__meaning">Menandai kombinasi blok yang tidak cocok dengan aturan inferensi pada level tersebut.</p>
      <p class="mus-glossary__example">
        <span class="mus-glossary__label">Contoh</span>
        <code>P → Q</code> dan <code>R</code> tidak otomatis menghasilkan <code>Q</code>
      </p>
    </div>
  </section>

  <section class="mus-glossary__item">
    <div class="mus-glossary__head">
      <div class="mus-glossary__symbol">
        <span class="mus-glossary__label">Simbol UI</span>
        <code>?</code>
      </div>
      <p class="mus-glossary__read">dibaca sebagai: target belum terbuka</p>
    </div>
    <div class="mus-glossary__body">
      <p class="mus-glossary__meaning">Menandai target yang belum berhasil diturunkan.</p>
      <p class="mus-glossary__example">
        <span class="mus-glossary__label">Contoh</span>
        <code>? ⊢ Q</code>
      </p>
    </div>
  </section>

  <section class="mus-glossary__item">
    <div class="mus-glossary__head">
      <div class="mus-glossary__symbol">
        <span class="mus-glossary__label">Simbol UI</span>
        <code>■ Q.E.D.</code>
      </div>
      <p class="mus-glossary__read">dibaca sebagai: terbukti</p>
    </div>
    <div class="mus-glossary__body">
      <p class="mus-glossary__meaning">Penanda akhir pembuktian. Muncul ketika target level sudah berhasil diturunkan.</p>
      <p class="mus-glossary__example">
        <span class="mus-glossary__label">Contoh</span>
        <code>■ Q.E.D.</code>
      </p>
    </div>
  </section>

  <section class="mus-glossary__item">
    <div class="mus-glossary__head">
      <div class="mus-glossary__symbol mus-glossary__symbol--cluster">
        <span class="mus-glossary__label">Notasi kode</span>
        <code>-></code>
        <code>~</code>
        <code>&amp;</code>
        <code>v</code>
      </div>
      <p class="mus-glossary__read">dibaca sebagai: bentuk teks dari simbol logika</p>
    </div>
    <div class="mus-glossary__body">
      <p class="mus-glossary__meaning">Bentuk ASCII untuk simbol logika: <code>-></code> berarti <code>→</code>, <code>~</code> berarti <code>¬</code>, <code>&amp;</code> berarti <code>∧</code>, dan <code>v</code> berarti <code>∨</code>.</p>
      <p class="mus-glossary__example">
        <span class="mus-glossary__label">Contoh</span>
        <code>P -> Q</code> sama dengan <code>P → Q</code>
      </p>
    </div>
  </section>

</div>
{{< /rawhtml >}}

## Istilah Gameplay

{{< rawhtml >}}

<div class="mus-glossary">

  <section class="mus-glossary__item">
    <div class="mus-glossary__head">
      <div class="mus-glossary__symbol">
        <span class="mus-glossary__label">Istilah</span>
        <code>premise</code>
      </div>
      <p class="mus-glossary__read">dibaca sebagai: premis</p>
    </div>
    <div class="mus-glossary__body">
      <p class="mus-glossary__meaning">Blok simbolik yang tersedia sejak level dimulai. Premis menjadi bahan awal untuk menurunkan target.</p>
      <p class="mus-glossary__example">
        <span class="mus-glossary__label">Contoh</span>
        <code>P → Q</code> dan <code>P</code> di Level 1
      </p>
    </div>
  </section>

  <section class="mus-glossary__item">
    <div class="mus-glossary__head">
      <div class="mus-glossary__symbol">
        <span class="mus-glossary__label">Istilah</span>
        <code>target</code>
      </div>
      <p class="mus-glossary__read">dibaca sebagai: kesimpulan yang dicari</p>
    </div>
    <div class="mus-glossary__body">
      <p class="mus-glossary__meaning">Pernyataan yang harus dibuktikan untuk menyelesaikan level.</p>
      <p class="mus-glossary__example">
        <span class="mus-glossary__label">Contoh</span>
        target <code>V</code> di Level 18
      </p>
    </div>
  </section>

  <section class="mus-glossary__item">
    <div class="mus-glossary__head">
      <div class="mus-glossary__symbol">
        <span class="mus-glossary__label">Istilah</span>
        <code>symbolic block</code>
      </div>
      <p class="mus-glossary__read">dibaca sebagai: blok simbolik</p>
    </div>
    <div class="mus-glossary__body">
      <p class="mus-glossary__meaning">Tombol berisi pernyataan logika yang dapat dipilih pemain. Blok dapat berupa premis awal atau hasil turunan.</p>
      <p class="mus-glossary__example">
        <span class="mus-glossary__label">Contoh</span>
        <code>P ∧ Q</code>, <code>Q → R</code>, <code>¬P</code>
      </p>
    </div>
  </section>

  <section class="mus-glossary__item">
    <div class="mus-glossary__head">
      <div class="mus-glossary__symbol">
        <span class="mus-glossary__label">Istilah</span>
        <code>derived statement</code>
      </div>
      <p class="mus-glossary__read">dibaca sebagai: pernyataan turunan</p>
    </div>
    <div class="mus-glossary__body">
      <p class="mus-glossary__meaning">Blok baru yang muncul dari inferensi valid. Blok ini bisa dipakai untuk langkah berikutnya.</p>
      <p class="mus-glossary__example">
        <span class="mus-glossary__label">Contoh</span>
        dari <code>P → Q</code> dan <code>P</code> diturunkan <code>Q</code>
      </p>
    </div>
  </section>

  <section class="mus-glossary__item">
    <div class="mus-glossary__head">
      <div class="mus-glossary__symbol">
        <span class="mus-glossary__label">Istilah</span>
        <code>inference</code>
      </div>
      <p class="mus-glossary__read">dibaca sebagai: inferensi</p>
    </div>
    <div class="mus-glossary__body">
      <p class="mus-glossary__meaning">Satu langkah penarikan kesimpulan dari input menuju output.</p>
      <p class="mus-glossary__example">
        <span class="mus-glossary__label">Contoh</span>
        memilih <code>P → Q</code> dan <code>P</code> untuk menghasilkan <code>Q</code>
      </p>
    </div>
  </section>

  <section class="mus-glossary__item">
    <div class="mus-glossary__head">
      <div class="mus-glossary__symbol">
        <span class="mus-glossary__label">Istilah</span>
        <code>proof chain</code>
      </div>
      <p class="mus-glossary__read">dibaca sebagai: rantai pembuktian</p>
    </div>
    <div class="mus-glossary__body">
      <p class="mus-glossary__meaning">Rangkaian inferensi yang saling menyambung. Hasil dari satu langkah menjadi input untuk langkah berikutnya.</p>
      <p class="mus-glossary__example">
        <span class="mus-glossary__label">Contoh</span>
        <code>P</code> menjadi <code>Q</code>, lalu <code>Q</code> menjadi <code>R</code>
      </p>
    </div>
  </section>

  <section class="mus-glossary__item">
    <div class="mus-glossary__head">
      <div class="mus-glossary__symbol">
        <span class="mus-glossary__label">Istilah</span>
        <code>Proof Log</code>
      </div>
      <p class="mus-glossary__read">dibaca sebagai: catatan pembuktian</p>
    </div>
    <div class="mus-glossary__body">
      <p class="mus-glossary__meaning">Panel yang mencatat turunan baru. Inferensi yang output-nya sudah ada tidak menambah entri baru.</p>
      <p class="mus-glossary__example">
        <span class="mus-glossary__label">Contoh</span>
        <code>P → Q, P ⊢ Q</code>
      </p>
    </div>
  </section>

  <section class="mus-glossary__item">
    <div class="mus-glossary__head">
      <div class="mus-glossary__symbol">
        <span class="mus-glossary__label">Istilah</span>
        <code>Current Run</code>
      </div>
      <p class="mus-glossary__read">dibaca sebagai: percobaan saat ini</p>
    </div>
    <div class="mus-glossary__body">
      <p class="mus-glossary__meaning">Statistik level yang sedang dimainkan, termasuk langkah berhasil, percobaan tidak sah, dan hint yang dipakai.</p>
      <p class="mus-glossary__example">
        <span class="mus-glossary__label">Contoh</span>
        <code>2 successful steps, 0 invalid attempts, 1 hint used</code>
      </p>
    </div>
  </section>

  <section class="mus-glossary__item">
    <div class="mus-glossary__head">
      <div class="mus-glossary__symbol">
        <span class="mus-glossary__label">Istilah</span>
        <code>Best Record</code>
      </div>
      <p class="mus-glossary__read">dibaca sebagai: catatan terbaik</p>
    </div>
    <div class="mus-glossary__body">
      <p class="mus-glossary__meaning">Rekor terbaik level yang disimpan di browser. Nilainya membandingkan hint, invalid attempt, lalu successful step.</p>
      <p class="mus-glossary__example">
        <span class="mus-glossary__label">Contoh</span>
        catatan tanpa hint lebih baik daripada catatan dengan hint
      </p>
    </div>
  </section>

  <section class="mus-glossary__item">
    <div class="mus-glossary__head">
      <div class="mus-glossary__symbol">
        <span class="mus-glossary__label">Istilah</span>
        <code>clean solve</code>
      </div>
      <p class="mus-glossary__read">dibaca sebagai: selesai bersih</p>
    </div>
    <div class="mus-glossary__body">
      <p class="mus-glossary__meaning">Level selesai tanpa invalid attempt dan tanpa hint. Di pemilih level, status ini diberi badge bintang.</p>
      <p class="mus-glossary__example">
        <span class="mus-glossary__label">Contoh</span>
        <code>0 invalid attempts</code> dan <code>0 hints used</code>
      </p>
    </div>
  </section>

  <section class="mus-glossary__item">
    <div class="mus-glossary__head">
      <div class="mus-glossary__symbol">
        <span class="mus-glossary__label">Istilah</span>
        <code>successful step</code>
      </div>
      <p class="mus-glossary__read">dibaca sebagai: langkah berhasil</p>
    </div>
    <div class="mus-glossary__body">
      <p class="mus-glossary__meaning">Inferensi valid yang menghasilkan blok baru. Output yang sudah ada tidak dihitung sebagai successful step baru.</p>
      <p class="mus-glossary__example">
        <span class="mus-glossary__label">Contoh</span>
        <code>P ∧ Q</code> menghasilkan <code>P</code>
      </p>
    </div>
  </section>

  <section class="mus-glossary__item">
    <div class="mus-glossary__head">
      <div class="mus-glossary__symbol">
        <span class="mus-glossary__label">Istilah</span>
        <code>invalid attempt</code>
      </div>
      <p class="mus-glossary__read">dibaca sebagai: percobaan tidak sah</p>
    </div>
    <div class="mus-glossary__body">
      <p class="mus-glossary__meaning">Percobaan memilih blok yang tidak membentuk inferensi valid.</p>
      <p class="mus-glossary__example">
        <span class="mus-glossary__label">Contoh</span>
        memilih dua blok yang tidak cocok dengan aturan level
      </p>
    </div>
  </section>

  <section class="mus-glossary__item">
    <div class="mus-glossary__head">
      <div class="mus-glossary__symbol">
        <span class="mus-glossary__label">Istilah</span>
        <code>decoy path</code>
      </div>
      <p class="mus-glossary__read">dibaca sebagai: jalur pengecoh</p>
    </div>
    <div class="mus-glossary__body">
      <p class="mus-glossary__meaning">Langkah yang valid secara logika, tetapi tidak membantu mencapai target.</p>
      <p class="mus-glossary__example">
        <span class="mus-glossary__label">Contoh</span>
        di Level 10, <code>Q ∧ T</code> menjadi pengecoh untuk target <code>R</code>
      </p>
    </div>
  </section>

  <section class="mus-glossary__item">
    <div class="mus-glossary__head">
      <div class="mus-glossary__symbol">
        <span class="mus-glossary__label">Istilah</span>
        <code>branch</code>
      </div>
      <p class="mus-glossary__read">dibaca sebagai: cabang pembuktian</p>
    </div>
    <div class="mus-glossary__body">
      <p class="mus-glossary__meaning">Arah yang bisa diambil dari satu simbol atau disjungsi. Sebagian cabang menuju target, sebagian hanya menghasilkan side result.</p>
      <p class="mus-glossary__example">
        <span class="mus-glossary__label">Contoh</span>
        dari <code>P</code>, cabang <code>P → Q</code> dan <code>P → R</code> sama-sama valid
      </p>
    </div>
  </section>

  <section class="mus-glossary__item">
    <div class="mus-glossary__head">
      <div class="mus-glossary__symbol">
        <span class="mus-glossary__label">Istilah</span>
        <code>side result</code>
      </div>
      <p class="mus-glossary__read">dibaca sebagai: hasil samping</p>
    </div>
    <div class="mus-glossary__body">
      <p class="mus-glossary__meaning">Kesimpulan yang valid, tetapi bukan target level.</p>
      <p class="mus-glossary__example">
        <span class="mus-glossary__label">Contoh</span>
        <code>U</code> di Level 17 valid, tetapi targetnya <code>V</code>
      </p>
    </div>
  </section>

</div>
{{< /rawhtml >}}

## Nama Level dan Pola Pembuktian

{{< rawhtml >}}

<div class="mus-glossary">

  <section class="mus-glossary__item">
    <div class="mus-glossary__head">
      <div class="mus-glossary__symbol">
        <span class="mus-glossary__label">Istilah</span>
        <code>False Consequence</code>
      </div>
      <p class="mus-glossary__read">dibaca sebagai: konsekuensi benar yang menyesatkan</p>
    </div>
    <div class="mus-glossary__body">
      <p class="mus-glossary__meaning">Nama Level 11. Maksudnya bukan kesimpulan yang salah, tetapi konsekuensi valid yang tidak berguna untuk target.</p>
      <p class="mus-glossary__example">
        <span class="mus-glossary__label">Contoh</span>
        <code>P → Q</code> menghasilkan <code>Q</code>, tetapi target level adalah <code>R</code>
      </p>
    </div>
  </section>

  <section class="mus-glossary__item">
    <div class="mus-glossary__head">
      <div class="mus-glossary__symbol">
        <span class="mus-glossary__label">Istilah</span>
        <code>Necessary Thread</code>
      </div>
      <p class="mus-glossary__read">dibaca sebagai: jalur yang perlu diikuti</p>
    </div>
    <div class="mus-glossary__body">
      <p class="mus-glossary__meaning">Nama Level 12. Dari beberapa langkah valid, hanya satu rangkaian yang benar-benar menuju target.</p>
      <p class="mus-glossary__example">
        <span class="mus-glossary__label">Contoh</span>
        <code>P → Q → T</code> diperlukan, sementara <code>P → R → S</code> hanya detour
      </p>
    </div>
  </section>

  <section class="mus-glossary__item">
    <div class="mus-glossary__head">
      <div class="mus-glossary__symbol">
        <span class="mus-glossary__label">Istilah</span>
        <code>Extended Thread</code>
      </div>
      <p class="mus-glossary__read">dibaca sebagai: jalur pembuktian yang lebih panjang</p>
    </div>
    <div class="mus-glossary__body">
      <p class="mus-glossary__meaning">Nama Level 13. Target berada di ujung rantai yang lebih panjang, meski ada cabang valid yang lebih pendek.</p>
      <p class="mus-glossary__example">
        <span class="mus-glossary__label">Contoh</span>
        <code>P → Q → R → U</code>
      </p>
    </div>
  </section>

  <section class="mus-glossary__item">
    <div class="mus-glossary__head">
      <div class="mus-glossary__symbol">
        <span class="mus-glossary__label">Istilah</span>
        <code>Narrow Passage</code>
      </div>
      <p class="mus-glossary__read">dibaca sebagai: lorong sempit</p>
    </div>
    <div class="mus-glossary__body">
      <p class="mus-glossary__meaning">Nama Level 14. Disjungsi perlu dipersempit dulu sebelum jalur menuju target terbuka.</p>
      <p class="mus-glossary__example">
        <span class="mus-glossary__label">Contoh</span>
        <code>P ∨ Q</code> dan <code>¬P</code> menyisakan <code>Q</code>
      </p>
    </div>
  </section>

  <section class="mus-glossary__item">
    <div class="mus-glossary__head">
      <div class="mus-glossary__symbol">
        <span class="mus-glossary__label">Istilah</span>
        <code>Compressed Route</code>
      </div>
      <p class="mus-glossary__read">dibaca sebagai: rute yang dipadatkan</p>
    </div>
    <div class="mus-glossary__body">
      <p class="mus-glossary__meaning">Nama Level 15. Beberapa implikasi digabung menjadi rute yang lebih pendek sebelum langkah akhir.</p>
      <p class="mus-glossary__example">
        <span class="mus-glossary__label">Contoh</span>
        <code>P → Q</code> dan <code>Q → R</code> menjadi <code>P → R</code>
      </p>
    </div>
  </section>

  <section class="mus-glossary__item">
    <div class="mus-glossary__head">
      <div class="mus-glossary__symbol">
        <span class="mus-glossary__label">Istilah</span>
        <code>Joined Premise</code>
      </div>
      <p class="mus-glossary__read">dibaca sebagai: premis gabungan</p>
    </div>
    <div class="mus-glossary__body">
      <p class="mus-glossary__meaning">Nama Level 16. Dua pernyataan sederhana perlu digabung agar cocok dengan syarat sebuah implikasi.</p>
      <p class="mus-glossary__example">
        <span class="mus-glossary__label">Contoh</span>
        <code>P</code> dan <code>Q</code> menjadi <code>P ∧ Q</code>
      </p>
    </div>
  </section>

  <section class="mus-glossary__item">
    <div class="mus-glossary__head">
      <div class="mus-glossary__symbol">
        <span class="mus-glossary__label">Istilah</span>
        <code>Split Attention</code>
      </div>
      <p class="mus-glossary__read">dibaca sebagai: perhatian yang terpecah</p>
    </div>
    <div class="mus-glossary__body">
      <p class="mus-glossary__meaning">Nama Level 17. Ada lebih dari satu blok yang bisa dibuka, tetapi hanya satu jalur yang menuju target.</p>
      <p class="mus-glossary__example">
        <span class="mus-glossary__label">Contoh</span>
        <code>P ∧ R</code> membantu menuju <code>V</code>, sementara <code>Q ∧ S</code> mengarah ke hasil samping
      </p>
    </div>
  </section>

  <section class="mus-glossary__item">
    <div class="mus-glossary__head">
      <div class="mus-glossary__symbol">
        <span class="mus-glossary__label">Istilah</span>
        <code>Quiet Apex</code>
      </div>
      <p class="mus-glossary__read">dibaca sebagai: puncak yang hening</p>
    </div>
    <div class="mus-glossary__body">
      <p class="mus-glossary__meaning">Nama Level 18. Penutup logic wing dengan negasi ganda, cabang samping, kontraposisi, dan rute yang dipadatkan.</p>
      <p class="mus-glossary__example">
        <span class="mus-glossary__label">Contoh</span>
        <code>Q → R</code> dan <code>R → S</code> dipadatkan sebelum menuju <code>V</code>
      </p>
    </div>
  </section>

  <section class="mus-glossary__item">
    <div class="mus-glossary__head">
      <div class="mus-glossary__symbol">
        <span class="mus-glossary__label">Istilah</span>
        <code>logic wing</code>
      </div>
      <p class="mus-glossary__read">dibaca sebagai: sayap logika</p>
    </div>
    <div class="mus-glossary__body">
      <p class="mus-glossary__meaning">Bagian Axiom Room yang berisi level-level inferensi simbolik. Pemain menyusun langkah dari premis menuju target memakai aturan logika yang tersedia.</p>
      <p class="mus-glossary__example">
        <span class="mus-glossary__label">Contoh</span>
        <code>The logic wing closes with a longer proof.</code>
      </p>
    </div>
  </section>

</div>
{{< /rawhtml >}}