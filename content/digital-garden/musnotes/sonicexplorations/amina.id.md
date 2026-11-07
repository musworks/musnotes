---
title: "Amina"
date: 2026-11-04T00:00:00+07:00
type: garden-fragment
draft: false
categories: ["sonic-pi", "live_coding"]
cover:
  image: "/images/draft_cover/001home.png"
  hiddenInSingle: true
  hiddenInList: true
---

Setelah sekitar dua minggu tidak membuka Sonic Pi, aku kembali menulis beberapa baris kode. Dimulai dengan sample `vinyl_hiss`, lalu entah bagaimana aku teringat struktur asam amino.

Aku mulai menamai variabel dan loop dengan istilah molekul yang kukenal. sekadar membiarkan sesuatu yang pernah kupelajari meresap ke dalam proses kreatif.

## Amina

{{< mus-divider >}}

{{< youtube OqryWZ_AOCs >}}

{{< mus-divider >}}


## Code

```ruby
# title amina
# by mus

use_bpm 112

Hydrogen = ring(0.2, 0.4, 0.3, 0.5)
Carboxyl = ring(0.1, 0.2, 0.3, 0.4, 0.5)

alpha_c = chord(:g4, :m9)
beta_c  = chord(:c4, :dom7)
gamma_c = chord(:d4, :m9)
delta_c = chord(:f4, :maj7)

Carbon = ring(alpha_c, beta_c, gamma_c, delta_c)

live_loop :hydroxyl do
  sync :bar
  h = Hydrogen.tick
  set :H, h
  sample :vinyl_hiss, amp: h
  sleep 1
end

live_loop :oxygen do
  sync :bar
  sample :bd_jazz, amp: 0.6
  sleep 0.5
  sample :elec_blip, amp: 0.8
  sleep 0.5
  sample :elec_snare, amp: 0.6
  sleep 0.5
  sample :elec_blip2, amp: 0.8
  sleep 0.5
end

live_loop :oxygen_hh do
  sync :bar
  4.times do
    sample :hat_tap, amp: rrand(0.8, 1)
    sleep 0.3
    sample :elec_tick, amp: rrand(0.6, 0.8)
    sleep 0.7
  end
end

live_loop :carbon do
  sync :bar
  with_fx :wobble, phase: 2, wave: 1, mix: 0.65 do
    use_synth :rodeo
    play Carbon.tick, amp: get(:H) + 0.5
    sleep 4
  end
end

live_loop :r_group do
  sync :bar
  r = Carboxyl.tick
  set :COOH, r
  with_fx :lpf, cutoff: 65 do
    if one_in(2)
      sleep 1
    else
      use_synth :tb303
      play scale(:d2, :minor_pentatonic).choose, amp: r
      sleep 1
    end
  end
end


live_loop :nitrogen do
  sync :bar
  use_synth :beep
  play scale(:f4, :major).choose, amp: get(:COOH) + 0.5
  sleep [0.5, 1, 1.5].choose
  play scale(:d4, :minor).reverse.tick, amp: get(:H) + 0.3
  sleep [0.5, 1.5, 2].choose
end

live_loop :hydrolysis do
  sync :bar
  with_fx :lpf, cutoff: 75 do
    use_synth :rodeo
    play scale(:d3, :minor).tick, amp: get(:H)
    sleep 2
  end
end

live_loop :a do
  cue :bar
  sleep 4
end
```

{{< mus-divider >}}