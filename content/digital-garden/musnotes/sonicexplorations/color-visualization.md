---
title: "Strudel: Visualiasi Warna"
date: 2026-10-31T00:00:00+07:00
type: garden-note
draft: false
categories: ["strudel"]
cover:
  image: "/images/profesor-tua.png"
  hiddenInSingle: true
  hiddenInList: true
---

Eksplorasi fungsi `.color()` pada Strudel untuk memberikan warna berbeda pada setiap event nada dalam visualisasi.

Fungsi `.color()` memungkinkan setiap pola nada memiliki identitas warna tersendiri. Dalam eksperimen ini, sepuluh nama warna dicoba untuk mengamati bagaimana masing-masing warna ditampilkan pada visualisasi.

### Experiment

```javascript
//@title warna example @by mus
cpm(80/4)
const eg = stack(
  note("c4").color("cyan"),
  note("~ e4").color("magenta"),
  note("~ ~ ~ g5").color("coral"),
  note("g4").color("violet"),
  note("~ ~ ~ b4").color("lime"),
  note("~ d5").color("teal"),
  note("c5").color("olive"),
  note("~ ~ ~ ~ ~ f5").color("salmon"),
  note("~ ~ ~ ~ ~ ~ ~ bb5").color("gold"),
  note("~ ~ ~ ~ ~ ~ ~ c4").color("crimson")
)
eg.s("piano").slow(2)
.pitchwheel()
```
#### screen recording
<video controls playsinline preload="metadata" width="100%">
  <source src="/videos/strudel/cvs.mp4"
          type="video/mp4">
</video>

### note

Setiap event nada menampilkan warna sesuai dengan nilai yang diberikan melalui `.color()`.

Eksperimen ini menunjukkan bahwa pewarnaan dapat digunakan sebagai elemen visual untuk membedakan event atau lapisan pola dalam komposisi live coding.

{{< mus-divider >}}

**Status:** Tested · 31 October 2026