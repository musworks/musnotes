---
title: "Struktur Logika: Atomik dan Molekuler"
date: 2026-05-16T00:00:00+07:00
draft: false
aliases:
  - /digital-garden/musnotes/struktur-logika/
math: false
type: "garden-note"
summary: "Proposisi memiliki tingkatan struktur: bentuk atomik yang sederhana dan bentuk molekuler yang terbentuk melalui operator logika."
categories: ["Philosophy", "Logic"]
tags: ["proposition", "atomic", "molecular", "logic", "logical-structure"]
---

Dalam logika, proposisi tidak hanya dibedakan berdasarkan maknanya, tetapi juga berdasarkan strukturnya.

Seperti materi di alam semesta dapat dipahami sebagai susunan dari unit-unit dasar, proposisi juga memiliki tingkatan hierarki. Ada proposisi yang berdiri sebagai bentuk paling sederhana, dan ada pula proposisi yang tersusun melalui operasi logis tertentu.

{{< mus-divider >}}

## Diagram Sederhana

{{< rawhtml >}}
<div class="flow-container">
  <div class="flow-wrapper">
    <div class="flow-node node-sage">
      <span class="node-label">Tuan Jawa mencintai Emma</span>
    </div>
    <div class="flow-arrow arrow-sage"></div>
    <div class="flow-node node-orchid">
      <span class="node-label">dan</span>
    </div>
    <div class="flow-arrow arrow-orchid"></div>
    <div class="flow-node node-sage">
      <span class="node-label">Emma mencintai Tuan Jawa</span>
    </div>
  </div>
</div>
{{< /rawhtml >}}

{{< mus-divider >}}

## Proposisi Atomik

Proposisi atomik adalah bentuk proposisi yang paling dasar dan paling sederhana. Ia tidak mengandung operator logika seperti `dan`, `atau`, `tidak`, atau `jika ... maka ...`.

Karena itu, proposisi atomik biasanya menyatakan satu klaim tunggal yang belum dibentuk melalui operasi logis lain.

Contoh:

> "Tuan Jawa mencintai Emma."

Kalimat ini bisa diperlakukan sebagai proposisi atomik karena dia menyatakan satu relasi sederhana tanpa operator logika tambahan.

{{< mus-divider >}}

## Proposisi Molekuler

Proposisi molekuler, atau proposisi majemuk, muncul ketika sebuah proposisi dibentuk dengan bantuan operator logika.

Operator tersebut bisa menggabungkan dua proposisi, seperti pada `dan` dan `atau`, atau mengubah satu proposisi, seperti pada `tidak`.

Contohnya:

> "Tuan Jawa mencintai Emma **dan** Emma mencintai Tuan Jawa."

Kalimat ini bersifat molekuler karena terdiri atas dua proposisi atomik yang digabungkan oleh operator `dan`.

{{< mus-divider >}}

## Negasi sebagai Operator Unik

Negasi memiliki posisi khusus dalam logika formal.

Berbeda dari `dan`, `atau`, dan `jika ... maka ...` yang biasanya bekerja dengan dua proposisi, negasi hanya bekerja pada satu proposisi. Karena itu, negasi disebut operator monadik.

Misalnya, dari proposisi atomik:

> "Tuan Jawa mencintai Emma."

kita bisa membentuk proposisi baru:

> "Tuan Jawa tidak mencintai Emma."

Dalam notasi sederhana, jika proposisi pertama dilambangkan sebagai `P`, maka bentuk negasinya bisa ditulis sebagai `~P`.

Meskipun hanya melibatkan satu proposisi awal, bentuk `~P` tetap termasuk proposisi molekuler karena sudah mengandung operator logika.

{{< mus-divider >}}

## Peran Operator Logika

Yang membedakan proposisi molekuler dari proposisi atomik adalah kehadiran operator logika.

Beberapa operator logika yang umum adalah:

- **tidak** (*negation*) → operator monadik
- **dan** (*conjunction*) → operator diadik
- **atau** (*disjunction*) → operator diadik
- **jika ... maka ...** (*conditional*) → operator diadik

Dengan bantuan operator-operator ini, logika bisa membangun struktur makna yang lebih kompleks dari proposisi yang sederhana.

{{< mus-divider >}}

## Dari Unit Dasar ke Struktur Kompleks

Dengan demikian, proposisi atomik bisa dipahami sebagai unit dasar, sedangkan proposisi molekuler adalah proposisi yang sudah dibentuk melalui operator logika.

Pembedaan ini penting karena banyak analisis logika bergantung pada kemampuan untuk memecah proposisi kompleks menjadi bagian-bagian yang lebih sederhana.

Di titik ini, proposisi mulai terlihat seperti arsitektur kecil: satu klaim bisa berdiri sendiri, tetapi beberapa klaim bisa disusun, dinegasikan, atau dihubungkan hingga membentuk bangunan logis yang lebih rumit.

{{< mus-divider >}}

## 📚 References & Context

* Catatan ini merupakan lanjutan dari pembahasan tentang proposisi dan nilai kebenarannya.
* Fokus utamanya adalah membedakan proposisi atomik dan proposisi molekuler berdasarkan struktur logisnya.
* Istilah "operator logika" digunakan agar mencakup operator diadik seperti `dan` dan `atau`, sekaligus operator monadik seperti `tidak`.
