---
title: "Apa Arti 4B, 8B, dan 70B pada Model AI?"
date: 2026-06-09T19:20:00+07:00
draft: false
math: false
type: "garden-note"
summary: "Catatan singkat tentang arti angka 4B, 8B, dan 70B pada model LLM, serta hubungannya dengan parameter, kebutuhan hardware, dan quantization."
categories: ["Artificial Intelligence"]
tags: ["ai", "llm", "local llm"]
---

Angka seperti **4B**, **8B**, atau **70B** pada LLM menunjukkan jumlah **parameter**. 

Huruf **B** berarti **billion**, atau **miliar**.

Angka-angka ini memberikan gambaran kasar tentang kapasitas model. Semakin besar ukuran model, biasanya semakin luas kemampuannya, tetapi juga semakin berat kebutuhan *hardware*-nya.

* **4B** berarti sekitar **4 miliar parameter**
* **8B** berarti sekitar **8 miliar parameter**
* **70B** berarti sekitar **70 miliar parameter**

Angka ini sering muncul langsung setelah nama model. Misalnya, **Qwen3 8B** berarti varian Qwen3 dengan sekitar 8 miliar parameter. **Llama 3.1 70B** berarti varian Llama 3.1 dengan sekitar 70 miliar parameter. Sementara **Qwen2-72B** berarti varian Qwen2 dengan sekitar 72 miliar parameter.

> Tanda hubung seperti pada `Qwen2-72B` atau `Llama-70B` bukan tanda negatif. Itu hanya pemisah antara nama model dan ukuran dimensinya.

{{< mus-divider >}}

## Apa Itu Parameter?

Dalam LLM, **parameter** adalah nilai numerik yang dipelajari oleh model selama proses *training*.

Parameter bukan “fakta” yang disimpan satu per satu seperti isi kamus. Ia lebih mirip jaringan bobot matematis yang membantu model memperkirakan token berikutnya berdasarkan pola yang sudah dipelajari.

Secara umum, semakin banyak jumlah parameter, semakin besar kapasitas model untuk menangkap pola bahasa, instruksi, pengetahuan, dan hubungan antar-konsep.

Namun, ukuran model bukan satu-satunya penentu kualitas. Data *training*, arsitektur, proses *fine-tuning*, *alignment*, *context length*, dan cara model dijalankan juga sangat berpengaruh.

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
        <td>Sering menjadi titik seimbang (*sweet spot*) untuk pengguna lokal.</td>
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
        <td>Kapasitas tinggi, terbaik untuk tugas kompleks, tetapi sangat rakus sumber daya.</td>
        <td>Biasanya membutuhkan GPU besar, banyak RAM/VRAM, atau teknik optimasi seperti quantization dan offloading.</td>
        <td>Llama 3.1 70B, Qwen2-72B</td>
      </tr>
    </tbody>
  </table>
</div>

Tabel ini hanya gambaran praktis. Dua model dengan jumlah parameter yang sama belum tentu memiliki kualitas yang identik.

Model 8B yang dilatih dengan data berkualitas tinggi bisa terasa lebih berguna daripada model yang lebih besar namun proses *training* atau *tuning*-nya kurang optimal untuk tugas tertentu.

{{< mus-divider >}}

## Mengapa Ukuran Model Penting untuk Local LLM?

Ukuran model penting karena berpengaruh langsung pada kebutuhan *hardware*.

Model kecil seperti 4B atau 8B biasanya lebih ramah untuk dijalankan secara lokal. Karakteristiknya lebih cepat, hemat memori, dan cocok untuk laptop atau PC standar.

Model besar seperti 70B memiliki kemampuan reasoning yang jauh lebih kuat untuk instruksi kompleks dan tulisan panjang. Namun, konsekuensinya jelas: model menjadi lebih lambat dan membutuhkan memori yang masif.

Dengan kata lain, pengguna *local* LLM selalu berhadapan dengan *trade-off* antara:

* Kualitas output
* Kecepatan respons (tokens per second)
* Kebutuhan RAM atau VRAM
* Ukuran file model
* Suhu laptop yang mulai terdengar seperti mesin espresso kecil

{{< mus-divider >}}

## Apa Itu Quantization?

**Quantization** adalah teknik untuk mengurangi presisi angka dalam parameter model.

Model asli sering kali disimpan dalam presisi tinggi, misalnya FP16 (16-bit). Pada model besar, hal ini membuat ukuran file dan kebutuhan memori menjadi raksasa.

Melalui *quantization*, angka-angka tersebut dikompresi ke presisi yang lebih rendah, seperti 8-bit, 5-bit, atau 4-bit. Hasilnya, model menjadi jauh lebih ringan dan bisa masuk ke perangkat lokal.

Contohnya, model 70B dalam format FP16 membutuhkan memori sekitar 140 GB. Setelah di-quantize ke format 4-bit (Q4), kebutuhan memorinya turun drastis ke kisaran 40–45 GB saja.

> Catatan: Estimasi kebutuhan memori model lokal dapat berubah tergantung format quantization, context length, backend, dan konfigurasi offload CPU/GPU. Angka di atas sebaiknya dibaca sebagai perkiraan praktis, bukan aturan absolut.

Tetapi *quantization* bukan sihir gratis. Semakin agresif kompresinya, semakin besar kemungkinan terjadi penurunan kualitas (*perplexity*) pada output model.

{{< mus-divider >}}

## Kesimpulan

Angka seperti **4B**, **8B**, dan **70B** menunjukkan jumlah parameter yang menjadi tolok ukur kapasitas sebuah model LLM. Semakin besar angkanya, semakin pintar modelnya, tetapi semakin tinggi pula spesifikasi komputer yang diminta. 

Sementara itu, **quantization** adalah solusi cerdas untuk memangkas ukuran model tersebut agar lebih bersahabat dengan perangkat harian kita.

Singkatnya:

> Jumlah parameter menentukan seberapa besar kapasitas otak modelnya, sedangkan quantization menentukan seberapa ringan model itu saat dijalankan.

Untuk kebanyakan pengguna lokal, model **7B–8B** adalah titik tengah yang paling ideal. Sudah cukup cerdas untuk menemani *chat*, belajar, *coding* ringan, hingga eksplorasi harian tanpa harus memaksa kamu membeli *hardware* kelas naga server.

{{< mus-divider >}}

## Referensi

* Local AI Zone. (2025). *LLM Model Parameters 2025: Master 7B, 13B, 70B Parameter Selection & Performance Optimization*. [Local AI Zone](https://local-ai-zone.github.io/guides/what-is-ai-model-3b-7b-30b-parameters-guide-2025.html)

* Meta. (2024). *Llama 3.1 Model Card*. [Meta Llama](https://www.llama.com/docs/model-cards-and-prompt-formats/llama3_1/)

* Meta Llama. (2024). *Llama 3.1 70B Model Card on Hugging Face*. [Hugging Face](https://huggingface.co/meta-llama/Llama-3.1-70B)

* Qwen. (2024). *Qwen2-72B Model Card on Hugging Face*. [Hugging Face](https://huggingface.co/Qwen/Qwen2-72B)

* Dettmers, T., & Zettlemoyer, L. (2022). *The case for 4-bit precision: k-bit Inference Scaling Laws*. [arXiv](https://arxiv.org/abs/2212.09720)