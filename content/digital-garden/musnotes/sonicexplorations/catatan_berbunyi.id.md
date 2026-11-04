---
title: "Dari Catatan Berbunyi ke Sistem yang Saling Terhubung"
date: 2026-09-28T22:06:00+07:00
type: garden-note
draft: true
summary: "Catatan proses memahami shared state di Sonic Pi: dari live_loop yang berjalan sendiri-sendiri, ke loop yang saling membaca dan menulis state lewat set dan get."
categories: ["sonic-pi", "logic"]
cover:
  image: "/images/profesor-tua.png"
  hiddenInSingle: true
  hiddenInList: true
---

{{< youtube i3IcCLFihS8>}}

Menghabiskan berjam-jam di depan layar memainkan Sonic Pi itu, di satu sisi seru banget, tapi di sisi lain, sebagai mahasiswa biologi muncul rasa bersalah karena porsi belajarku berkurang drastis dibandingkan waktu yang kuhabiskan untuk bereksperiment suara. Supaya hobi ini tidak berujung pada konsekuensi administratif yang fatal (baca: tidak lulus), aku mencari kompromi.

Idenya sederhana: memanfaatkan Sonic Pi untuk mencatat, me-_recall_, atau memetakan materi biologi melalui kode yang menghasilkan output audio. Targetnya pragmatis: kemampuan _live coding_ bertambah, pemahaman biologi tetap aman.

Eksperimen pertamaku berangkat dari jaringan utama penyusun tumbuhan. Aku memetakan jaringan dasar (_ground tissue_), jaringan vaskular (_vascular tissue_), dan jaringan dermal (_dermal tissue_) ke dalam beberapa `live_loop` yang menghasilkan pola suara berbeda. Pada tahap ini tujuanku mengubah konsep anatomi tumbuhan menjadi representasi musikal yang bisa kuoprek sekaligus menjadi media pengingat materi.

### Dari Catatan Berbunyi ke Shared State

Secara estetika bunyi, eksperimen pertamaku bekerja. Namun, ketika kode tersebut kudiskusikan dengan Claude, arah pembicaraan bergeser. Claude mengkritik cara komponen biologis direpresentasikan sebagai `live_loop` yang relatif terisolasi, terutama ketika aku mulai memperlakukan perilaku stomata sebagai proses acak yang berdiri sendiri.

Kritik tersebut menarik perhatianku pada batas tegas antara dua pendekatan: **merepresentasikan informasi biologis melalui suara** versus **memodelkan interrelasi antarkomponen dalam suatu sistem biologis**. Kode awalku memang murni ditujukan untuk fungsi pertama, bukan untuk mensimulasikan mekanisme fisiologis tumbuhan.

kritik itu memicu pertanyaan baru : _bagaimana jika suatu loop tidak hanya bersuara berdasarkan aturannya sendiri, tapi aktif merespons informasi yang dialirkan oleh loop lain?_

{{< mus-divider >}}

## Eksperimen Dimulai: Memahami Abstraksi Secara Intuitif

Aku tidak mulai mempelajarinya lewat literatur tapi langsung mencoba fungsinya di Sonic Pi untuk menangkap logikanya secara intuitif.

Untuk membedah abstraksinya, aku sengaja menanggalkan dulu term fisiologi. aku mulai dengan sebuah *live loop* yang menghasilkan suara *vinyl hiss*.

```ruby
use_bpm 80

live_loop :hiss do
  meong = rrand(0.4, 0.8)
  set :m, meong
  sample :vinyl_hiss, amp: meong - 0.1
  sleep sample_duration(:vinyl_hiss)
end
```

Setiap kali loop dijalankan, `rrand(0.4, 0.8)` menghasilkan nilai acak antara 0.4 dan 0.8. Nilai itu disimpan ke dalam variabel `meong`, lalu digunakan untuk menentukan amplitudo suara *vinyl hiss*.

Bagian krusial disini, ada di baris:

```ruby
set :m, meong
```

aku membacanya sebagai: _"Simpan nilai dari `meong` ke dalam variabel global bersama bernama `:m`."_ 

aku memahami variabel Ruby biasa (disini `meong`) sebagai tempat menyimpan nilai yang digunakan oleh kode di dalam konteks eksekusinya. Sementara itu, `set` dan `get` menawarkan cara untuk menyimpan serta membaca nilai melalui *Time State* Sonic Pi, sehingga nilai itu bisa diakses oleh beberapa *live loop*.

