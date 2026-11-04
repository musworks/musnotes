---
title: "Strudel: Arranging Musical Time with `arrange()`"
date: 2026-11-04T00:00:00+07:00
type: garden-note
draft: false
categories: ["strudel", "live_coding"]
math: true
cover:
  image: "/images/draft_cover/001home.png"
  hiddenInSingle: true
  hiddenInList: true
---

The melody of *Children's Play Song* by Bill Evans is stuck in my head. I want to play it but can't be bothered to use a chromatic harmonica, so I'm looking for a way to get Strudel to play it. And I'm learning how to use the `arrange` function.

## Listening to the melody

The recording I'm referring to is from Bill Evans' album *From Left to Right*.

What caught my attention was the interaction between two recurring melodic motifs. They seem to work like a call-and-response. Both motifs keep returning throughout the recording.

I tried to capture this relationship by translating what I heard into two separate Strudel patterns.

```javascript
const s = n("< 0 2 4 ~ [3 4] 5 4 ~ 5 3 4 7 2 0 1 ~ >")

const o = n("< 6 ~ 5 ~ [6 7] 6 5 ~ 6 4 5 7 6 4 5 ~ >")
```

Here, `s` and `o` represent the two melodic motifs. I'm not trying to reproduce every detail of the original recording, but rather to capture the melodic movement that caught my ear.

## Arranging the patterns

Initially, I treated the two motifs as independent patterns. Then I wanted to organize them into a longer sequence without having to rewrite their internal structures.

That's where `arrange()` came in.

```javascript
arrange(
  [16*2, s],
  [16*2, o]
)
```

The first element in each pair specifies the number of cycles allocated to that pattern, while the second element contains the pattern itself.

In this experiment, each motif gets 32 cycles. Since the two patterns are arranged sequentially, the resulting structure occupies 64 cycles.

#### screen recording
<video controls playsinline preload="metadata" width="100%">
  <source src="/videos/strudel/arrange.mp4"
          type="video/mp4">
</video>

## Understanding cycle duration

Strudel uses cycles as units of musical time. With the following tempo setting:

```javascript
setcpm(112/4)
```

The cycle rate is 28 cycles per minute.

Therefore:

$$
T_{\text{cycle}} = \frac{60}{28}
\approx 2.143 \text{ seconds}
$$


I also experimented with `.fast(2)`, which doubles the playback speed of the resulting pattern.

This means the complete 64-cycle arrangement takes approximately 68.57 seconds.

## What I learned

I started thinking about musical time differently. Instead of treating everything as one continuous sequence, I could separate melodic ideas into independent patterns and organize their temporal relationships through `arrange()`.

It gave me another way to approach musical structure: patterns define the musical material, while arrangement determines how that material unfolds over time.

Still experimenting.

{{< mus-divider >}}

**Musical reference:** Bill Evans, "Children's Play Song", from *From Left to Right* (1969). https://www.youtube.com/watch?v=jiJh5vJhenA