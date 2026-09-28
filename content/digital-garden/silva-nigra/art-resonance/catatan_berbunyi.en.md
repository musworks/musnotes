---
title: "From Sounding Notes to an Interconnected System"
date: 2026-09-28T22:06:00+07:00
type: garden-note
draft: false
summary: "Notes on learning about shared state in Sonic Pi: from independent live_loops to loops that read and write state through set and get."
categories: ["sonic-pi", "logic"]
cover:
  image: "/images/profesor-tua.png"
  hiddenInSingle: true
  hiddenInList: true
---
{{< youtube i3IcCLFihS8>}}

Spending hours in front of a screen playing with Sonic Pi is genuinely fun. On the other hand, as a biology student, I feel a little guilty when the time I spend experimenting with sound drastically cuts into my study time. To keep this hobby from leading to fatal administrative consequences (that is, failing my courses), I looked for a compromise.

The idea was simple: use Sonic Pi to take notes, *recall*, or map biology concepts through code that produces audio output. The goal is pragmatic: improve my *live coding* skills while keeping my understanding of biology intact.

My first experiment began with the major tissue systems of plants. I mapped ground tissue, vascular tissue, and dermal tissue to several `live_loop`s, each producing a different sound pattern. At this stage, my aim was to turn concepts from plant anatomy into musical representations that I could tinker with, while also using them as a way to recall the material.

### From Sounding Notes to Shared State

In terms of sound aesthetics, my first experiment worked. However, when I discussed the code with Claude, the conversation took a different direction. Claude criticised the way biological components were represented as relatively isolated `live_loop`s, especially when I began treating stomatal behaviour as an independent random process.

That criticism drew my attention to a clear distinction between two approaches: **representing biological information through sound** and **modelling the relationships between components within a biological system**. My initial code was intended purely for the first purpose, not to simulate the physiological mechanisms of a plant.

The criticism prompted a new question: *what if a loop did not merely produce sound according to its own rules, but actively responded to information passed along by another loop?*

{{< mus-divider >}}

## The Experiment Begins: Understanding the Abstraction Intuitively

Rather than starting with the literature, I went straight to trying out the functionality in Sonic Pi, hoping to grasp its logic intuitively.

To examine the abstraction, I deliberately set physiological terminology aside for the moment. I began with a `live_loop` that produces the sound of *vinyl hiss*.

```ruby
use_bpm 80

live_loop :hiss do
  meong = rrand(0.4, 0.8)
  set :m, meong
  sample :vinyl_hiss, amp: meong - 0.1
  sleep sample_duration(:vinyl_hiss)
end
```

Each time the loop runs, `rrand(0.4, 0.8)` generates a random value between 0.4 and 0.8. That value is stored in the variable `meong`, then used to determine the amplitude of the *vinyl hiss* sound.

The crucial part is this line:

```ruby
set :m, meong
```

I read it as: _"Store the value of `meong` in a shared global variable named `:m`."_

I understand an ordinary Ruby variable (in this case, `meong`) as a place to store a value used by code within its execution context. Meanwhile, `set` and `get` provide a way to store and read values through Sonic Pi's *Time State*, allowing those values to be accessed by several `live_loop`s.

### Using a Value from Another Loop

After that, I added two loops.

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

The `:experimental_drum` loop deliberately does not interact with state at all. It serves as a comparison: it continues to run independently, just as in my first experiment. In the `:hithat` loop, notice `amp: get[:m]`. This is where **shared state** begins to take shape. The vinyl hiss (`:vinyl_hiss`) and the hi-hat (`:hithat`) are now both driven by the same value, `meong`, connected through the `set` and `get` pair.

### A Further Layer: Value Modulation and a Second State

I wanted to see whether this shared variable could influence a melodic instrument without letting it get swallowed by the other sounds. To do that, I created a `:chord` loop that reads `:m` to determine its volume.