### Menggunakan Nilai dari Loop Lain

Setelah itu, aku menambahkan dua loop.

```ruby
live_loop :experimental_drum do
  with_fx :lpf, cutoff: 75 do
    db = :drum_bass_soft
    ds = :drum_snare_soft
    sample db, amp: 0.8
    sleep 1
    sample ds, amp: 0.7
    sleep 1
  end
end

live_loop :hithat do
  with_fx :lpf, cutoff: 75 do
    ds = :drum_cymbal_closed
    4.times do
      sample ds, amp: get[:m]
      sleep 0.5
    end
  end
end
```
Loop `:experimental_drum` sengaja tidak menyentuh state sama sekali, ia berfungsi sebagai pembanding: tetap berjalan independen seperti eksperimen pertamaku. Di loop `:hithat`, perhatikan `amp: get[:m]`. Di sinilah **shared state** mulai terjadi. Desis piringan hitam (`:vinyl_hiss`) dan hi-hat (`:hithat`) sekarang sama-sama digerakkan oleh nilai `meong` yang sama, dijembatani oleh pasangan `set` dan `get`.

### Lapisan Lanjutan: Modulasi Nilai dan State Kedua

Aku ingin melihat apakah variabel bersama ini bisa memengaruhi instrumen melodis tanpa membuatnya hilang ditelan suara lain. Untuk itu aku membuat loop `:chord`, yang membaca `:m` untuk volumenya.

```ruby
live_loop :chord do
  progression = [[:c4, :major], [:a3, :minor], [:f3, :major], [:g3, :major]]

  # chord tidak boleh lebih pelan dari 0.5
  m1 = [(get[:m] || 0.5), 0.5].max

  progression.each do |root, type|
    c = chord(root, type)
    set :current_chord, c
    use_synth :sine
    with_fx :lpf, cutoff: 55 do
      play c, release: 1.5, amp: m1
      sleep 2
    end
  end
end
```

Bagian `get[:m] || 0.5` menyediakan nilai cadangan sebesar `0.5` jika belum ada nilai yang tersedia pada `:m`. Selanjutnya, `.max` membandingkan nilai tersebut dengan `0.5` dan mengambil nilai yang lebih besar.

Artinya, `m1` tidak akan lebih kecil daripada `0.5`. Jika nilai `:m` berada di bawah batas itu, amplitudo chord tetap menggunakan `0.5`. Jika nilainya lebih besar, amplitudo mengikuti nilai `:m`.

<div class="table-wrapper">
  <table>
    <thead>
      <tr>
        <th>Nilai `:m`</th>
        <th>Nilai `m1`</th>
        <th>Hasil</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>0.40</code></td>
        <td><code>0.50</code></td>
        <td>Menggunakan batas minimum</td>
      </tr>
      <tr>
        <td><code>0.45</code></td>
        <td><code>0.50</code></td>
        <td>Menggunakan batas minimum</td>
      </tr>
      <tr>
        <td><code>0.51</code></td>
        <td><code>0.51</code></td>
        <td>Mengikuti nilai sumber</td>
      </tr>
      <tr>
        <td><code>0.75</code></td>
        <td><code>0.75</code></td>
        <td>Mengikuti nilai sumber</td>
      </tr>
    </tbody>
  </table>
</div>

>**Catatan koreksi.** Versi pertamaku memakai `if m1 <= 0.5 then m1 + 0.5`. Ketika kutulis ke dalam tabel, hasilnya aneh: 0.40 menjadi 0.90 tetapi 0.75 tetap 0.75, jadi makin pelan `m`, makin keras chord. Itu inversi yang tidak kusengaja. Aku terlalu cepat menulis kodenya, dan baru sadar setelah menuliskan nilainya ke tabel. Versi di atas memakai `max`, jadi hubungannya monoton.

Selain membaca `:m`, loop `:chord` juga menulis state baru lewat `set :current_chord, c`. Chord yang sedang berbunyi jadi tersedia untuk loop lain, dan loop `:melody` memakainya. 

### Menambahkan Melody yang Membaca Chord


