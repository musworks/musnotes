---
title: "Apa Arti 4B, 8B, dan 70B pada Model AI?"
date: 2026-06-09T19:20:00+07:00
draft: false
math: false
type: "garden-note"
summary: "Catatan singkat tentang arti angka 4B, 8B, dan 70B pada model LLM, serta hubungannya dengan parameter, kebutuhan hardware, dan quantization."
categories: ["Artificial Intelligence"]
tags: ["ai", "llm", "local llm", "parameter", "quantization"]
---

Angka seperti **4B**, **8B**, atau **70B** pada model bahasa besar biasanya menunjukkan jumlah **parameter** dalam model LLM.

Huruf **B** berarti **billion**, atau **miliar**.

Jadi:

* **4B** berarti sekitar **4 miliar parameter**
* **8B** berarti sekitar **8 miliar parameter**
* **70B** berarti sekitar **70 miliar parameter**

Angka ini sering muncul setelah nama model. Misalnya, **Qwen3 8B** berarti varian Qwen3 dengan sekitar 8 miliar parameter. **Llama 3.1 70B** berarti varian Llama 3.1 dengan sekitar 70 miliar parameter. Sementara **Qwen2-72B** berarti varian Qwen2 dengan sekitar 72 miliar parameter.

> Tanda hubung seperti pada `Qwen2-72B` atau `Llama-70B` bukan tanda negatif. Itu hanya pemisah antara nama model dan ukuran model.

{{< mus-divider >}}

## Apa Itu Parameter?

Dalam LLM, **parameter** adalah nilai numerik yang dipelajari model selama proses training.

Parameter bukan “fakta” yang disimpan satu per satu seperti isi kamus. Ia lebih mirip jaringan bobot matematis yang membantu model memperkirakan token berikutnya berdasarkan pola yang sudah dipelajari.

Secara umum, semakin banyak parameter, semakin besar kapasitas model untuk menangkap pola bahasa, instruksi, pengetahuan, dan hubungan antar-konsep.

Namun, ukuran model bukan satu-satunya penentu kualitas. Data training, arsitektur, proses fine-tuning, alignment, context length, dan cara model dijalankan juga sangat berpengaruh.

{{< mus-divider >}}

## Perbandingan Ukuran Model

<div class="table-wrapper">
  <table>
    <thead>
      <tr>
        <th>Ukuran</th>
        <th>Karakter Umum</th>
        <th>Kebutuhan Lokal</th>
        <th>Contoh Model</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>1B-4B</code></td>
        <td>Ringan, cepat, cocok untuk tugas sederhana.</td>
        <td>Bisa berjalan di laptop biasa, terutama jika sudah di-quantize.</td>
        <td>Gemma 2B, Qwen 4B</td>
      </tr>
      <tr>
        <td><code>7B-8B</code></td>
        <td>Sering menjadi titik seimbang untuk pengguna lokal.</td>
        <td>Masih realistis untuk PC atau laptop yang cukup kuat, terutama dalam format Q4 atau Q5.</td>
        <td>Llama 3 8B, Qwen3 8B, Mistral 7B</td>
      </tr>
      <tr>
        <td><code>13B-34B</code></td>
        <td>Lebih kuat untuk instruksi dan reasoning, tetapi mulai terasa berat.</td>
        <td>Membutuhkan RAM/VRAM lebih besar dan biasanya lebih lambat di perangkat biasa.</td>
        <td>Qwen 32B, Yi 34B</td>
      </tr>
      <tr>
        <td><code>70B+</code></td>
        <td>Kapasitas tinggi, lebih baik untuk tugas kompleks, tetapi sangat rakus sumber daya.</td>
        <td>Biasanya membutuhkan GPU besar, banyak RAM/VRAM, atau teknik optimasi seperti quantization dan offloading.</td>
        <td>Llama 3.1 70B, Qwen2-72B</td>
      </tr>
    </tbody>
  </table>
</div>

Tabel ini hanya gambaran praktis. Dua model dengan jumlah parameter yang sama belum tentu punya kualitas yang sama.

Model 8B yang dilatih dengan data bagus bisa terasa lebih berguna daripada model lebih besar yang training atau tuning-nya kurang cocok untuk tugas tertentu.

