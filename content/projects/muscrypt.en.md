---
title: "Muscrypt: When Text Interprets Itself"
date: 2026-05-21T00:00:00+07:00
draft: false
math: false
type: "garden-note"
cover:
  image: "/images/muscrypt.png"
  hiddenInList: true
  hiddenInSingle: true
summary: "Muscrypt as an experiment in text transformation, symbolic cipher, and reflection on how writing survives within visual culture."
categories: ["Digital Works", "Reflection"]
tags: ["muscrypt", "cipher", "writing", "digital expression", "interpretation"]
---

Muscrypt was never created as a security tool, let alone as a rigid academic cryptography experiment. this space was born from a simple but persistent curiosity: the relationship between text, meaning, and the way we interpret it.

It is an experiment in form. A space where text is given the freedom to lock and unlock itself.

> Muscrypt is an experimental symbolic cipher for personal expression, not a cryptographic security tool.

{{< mus-divider >}}

## Design Anatomy: Two Directions That Can Open Each Other

Mechanically, Muscrypt operates through two main types of transformation: **Sembunyikan** and **Interpretasikan**.

Both are designed to be reversible, but they open the result from opposite directions. If the flow is visualized as two possibilities from a single starting point, it looks like this:

{{< rawhtml >}}
<div class="mus-flow-tree">
  <div class="mus-flow-root">
    <span class="mus-flow-node">Original Text</span>
  </div>

  <div class="mus-flow-branches">
    <div class="mus-flow-branch">
      <span class="mus-flow-label">Sembunyikan Direction</span>
      <span class="mus-flow-node">Sembunyikan</span>
      <span class="mus-flow-note">Produces cipher A</span>
      <span class="mus-flow-node">Interpretasikan</span>
      <span class="mus-flow-note">Returns to Original Text</span>
    </div>
    <div class="mus-flow-branch">
      <span class="mus-flow-label">Interpretasikan Direction</span>
      <span class="mus-flow-node">Interpretasikan</span>
      <span class="mus-flow-note">Produces cipher B</span>
      <span class="mus-flow-node">Sembunyikan</span>
      <span class="mus-flow-note">Returns to Original Text</span>
    </div>
  </div>
</div>
{{< /rawhtml >}}

In the first path, readable text enters through **Sembunyikan**, becomes **cipher A**, and can be opened again through **Interpretasikan**. In the second path, readable text enters through **Interpretasikan**, becomes **cipher B**, and can be opened again through **Sembunyikan**.

In other words, **Interpretasikan** is not merely a switch for opening a cipher. If this function is applied to readable text, it produces an encrypted form from the opposite direction.

{{< mus-divider >}}

## Layered Encryption

From this two-directional system, a feature emerges organically: **layered encryption**. Because the result of a transformation can be inserted back as input, there is no theoretical limit to the number of symbolic layers that can be built.

{{< rawhtml >}}
<div class="flow-container">
  <div class="flow-wrapper">
    <div class="flow-node node-sage">
      <span class="node-label">Text</span>
    </div>
    <div class="flow-arrow arrow-sage"></div>
    <div class="flow-node node-blue">
      <span class="node-label">cipher 1</span>
    </div>
    <div class="flow-arrow arrow-blue"></div>
    <div class="flow-node node-blue">
      <span class="node-label">cipher 2</span>
    </div>
    <div class="flow-arrow arrow-blue"></div>
    <div class="flow-node node-blue">
      <span class="node-label">cipher 3</span>
    </div>
    <div class="flow-arrow arrow-blue"></div>
    <div class="flow-node node-orchid">
      <span class="node-label">Next layer</span>
    </div>
  </div>
</div>
{{< /rawhtml >}}

This process allows a word to sink deeper and deeper into an ocean of letters. Here is a concrete example of layered transformation:

```text
Indonesia
=> HYMIYCLHK
=> PFZHFVSPR
=> JNTPNWLJD
=> QYEJYBSQM
=> ...
```

Each new layer is a distance deliberately created between a piece of writing and its meaning.

{{< mus-divider >}}

## The Tukar Button

To support the exploration of those layers, a simple function is embedded: **Tukar**.

{{< rawhtml >}}

<div class="flow-container">
  <div class="flow-wrapper">
    <div class="flow-node node-blue">
      <span class="node-label">Output</span>
    </div>
    <div class="flow-arrow arrow-blue"></div>
    <div class="flow-node node-orchid">
      <span class="node-label">Tukar</span>
    </div>
    <div class="flow-arrow arrow-orchid"></div>
    <div class="flow-node node-sage">
      <span class="node-label">New Input</span>
    </div>
  </div>
</div>
{{< /rawhtml >}}

The **Tukar** function was created for practical exploration. Users can multiply transformations without manually copying and pasting, allowing text to keep mutating with a single touch.

{{< mus-divider >}}

## The Shift of Expression Medium

Looking at today’s digital landscape, one observation is hard to avoid: most modern expression appears aggressively in visual form.

We live in an era of screaming thumbnails, endlessly scrolling reels and shorts, memes, illustrations, and images generated by *artificial intelligence*. Within this noise, text certainly has not disappeared. Yet slowly, and perhaps quietly, its function is often reduced to a companion for visual media.

Writing often appears as a companion to an oversized hero image in an article, as text inside an Instagram carousel, as a caption read only after the eyes have finished consuming the image, or as small subtitles at the bottom of a video.

This raises a reflective question:

> Can writing still become a space for interpretation without borrowing attention from another medium?

{{< mus-divider >}}

## The Philosophy Behind the Code

> Perhaps expression in writing is destined to interpret itself.

Muscrypt is a response to that question. When text is entered, Muscrypt does not turn it into an illustration, a sequence of emojis, audio, or colorful visualization. It is born again as text. Only its form changes, while its medium remains pure.

Hiding text in this space does not mean erasing its meaning. The meaning remains there, intact and breathing. The cipher in Muscrypt only extends the path toward that meaning.

We are often used to thinking of interpretation as a linear process for opening meaning. But here, interpretation can also mean transformation. The **Interpretasikan** button has its own transformational identity. It is not merely the opposite of **Sembunyikan**, but also a function capable of creating a new form.

In Muscrypt, a sentence can change form again and again, layer after layer, without ever leaving its original medium. It remains writing. It remains language. It remains a collection of signs patiently waiting for its reader.

Perhaps that is why some expressions are intentionally created only to be understood by themselves.

<div class="table-wrapper">
  <table>
    <thead>
      <tr>
        <th>Detail</th>
        <th>Information</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Status</strong></td>
        <td>Release</td>
      </tr>
      <tr>
        <td><strong>Platform</strong></td>
        <td>Web App (Static)</td>
      </tr>
      <tr>
        <td><strong>Link</strong></td>
        <td><a href="https://muscrypt.musnotes.my.id/">Open Muscrypt</a></td>
      </tr>
    </tbody>
  </table>
</div>