```ruby
live_loop :chord do
  progression = [[:c4, :major], [:a3, :minor], [:f3, :major], [:g3, :major]]

  # The chord must not be quieter than 0.5
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

The expression `get[:m] || 0.5` provides a fallback value of `0.5` if no value is yet available for `:m`. Next, `.max` compares that value with `0.5` and returns whichever is greater.

This means that `m1` will never be smaller than `0.5`. If the value of `:m` falls below that threshold, the chord amplitude remains at `0.5`. If the value is higher, the amplitude follows the value of `:m`.

<div class="table-wrapper">
  <table>
    <thead>
      <tr>
        <th>Value of `:m`</th>
        <th>Value of `m1`</th>
        <th>Result</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>0.40</code></td>
        <td><code>0.50</code></td>
        <td>Uses the minimum threshold</td>
      </tr>
      <tr>
        <td><code>0.45</code></td>
        <td><code>0.50</code></td>
        <td>Uses the minimum threshold</td>
      </tr>
      <tr>
        <td><code>0.51</code></td>
        <td><code>0.51</code></td>
        <td>Follows the source value</td>
      </tr>
      <tr>
        <td><code>0.75</code></td>
        <td><code>0.75</code></td>
        <td>Follows the source value</td>
      </tr>
    </tbody>
  </table>
</div>

> **Correction note.** My first version used `if m1 <= 0.5 then m1 + 0.5`. When I put the results into a table, they looked strange: 0.40 became 0.90, while 0.75 remained 0.75. In other words, the quieter `m` became, the louder the chord grew. That inversion was unintended. I had written the code too quickly and only noticed the problem after setting out the values in the table. The version above uses `max`, so the relationship is monotonic.

In addition to reading `:m`, the `:chord` loop also writes a new state through `set :current_chord, c`. The chord currently being played thus becomes available to other loops, and the `:melody` loop makes use of it.

### Adding a Melody That Reads the Chord

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

In this loop, `get[:current_chord]` reads the most recently stored chord from state. `active_c.choose` then selects one note from that chord, while `+ 12` raises the selected note by one octave.

The condition `active_c && one_in(3) == false` ensures that the melody is played only when a chord value is available and the probability condition is met. Since `one_in(3)` evaluates to true roughly one time in three, using `== false` gives the melody a chance to play in approximately two out of every three iterations.

Meanwhile, `lead_amp` takes the value of `:m`, using `0.5` as a fallback, and then multiplies it by `0.8`. The melody's amplitude is therefore directly influenced by the same value used by `:chord`, but through a different calculation.

{{< mus-divider >}}

### Mapping the Relationships Between Loops

<div class="mus-flow-tree">
  <div class="mus-flow-root">
    <div class="mus-flow-node">
      <span class="mus-flow-label"><code>:hiss</code></span>
      <span class="mus-flow-note">Generates a random value and stores it</span>
    </div>
  </div>
  <div class="mus-flow-branches">
    <div class="mus-flow-branch">
      <div class="mus-flow-node">
        <span class="mus-flow-label"><code>:m</code></span>
        <span class="mus-flow-note">State: shared value</span>
      </div>
      <div class="mus-flow-branches">
        <div class="mus-flow-branch">
          <div class="mus-flow-node">
            <span class="mus-flow-label"><code>:hithat</code></span>
            <span class="mus-flow-note">Reads the value for amplitude</span>
          </div>
        </div>
        <div class="mus-flow-branch">
          <div class="mus-flow-node">
            <span class="mus-flow-label"><code>:chord</code></span>
            <span class="mus-flow-note">Reads the value for chord amplitude</span>
          </div>
          <div class="mus-flow-branches">
            <div class="mus-flow-branch">
              <div class="mus-flow-node">
                <span class="mus-flow-label"><code>:current_chord</code></span>
                <span class="mus-flow-note">The most recently stored chord</span>
              </div>
              <div class="mus-flow-branches">
                <div class="mus-flow-branch">
                  <div class="mus-flow-node">
                    <span class="mus-flow-label"><code>:melody</code></span>
                    <span class="mus-flow-note">Reads the chord and the value of <code>:m</code></span>
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

### What Can Be Learned from This Abstraction?

At the beginning, I asked: what if a component did not merely follow its own rules, but also responded to information produced by another component? In the initial setup, one source (the environment) writes, while all the other loops only read. No component influences another.

The experiment with `:m` adds the other half through `:chord`, which reads the signal from `:hiss` and simultaneously writes a new signal for `:melody`. For the first time, there is a chain of influence between components, rather than just one source feeding multiple readers.

If I map this onto biology, `:m` is closer to a signal produced by the system itself (something like a hormone) than to an environmental factor such as light, because it is produced by a loop within my system. The analogy is loose, and there are two reasons why it does not quite fit:

- Each loop checks `:m` according to its own schedule; none is "woken up" by a change. This is more like reading the concentration of a substance than a signalling cascade. In Sonic Pi, `sync` and `cue` are closer to event triggers, though I have not used them yet.
- My flow is one-way, whereas biological systems are generally circular: an organ's response can influence the secretion of the next signal.

{{< mus-divider >}}