{{< mus-divider >}}

## Mengapa Ukuran Model Penting untuk Local LLM?

Ukuran model penting karena berpengaruh langsung pada kebutuhan hardware.

Model kecil seperti 4B atau 8B biasanya lebih mudah dijalankan secara lokal. Ia lebih cepat, lebih hemat memori, dan lebih cocok untuk laptop atau PC biasa.

Model besar seperti 70B biasanya punya kemampuan lebih kuat, terutama untuk instruksi kompleks, reasoning, dan tulisan panjang. Tetapi konsekuensinya jelas: model menjadi lebih lambat dan membutuhkan memori jauh lebih besar.

Dengan kata lain, local LLM selalu berhadapan dengan pertukaran antara:

* kualitas output
* kecepatan respons
* kebutuhan RAM atau VRAM
* ukuran file model
* suhu laptop yang mulai terdengar seperti mesin espresso kecil

{{< mus-divider >}}

## Apa Itu Quantization?

**Quantization** adalah teknik untuk mengurangi presisi angka dalam parameter model.

Model asli sering disimpan dalam presisi tinggi, misalnya FP16. Pada model besar, ini membuat ukuran file dan kebutuhan memori menjadi sangat besar.

Dengan quantization, angka-angka itu disimpan dalam presisi yang lebih rendah, misalnya 8-bit, 5-bit, atau 4-bit. Hasilnya, model menjadi lebih kecil dan lebih mudah dijalankan di perangkat lokal.

Contohnya, model 70B dalam FP16 bisa membutuhkan memori sekitar 140 GB. Setelah diubah ke format 4-bit, kebutuhan memorinya bisa turun ke kisaran sekitar 40-45 GB, tergantung format quantization, backend, context length, dan cara model dijalankan.

> Catatan: estimasi memori model lokal dapat berubah tergantung format quantization, context length, backend, dan konfigurasi offload CPU/GPU. Angka seperti 140 GB untuk FP16 dan sekitar 40-45 GB untuk Q4 sebaiknya dibaca sebagai perkiraan praktis, bukan aturan absolut.

Tetapi quantization bukan sihir gratis. Semakin agresif kompresinya, semakin besar kemungkinan kualitas output menurun.

{{< mus-divider >}}

## Kesimpulan

Angka seperti **4B**, **8B**, dan **70B** menunjukkan jumlah parameter dalam model LLM.

Jumlah parameter memberi gambaran kasar tentang kapasitas model. Semakin besar model, biasanya semakin besar pula kemampuannya, tetapi juga semakin berat kebutuhan hardware-nya.

Sementara itu, **quantization** menjelaskan cara membuat model lebih ringan dengan mengurangi presisi angka dalam parameter.

Jadi, dalam local LLM:

> Jumlah parameter menjelaskan seberapa besar modelnya, sedangkan quantization menjelaskan seberapa ringan model itu bisa dijalankan.

Untuk kebanyakan pengguna lokal, model **7B-8B** sering menjadi pilihan seimbang. Ia cukup mampu untuk chat, belajar, coding ringan, dan eksplorasi harian, tanpa langsung menuntut hardware kelas naga server.

{{< mus-divider >}}

## Referensi

* Local AI Zone. (2025). *LLM Model Parameters 2025: Master 7B, 13B, 70B Parameter Selection & Performance Optimization*. [Local AI Zone](https://local-ai-zone.github.io/guides/what-is-ai-model-3b-7b-30b-parameters-guide-2025.html)

* Meta. (2024). *Llama 3.1 Model Card*. [Meta Llama](https://www.llama.com/docs/model-cards-and-prompt-formats/llama3_1/)

* Meta Llama. (2024). *Llama 3.1 70B Model Card on Hugging Face*. [Hugging Face](https://huggingface.co/meta-llama/Llama-3.1-70B)

* Qwen. (2024). *Qwen2-72B Model Card on Hugging Face*. [Hugging Face](https://huggingface.co/Qwen/Qwen2-72B)

* Dettmers, T., & Zettlemoyer, L. (2022). *The case for 4-bit precision: k-bit Inference Scaling Laws*. [arXiv](https://arxiv.org/abs/2212.09720)