```ruby
live_loop :melody do
  active_c = get[:current_chord]
  lead_amp = (get[:m] || 0.5) * 0.8

  if active_c && one_in(3) == false
    use_synth :sine
    with_fx :lpf, cutoff: 60 do
      note = active_c.choose + 12
      play note, amp: lead_amp, attack: 0.1, release: 0.8
    end
  end

  sleep 0.5
end
```

Pada loop ini, `get[:current_chord]` membaca chord terakhir yang tersimpan pada state. `active_c.choose` kemudian memilih salah satu nada dari chord itu, sedangkan `+ 12` menaikkan nada terpilih sebanyak satu oktaf.

Kondisi `active_c && one_in(3) == false` memastikan bahwa melodi hanya dimainkan ketika nilai chord tersedia dan kondisi probabilitas terpenuhi. Karena `one_in(3)` bernilai benar kira-kira satu dari tiga kali, penggunaan `== false` membuat melodi berpeluang dimainkan sekitar dua dari tiga iterasi.

Sementara itu, `lead_amp` mengambil nilai `:m` dengan nilai cadangan `0.5`, kemudian mengalikannya dengan `0.8`. Jadi, amplitudo melodi dipengaruhi langsung oleh nilai yang sama dengan yang digunakan oleh `:chord`, tetapi melalui perhitungan yang berbeda.

{{< mus-divider >}}

### Memetakan Relasi Antar-Loop

<div class="mus-flow-tree">
  <div class="mus-flow-root">
    <div class="mus-flow-node">
      <span class="mus-flow-label"><code>:hiss</code></span>
      <span class="mus-flow-note">Menghasilkan nilai acak dan menyimpannya</span>
    </div>
  </div>
  <div class="mus-flow-branches">
    <div class="mus-flow-branch">
      <div class="mus-flow-node">
        <span class="mus-flow-label"><code>:m</code></span>
        <span class="mus-flow-note">State: nilai bersama</span>
      </div>
      <div class="mus-flow-branches">
        <div class="mus-flow-branch">
          <div class="mus-flow-node">
            <span class="mus-flow-label"><code>:hithat</code></span>
            <span class="mus-flow-note">Membaca nilai untuk amplitudo</span>
          </div>
        </div>
        <div class="mus-flow-branch">
          <div class="mus-flow-node">
            <span class="mus-flow-label"><code>:chord</code></span>
            <span class="mus-flow-note">Membaca nilai untuk amplitudo chord</span>
          </div>
          <div class="mus-flow-branches">
            <div class="mus-flow-branch">
              <div class="mus-flow-node">
                <span class="mus-flow-label"><code>:current_chord</code></span>
                <span class="mus-flow-note">Chord terakhir yang disimpan</span>
              </div>
              <div class="mus-flow-branches">
                <div class="mus-flow-branch">
                  <div class="mus-flow-node">
                    <span class="mus-flow-label"><code>:melody</code></span>
                    <span class="mus-flow-note">Membaca chord dan nilai <code>:m</code></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

### Apa yang Bisa Dipelajari dari Abstraksi Ini?

Di awal, aku bertanya: bagaimana jika suatu komponen tidak hanya bermain dengan aturannya sendiri, tetapi juga merespons informasi yang dihasilkan komponen lain? satu sumber (lingkungan) menulis, semua loop lain hanya membaca. Tidak ada komponen yang memengaruhi komponen lain.

Eksperimen `:m` menambahkan separuh lainnya lewat `:chord`, yang membaca sinyal dari `:hiss` sekaligus menulis sinyal baru untuk `:melody`. Untuk pertama kalinya, ada rantai pengaruh antarkomponen, bukan hanya sumber tunggal ke banyak pembaca.

Kalau dipetakan ke biologi, `:m` paling dekat dengan sinyal yang dihasilkan sistem itu sendiri (semacam hormon) dan bukan faktor lingkungan seperti cahaya, karena diproduksi oleh loop di dalam sistemku. Analoginya longgar, dan ada dua hal yang membuatnya tidak pas:

- Setiap loop mengecek `:m` sesuai jadwalnya sendiri, tidak ada yang "dibangunkan" oleh perubahan. Ini lebih mirip membaca konsentrasi zat daripada kaskade sinyal. Yang lebih mirip pemicu di Sonic Pi adalah `sync`/`cue`, yang belum kupakai.
- Alurku searah, sementara sistem biologis umumnya melingkar: respons organ memengaruhi sekresi sinyal berikutnya.

{{< mus-divider >}}



