---
title: "Little Pattern"
date: 2026-11-07T00:00:00+07:00
type: garden-fragment
draft: false
categories: ["strudel", "live_coding"]
cover:
  image: "/images/draft_cover/001home.png"
  hiddenInSingle: true
  hiddenInList: true
---

....Pokoknya ini bagus.

{{< mus-divider >}}

## Development Log

### v1.0

```javascript
setcpm(120/4)
const a = note(`<[d4 f#4 a4] [g4 [b4 d5]!2]
[f#4 a4 c#5] [e4 [g4 b4]!2]>`)
const b = n("~")
$: arrange(
  [4, a],
  [4, a.jux(rev)],
  [4, a.rev()]
).s("piano").gain(.8)

$: note(`<[a2 <d3 g3 f#3 e3>]>`)
.s("piano").gain(.3)
```

### v1.1

```javascript
setcpm(112/4)
const u = note(`<[d4 f#4 a4] [g4 <[[b4 d5]] [[b4 d5]!2]>]
[f#4 a4 c#5] [e4 [g4 b4]!2]>`)
const M = arrange(
  [8, u],
  [4, u.jux(rev)],
  [4, u.rev()],
).color("<cyan violet salmon gold>")
const ss = note(`<[a2 <d3 g3 f#3 e3>]>`)
const transisi = n("~")

stack (
  arrange(
  [16, M],
  [16, M.transpose(12)],
  [4, transisi],
  [4, u.fast(2).transpose(-12)],
  [4, u.fast(2).transpose(-12).rev()],
).s("piano").gain(.8)._pianoroll({labels: 1}),

arrange(
  [16, ss],
  [16, ss.jux(rev)],
  [12, ss.rev()]
).s("gm_acoustic_bass").gain(.3)._punchcard({labels:1})
  ).room("<0 .2 .4 .6 >").pitchwheel()
```

### v1.2

```javascript
//@by mus
setcpm(112/4)
const u = note(`<[d4 f#4 a4] [g4 <[[b4 d5]] [[b4 d5]!2]>]
[f#4 a4 c#5] [e4 [g4 b4]!2]>`)
const M = arrange(
  [8, u],
  [4, u.jux(rev)],
  [4, u.rev()],
).color("<cyan violet salmon gold>")
const ss = note(`<[a2 <d3 g3 f#3 e3>]>`)

stack (
  arrange(
  [4, M.s("piano")],
  [4, M.s("gm_epiano2")],
  [8, M.s("<piano gm_epiano2>")],
  [16, M.transpose(12).s("piano, gm_epiano2")],
  [4, u.s("piano")],
  [4, u.fast(2).transpose(-12).s("gm_epiano2")],
  [4, u.fast(2).transpose(-12).rev().s("piano")],
).gain(sine.range(0.6, .8))._pianoroll({labels: 1}),

arrange( 
  [16, ss],
  [16, ss.jux(rev)],
  [12, ss.rev()]
).s("triangle gm_acoustic_bass").sometimesBy(.3, x => x.gain(.3))._punchcard({labels:1})
  ).room("<0 .2 .4 .6 >")
  .sz("<0.2 0.4 0.6 .8>")//room size
  .pitchwheel()
  ```

### v1.3

```javascript
setcpm(110/4)
const u = note(`<[d4 f#4 a4] [g4 <[[b4 d5]] [[b4 d5]!2]>]
[f#4 a4 c#5] [e4 <[[g4 b4]!2] [[g4 b4]]>]>`)
const M = arrange(
  [8, u],
  [4, u.jux(rev)],
  [4, u.rev()],
).color("<cyan violet salmon gold>")
const ss = note(`<[a2 <d3 g3 f#3 e3>]>`)

stack (
  arrange(
  [4, M.s("piano")],
  [4, M.s("gm_epiano2")],
  [8, M.s("<piano gm_epiano2>")],
  [16, M.transpose(12).s("piano, gm_epiano2")], 
  [4, u.s("piano, gm_epiano2")],
  [4, u.fast(2).transpose(-12).rev().s("gm_epiano2")],
  [4, u.fast(2).transpose(-12).s("piano")],
).gain(sine.range(0.6, .8))._pianoroll({labels: 1}),

arrange( 
  [16, ss],
  [16, ss.jux(rev)],
  [12, ss.rev()]
).s("triangle gm_acoustic_bass").sometimesBy(.3, x => x.gain(.3))._punchcard({labels:1})
  ).room("<0 .2 .4 .6 >")
  .sz("<0.2 0.4 0.6 .8>")//room size
  .pitchwheel()
```

### v1.4

```javascript
setcpm(112/4)
const u = note(`< [d4 f#4 a4] [g4 <[[b4 d5]] [[b4 d5]!2]>]
[f#4 a4 c#5] [e4 <[[g4 b4]!2] [[g4 b4]]>]>`)
const M = arrange(
  [8, u],
  [4, u.jux(rev)],
  [4, u.rev()],
).color("<cyan violet salmon gold>")
const ss = note(`< [a2 <d3 g3 f#3 e3>]>`)
const j = n("~")//jeda

stack (
  arrange(
  [4, M.s("piano")],
  [4, M.s("gm_epiano2")],
  [8, M.s("<piano gm_epiano2>")],
  [16, M.transpose(12).s("piano, gm_epiano2")], 
  [.5, j],
  [8, u.s("<gm_epiano2 piano>")],
  [4, u.fast(2).transpose(-12).rev().s("gm_epiano2")],
  [4, u.fast(2).transpose(-12).rev().s("piano")],
  [.5, j]
).gain(sine.range(0.6, .8))._pianoroll({labels: 1}),

arrange( 
  [16, ss],
  [16, ss.jux(rev)],
  [.5, j],
  [16, ss.rev()],
  [0.5, j]
).s("<triangle gm_acoustic_bass>").sometimesBy(.2, x => x.gain(.3))._punchcard({labels:1})
  ).room("<0 .2 .4 .6 >")
  .sz("<0.2 0.4 0.6 .8>")//room size
  .pitchwheel()
```

### v1.5

```javascript
setcpm(112/4)
const u = note(`< [<[d4 f#4 a4] [f#4 a4 d5]>][g4 <[[b4 d5]] [[b4 d5]!2]>]
[<[f#4 a4 c#5] [a4 c#5 f#4]>][e4 <[[g4 b4]!2] [[g4 b4]]>]>`)
const M = arrange(
  [8, u],
  [4, u.jux(rev)],
  [4, u.rev()],
).color("<cyan violet salmon gold>")
const ss = note(`< [a2 <d3 g3 f#3 e3>]>`)
const j = n("~")//jeda

stack (
  arrange(
  [1, u.rev().slow(2).s("piano, triangle").transpose(-12)],
  [4, M.s("piano")],
  [4, M.s(" triangle")],
  [8, M.s("<piano triangle>")],
  [16, M.transpose(12).s("piano, triangle")], 
  [.5, j],
  [8, u.s("<triangle piano>")],
  [4, u.fast(2).rev().s("triangle")],
  [4, u.fast(2).transpose(-12).rev().s("piano")],
  [.5, j]
).gain(tri.range(0.4, .8))._pianoroll({labels: 1}),

arrange( 
  [1, j],
  [16, ss],
  [16, ss.jux(rev)],
  [.5, j],
  [16, ss.rev()],
  [0.5, j]
).s("<triangle gm_acoustic_bass>").sometimesBy(.1, x => x.gain(.3))._punchcard({labels:1})
  ).room("<0 .2 .4 .6 >")
  .sz("<.2 .4 .6 .8>")//room size
  .pitchwheel()
```

### v1.6

documented in the recording below.

{{< mus-divider >}}

{{< youtube 2SuhzwQLleU >}}

{{< mus-divider >}}