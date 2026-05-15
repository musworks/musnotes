---
title: "Quiet Hours"
date: 2026-05-16T22:00:00+07:00
draft: false
math: false
type: "garden-note"
summary: "Sebuah web app timer fokus yang mengubah sesi belajar menjadi arsip kecil berisi spesies, fakta biologi, dan kutipan reflektif."
categories: ["Projects"]
tags: ["quiet-hours", "focus-timer", "web-app", "biology", "javascript"]
---

Quiet Hours lahir dari ketertarikanku pada aplikasi pomodoro seperti Forest.

Namun, aku tidak ingin membuat timer fokus yang hanya menghitung menit, memberi alarm, lalu selesai. Aku ingin membuat sesuatu yang lebih keren: sebuah ruang kecil tempat waktu yang berhasil dijaga bisa meninggalkan jejak.

Dalam Quiet Hours, pengguna menyelesaikan sesi fokus dalam durasi tertentu. Setelah sesi selesai, mereka mendapatkan sebuah entri arsip: spesies yang terbuka, fakta biologi singkat, dan kutipan reflektif.

Dengan cara itu, fokus tidak hanya diperlakukan sebagai tugas yang harus ditaklukkan. dia berubah menjadi pengalaman kecil yang bisa dikumpulkan, dilihat kembali, dan mungkin diam-diam membuat pengguna merasa bahwa waktunya tidak benar-benar hilang.

{{< mus-divider >}}

## Bentuk Project

Secara teknis, Quiet Hours dibangun sebagai aplikasi statis yang ringan menggunakan HTML, CSS, dan JavaScript murni.

Aku memilih bentuk ini karena ingin project-nya tetap sederhana, cepat dibuka, dan tidak membutuhkan sistem yang terlalu berat. Untuk saat ini, progres sesi disimpan secara lokal di browser, sehingga pengguna tetap bisa melihat jejak fokusnya tanpa harus membuat akun.

Quiet Hours juga mendukung pilihan bahasa Inggris dan Indonesia. Bagiku, ini penting karena suasana sebuah aplikasi tidak hanya dibentuk oleh visual, tapi juga oleh bahasa yang muncul ketika seseorang sedang mencoba bertahan dalam satu sesi fokus.

<div style="text-align: center; margin: 2rem 0;">
  <img src="/images/digital-works/quiet-hours.png" alt="Quiet Hours Interface Preview" style="max-width: 100%; height: auto; border-radius: 8px;">
  <p><em>tampilan utama quiet hours</em></p>
</div>

{{< mus-divider >}}

## Suasana yang Ingin Dibangun

Hal yang paling penting dari Quiet Hours bukan hanya fitur timer-nya, melainkan atmosfernya.

Aku ingin tampilannya terasa seperti jurnal atau arsip. Tidak terlalu ramai, tidak terlalu memerintah, dan tidak membuat produktivitas terasa seperti hukuman kecil dengan UI cantik. Setiap spesies yang terbuka menjadi semacam hadiah kecil. Bukan hadiah yang berisik, tapi tanda bahwa satu sesi telah selesai.

<div style="text-align: center; margin: 2rem 0;">
  <img src="/images/digital-works/quiet-hours-reward.png" alt="Quiet Hours Species Unlocked Reward" style="max-width: 100%; height: auto; border-radius: 8px;">
  <p><em>spesies-unlocked</em></p>
</div>

{{< mus-divider >}}

## Rencana Pengembangan

Quiet Hours masih akan terus dikembangkan. Beberapa fitur yang ingin kutambahkan di masa depan adalah sistem notifikasi dan penyimpanan cloud, agar progres pengguna bisa tersimpan lebih aman dan tidak hanya bergantung pada satu browser.

Namun, untuk membangun itu semua aku masih perlu belajar lebih jauh. Untuk sekarang, Quiet Hours tetap menjadi project kecil yang tumbuh pelan-pelan: sebuah timer, sebuah arsip, dan sebuah cara untuk mengatakan bahwa waktu yang dijaga punya bentuk.

<div class="table-wrapper">
  <table>
    <thead>
      <tr>
        <th>Detail</th>
        <th>Informasi</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Status</strong></td>
        <td>In development</td>
      </tr>
      <tr>
        <td><strong>Platform</strong></td>
        <td>Web App (Static)</td>
      </tr>
      <tr>
        <td><strong>Link</strong></td>
        <td><a href="https://quiet-hours.musnotes.my.id/">Buka Quiet Hours</a></td>
      </tr>
    </tbody>
  </table>
</div>

{{< mus-divider >}}