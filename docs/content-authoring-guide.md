# Content Authoring Guide

This guide is for writing new content in this Hugo site without breaking encoding, layout consistency, or the existing visual language.

The main rule is simple: reuse the classes and patterns already in the repo. Do not add article-specific CSS or one-off class names unless the pattern is worth making global.

## 1. Encoding and file safety

- Save Markdown files as UTF-8 without BOM when possible.
- This site contains curly quotes, Indonesian text, math symbols, arrows, emoji, and special punctuation. Wrong encoding will turn them into mojibake such as `â†’`, `â€œ`, or `ðŸ§¬`.
- If weird characters appear after editing, re-save the file as UTF-8 and check the diff again before committing.
- Avoid copy-pasting directly from Word, Google Docs, Notion, or other rich-text editors when possible.
- If you must paste from a rich-text source, clean the text afterward:
  - replace smart formatting that rendered incorrectly
  - re-check apostrophes, quotes, arrows, math symbols, and emoji
  - confirm Indonesian characters and punctuation still render correctly
- Prefer editing in a plain-text or code editor.

### Quick recovery rule

If a file suddenly shows broken text, do not keep editing around it. Re-open it, convert/re-save it as UTF-8, and verify the damaged characters before continuing.

## 2. Content paths and current content types

This repo currently uses these content patterns:

- `content/digital-garden/musnotes/...`
  - article-style notes
  - typically `type: "garden-note"`
- `content/digital-garden/silva-nigra/...`
  - reflective notes and fragments
  - either `type: "garden-note"` or `type: garden-fragment`
- section index files such as `_index.md`
  - typically `type: "garden-node"`
  - usually `layout: "list"`
- `content/library/...`
  - permanent library items for books and resources
  - one item per Markdown file
  - typically `type: "book"`, `type: "paper"`, `type: "tool"`, `type: "course"`, or `type: "resource"`

Current section/list visuals such as `musnotes-index`, `silva-archive`, and `archives-register` are layout-level systems. They are not article body classes and should not be pasted into normal Markdown content.

## 2.1 Library section authoring

The `Library` section is a permanent shelf for books and resources. It is not a store page and should be authored like a personal learning archive.

### Structure

- location: `content/library/`
- each book or resource should live in its own Markdown file
- use lowercase filenames with dashes

Examples:

- `content/library/self-theories.md`
- `content/library/campbell-biology.md`
- `content/library/molecular-biology-of-the-cell.md`

### Full front matter example

```yaml
---
title: "Self Theories"
author: "Carol S. Dweck, Ph.D."
type: "book"
status: "owned"
category:
  - "Psychology"
topics:
  - "Motivation"
  - "Personality"
  - "Self-Development"
cover: "/images/library/self-theories.jpg"
links:
  gramedia: "GRAMEDIA_AFFILIATE_LINK_HERE"
description: "Buku referensi untuk memahami motivasi, kepribadian, dan pengembangan diri."
---
```

### Field guide

- `title`
  - the title of the book or resource
- `author`
  - the author, creator, or main source name
- `type`
  - use one of: `book`, `paper`, `tool`, `course`, or `resource`
- `status`
  - use one of: `owned`, `reading`, `finished`, `wishlist`, `borrowed`, or `used`
- `category`
  - broader classification buckets
- `topics`
  - narrower, specific themes or subject areas
- `cover`
  - image path for the cover or thumbnail
- `links.gramedia`
  - Gramedia affiliate link
  - this can be left empty if no affiliate link is available yet
- `description`
  - short, personal, honest note about why the item matters

### Cover image rules

- store Library cover images in `static/images/library/`
- use lowercase filenames with dashes
- example:
  - `static/images/library/self-theories.jpg`
- preferred public path in front matter:
  - `cover: "/images/library/self-theories.jpg"`
- ideal cover ratio is around `2:3`
- avoid oversized files
- compress the image first if needed before adding it to the repo

### Affiliate link rules

- for now, use Gramedia Affiliate links first when available
- buying links only appear on the detail page, not in the Library grid
- do not write sales-heavy copy around the link
- do not pressure readers into buying
- use the site disclosure as written:

> Some links may be affiliate links. I only list resources that are relevant to my own learning or setup.

### Writing style rules

- Library is not an online store
- write it like a personal study shelf
- keep descriptions personal, concise, and honest
- it is fine to mention whether the book is owned, currently being read, already finished, used as reference, or still on the wishlist
- avoid hard-selling language such as:
  - "wajib beli"
  - "terbaik nomor satu"
  - "harus punya semua orang"

### Example Library items

#### Example 1: Self Theories

```yaml
---
title: "Self Theories"
author: "Carol S. Dweck, Ph.D."
type: "book"
status: "owned"
category:
  - "Psychology"
topics:
  - "Motivation"
  - "Personality"
  - "Self-Development"
cover: "/images/library/self-theories.jpg"
links:
  gramedia: "GRAMEDIA_AFFILIATE_LINK_HERE"
description: "Buku referensi untuk memahami motivasi, kepribadian, dan pengembangan diri."
---
```

#### Example 2: Campbell Biology

```yaml
---
title: "Campbell Biology"
author: "Lisa A. Urry, Michael L. Cain, Steven A. Wasserman, Peter V. Minorsky, Rebecca B. Orr"
type: "book"
status: "used"
category:
  - "Biology"
topics:
  - "General Biology"
  - "Cell Biology"
  - "Evolution"
cover: "/images/library/campbell-biology.jpg"
links:
  gramedia: "GRAMEDIA_AFFILIATE_LINK_HERE"
description: "Salah satu pegangan utama untuk biologi umum dan titik awal yang sering kupakai untuk kembali ke konsep dasar."
---
```

#### Example 3: Wishlist item

```yaml
---
title: "Molecular Biology of the Cell"
author: "Bruce Alberts, Alexander Johnson, Julian Lewis, Martin Raff, Keith Roberts, Peter Walter"
type: "book"
status: "wishlist"
category:
  - "Cell Biology"
topics:
  - "Molecular Biology"
  - "Cell Structure"
  - "Biochemistry"
cover: "/images/library/molecular-biology-of-the-cell.jpg"
links:
  gramedia: ""
description: "Masuk wishlist karena ingin punya referensi yang lebih dalam untuk biologi sel dan molekuler."
---
```

### Steps for adding a new Library item

1. Create a new Markdown file in `content/library/`.
2. Add the Library front matter fields.
3. Save the cover image to `static/images/library/`.
4. Point `cover` to the public path, for example `/images/library/self-theories.jpg`.
5. Fill in the Gramedia affiliate link if available.
6. Run Hugo or local preview.
7. Check `/library/` to confirm the grid item looks correct.
8. Open the detail page and confirm metadata, cover, and affiliate link rendering.

### Copy-ready blank Library template

```yaml
---
title: "Book or Resource Title"
author: "Author Name"
type: "book"
status: "owned"
category:
  - "Main Category"
topics:
  - "Topic One"
  - "Topic Two"
cover: "/images/library/file-name.jpg"
links:
  gramedia: ""
description: "Short personal note about why this item is here."
---
```

## 3. Front matter standards

Use YAML front matter (`---`) for normal content files.

### Required baseline fields for article content

- `title`
- `date`
- `draft`
- `type`

### Common optional fields

- `summary`
- `categories`
- `tags`
- `math`
- `layout`
- `cover`

### Date format

Preferred format:

```yaml
date: 2026-05-15T22:00:00+07:00
```

Accepted in some existing files but less preferred:

```yaml
date: 2026-05-15
```

Use the full ISO-style datetime with timezone when possible for consistency.

### `draft`

- `draft: true` for unpublished work
- `draft: false` for publishable content

### `math`

- Set `math: true` only when the article needs LaTeX or MathJax rendering
- Omit it or set `math: false` when math is not needed

### `type`

Current repo usage:

- `type: "garden-note"` for article/note pages
- `type: garden-fragment` for fragmentary Silva Nigra entries
- `type: "garden-node"` for section index pages

### `cover`

Recommended default for article content in this repo:

```yaml
cover:
  image: "/images/sebelum-kesepian-didefinisikan.png"
  hiddenInList: true
  hiddenInSingle: true
```

Use this when you want a stable default cover asset for new posts without showing the image in list cards or on the single article page.

Notes:

- `cover.image` is the field used by the current `PaperMod` setup
- `hiddenInList: true` hides the cover from list/archive views
- `hiddenInSingle: true` hides the cover from the article page itself
- the cover value can still be replaced per article when needed

### Regular musnotes article

```yaml
---
title: "Judul Catatan"
date: 2026-05-15T22:00:00+07:00
draft: false
math: false
type: "garden-note"
cover:
  image: "/images/sebelum-kesepian-didefinisikan.png"
  hiddenInList: true
  hiddenInSingle: true
summary: "Ringkasan singkat 1-2 kalimat."
categories: ["Biology", "Ecology"]
tags: ["field notes", "ekologi", "konsep dasar"]
---
```

### Silva Nigra article

Use this for longer note-like essays inside Silva Nigra:

```yaml
---
title: "Judul Catatan Silva Nigra"
date: 2026-05-15T22:00:00+07:00
draft: false
math: false
type: "garden-note"
cover:
  image: "/images/sebelum-kesepian-didefinisikan.png"
  hiddenInList: true
  hiddenInSingle: true
summary: "Ringkasan singkat untuk daftar dan preview."
categories: ["Identity", "Philosophy"]
tags: ["identity", "memory", "perception"]
---
```

### Silva Nigra fragment

Use this for shorter fragment-style entries:

```yaml
---
title: "Judul Fragmen"
date: 2026-05-15T22:00:00+07:00
draft: false
type: garden-fragment
cover:
  image: "/images/sebelum-kesepian-didefinisikan.png"
  hiddenInList: true
  hiddenInSingle: true
summary: "Jejak ide, intuisi, atau fragmen reflektif."
tags: ["music", "consciousness", "imagination"]
---
```

### Digital Garden section or note index

Use this only for `_index.md` section pages, not regular articles:

```yaml
---
title: "Section Title"
description: "Short section description."
summary: "Optional list-page summary."
weight: 1
type: "garden-node"
layout: "list"
---
```

## 4. Divider rule

Use the Hugo shortcode below for thematic breaks:

```go-html-template
{{< mus-divider >}}
```

Do not use raw Markdown horizontal rules such as:

```md
---
```

Why:

- the repo already has a custom shortcode at `layouts/shortcodes/mus-divider.html`
- the site styles the `.mus-divider` visual system globally
- replacing it with raw rules creates inconsistent presentation

## 5. Reusable visual systems already in the repo

The article-level reusable systems currently documented from `assets/css/extended/custom.css` are:

- `mus-divider`
- the generic flow diagram system
- the styled table wrapper
- standard Markdown blockquotes

There is no reusable global article callout class or article image wrapper class yet.

### 5.1 Flow diagrams

Use for:

- inline flow charts
- process steps
- concept transitions
- biology/ecology sequences
- two-lane comparisons

Core classes:

- `flow-container`
- `flow-wrapper`
- `flow-wrapper--start`
- `flow-wrapper--end`
- `flow-wrapper--spaced`
- `flow-node`
- `node-sage`
- `node-orchid`
- `node-blue`
- `flow-node--alert`
- `node-icon`
- `node-label`
- `flow-arrow`
- `arrow-sage`
- `arrow-orchid`
- `arrow-blue`
- `flow-stack`
- `flow-stack__focus`
- `flow-stack__axis`

#### Basic single-row structure

```html
<div class="flow-container">
  <div class="flow-wrapper">
    <div class="flow-node node-sage">
      <span class="node-icon">🧬</span>
      <span class="node-label">Gen &amp; Genom</span>
    </div>
    <div class="flow-arrow arrow-sage"></div>
    <div class="flow-node node-orchid">
      <span class="node-icon">🌅</span>
      <span class="node-label">Ekosistem</span>
    </div>
  </div>
</div>
```

#### Two-lane or opposed-direction structure

```html
<div class="flow-container">
  <div class="flow-wrapper flow-wrapper--start flow-wrapper--spaced">
    <div class="flow-node node-sage">
      <span class="node-label">A: Masa Lalu</span>
    </div>
    <div class="flow-arrow arrow-sage"></div>
    <div class="flow-node node-sage">
      <span class="node-label">Masa Depan</span>
    </div>
  </div>

  <div class="flow-wrapper flow-wrapper--end">
    <div class="flow-node node-orchid">
      <span class="node-label">B: Masa Depan</span>
    </div>
    <div class="flow-arrow arrow-orchid"></div>
    <div class="flow-node node-orchid">
      <span class="node-label">Masa Lalu</span>
    </div>
  </div>
</div>
```

#### Stacked anomaly or collision structure

```html
<div class="flow-container">
  <div class="flow-stack">
    <div class="flow-wrapper flow-wrapper--start">
      <div class="flow-node node-sage">
        <span class="node-icon">🌱</span>
        <span class="node-label">A: Sel Membelah</span>
      </div>
      <div class="flow-arrow arrow-sage"></div>
    </div>

    <div class="flow-stack__focus">
      <div class="flow-node flow-node--alert">
        <span class="node-icon">⚠️</span>
        <span class="node-label"><strong>Anomali</strong></span>
      </div>
    </div>

    <div class="flow-wrapper flow-wrapper--end">
      <div class="flow-arrow arrow-orchid"></div>
      <div class="flow-node node-orchid">
        <span class="node-icon">🧬</span>
        <span class="node-label">B: Sel Menyatu</span>
      </div>
    </div>

    <div class="flow-stack__axis"></div>
  </div>
</div>
```

Mobile notes:

- `flow-container` already supports horizontal scrolling on narrow screens
- `flow-node` and `flow-arrow` already scale down in the mobile breakpoint
- keep labels short
- avoid long sentences inside nodes
- prefer 2-6 nodes per row
- if the diagram becomes too wide, split it into two smaller diagrams instead of adding custom CSS

#### Branching or tree flow diagrams

Use the tree flow chart variant when:

- the logic branches
- you are comparing two or more paths
- one root concept splits into multiple outcomes

Do not use the tree variant for simple linear processes. For step-by-step sequences, keep using the existing linear flow chart syntax and classes above.

Recommended classes:

- `mus-flow-tree`
- `mus-flow-root`
- `mus-flow-branches`
- `mus-flow-branch`
- `mus-flow-node`
- `mus-flow-label`
- `mus-flow-note`

Recommended Hugo Markdown pattern using raw HTML:

```go-html-template
{{< rawhtml >}}
<div class="mus-flow-tree">
  <div class="mus-flow-root">
    <span class="mus-flow-node">Zigot</span>
  </div>

  <div class="mus-flow-branches">
    <div class="mus-flow-branch">
      <span class="mus-flow-label">Yolk sedikit/sedang</span>
      <span class="mus-flow-node">Holoblastik</span>
      <span class="mus-flow-note">Membelah total</span>
    </div>

    <div class="mus-flow-branch">
      <span class="mus-flow-label">Yolk sangat padat</span>
      <span class="mus-flow-node">Meroblastik</span>
      <span class="mus-flow-note">Membelah parsial</span>
    </div>
  </div>
</div>
{{< /rawhtml >}}
```

Encoding safety:

- avoid ASCII-art trees
- avoid box-drawing characters
- avoid special arrows in article source
- let CSS handle connectors instead
- prefer normal text inside HTML elements

Responsive notes:

- on desktop, branches may display wider or horizontally
- on mobile, branches stack vertically
- keep labels short where possible

Do:

- use the tree flow chart for branching biological concepts
- keep each branch concise
- use `mus-flow-note` for short explanations

Don't:

- use it for long paragraphs
- paste text-based diagram art
- create one-off inline styles in articles

### 5.2 Biology or ecology diagrams

Preferred approach:

- use the same global flow system above
- choose `node-sage`, `node-orchid`, or `node-blue` only as visual accents
- use emoji icons only if they add meaning and do not reduce readability

Recommended mappings based on existing content:

- `node-sage` for organic, biological, or earlier-stage concepts
- `node-orchid` for interpretive, transitional, or contrasting concepts
- `node-blue` for functional or technical concepts

Do not treat these colors as rigid semantics if the article needs a clearer grouping. Consistency within one diagram matters more.

### 5.3 Tables

Use for:

- reference lists
- symbol guides
- short comparisons
- structured lookup content

Current reusable class:

- `table-wrapper`

#### Preferred HTML table structure

```html
<div class="table-wrapper">
  <table>
    <thead>
      <tr>
        <th>Term</th>
        <th>Meaning</th>
        <th>Example</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>≥</code></td>
        <td>Lebih besar atau sama dengan</td>
        <td><code>x ≥ y</code></td>
      </tr>
      <tr>
        <td><code>≤</code></td>
        <td>Lebih kecil atau sama dengan</td>
        <td><code>x ≤ y</code></td>
      </tr>
    </tbody>
  </table>
</div>
```

Mobile notes:

- `table-wrapper` already adds horizontal scrolling
- avoid too many columns
- 3 columns is the safest pattern
- 4 columns is possible, but only if cell content stays compact
- avoid wide prose inside cells

### 5.4 Blockquotes as the current note or callout style

There is no dedicated `.mus-callout` or `.mus-note` class in the repo right now.

For emphasis, pull-quotes, or note-like interludes, use standard Markdown blockquotes:

```md
> Catatan singkat atau kutipan penting.
```

The site already styles `.post-content blockquote` globally.

Use blockquotes for:

- reflective asides
- quoted lines
- short “note to reader” moments

Do not use blockquotes as a replacement for:

- large structured diagrams
- multi-column comparison content
- complex warnings that really need a future reusable component

### 5.5 Images

Current state:

- regular Markdown images are supported
- some older posts use inline `<div style="max-width: ...; text-align: center;">` wrappers for centered images and captions
- there is no reusable global article image-block class yet

Preferred authoring rule:

- use plain Markdown images first
- if a simple caption is needed, keep the HTML wrapper minimal
- do not create a new image wrapper class inside one article unless it will become a reusable global pattern

Temporary minimal image pattern if absolutely needed:

```html
<div>
  ![Deskripsi gambar](/images/example.png)
  <p><em>Keterangan singkat.</em></p>
</div>
```

But this should be treated as a fallback, not a documented visual system. If image blocks become common, add a global class in CSS and update this guide.

### 5.6 Archive and list visuals

These classes exist in the site CSS but are layout-only, not article-body tools:

- `musnotes-index*`
- `silva-archive*`
- `silva-chamber*`
- `silva-fragment*`
- `archives-register*`

Do not paste these classes into article Markdown.

## 6. Inline flow chart guide

Preferred rules:

- use the existing global flow system
- start with `flow-container` and `flow-wrapper`
- build each concept box with `flow-node`
- use `node-label` for text
- use `node-icon` only when it helps
- use `flow-arrow` between nodes
- use `flow-wrapper--start` and `flow-wrapper--end` for two-lane alignment
- use `flow-stack` only for vertically staged diagrams
- use the tree variant only when one concept branches into multiple outcomes
- for branching structures, use `mus-flow-tree`, `mus-flow-root`, `mus-flow-branches`, `mus-flow-branch`, `mus-flow-node`, `mus-flow-label`, and `mus-flow-note`

Avoid:

- inline styles for alignment or spacing when `flow-wrapper--start`, `flow-wrapper--end`, or `flow-wrapper--spaced` already works
- custom one-off wrappers like older `converge-diagram` unless that pattern is first promoted into global CSS
- long labels that force nodes to become unreadable on mobile
- ASCII-art trees, box-drawing characters, or pasted text diagrams for branching layouts

Legacy note:

Some older files still contain:

- inline `style=""` on flow wrappers
- custom article-local classes such as `converge-diagram`
- article-local `<style>` blocks

Do not copy those forward into new content.

## 7. Table guide

### When to use a simple Markdown table

Use a normal Markdown table when:

- the table is very small
- no special formatting is needed
- the content is short and likely to remain narrow

Example:

```md
| Istilah | Arti |
| --- | --- |
| Sel | Unit dasar kehidupan |
| Gen | Unit pewarisan informasi |
```

### When to use a custom HTML table

Use HTML plus `table-wrapper` when:

- the table has 3 or 4 columns
- cells include code, symbols, or emphasis
- better wrapping control is needed
- the content is reference-like and should match the site’s styled table system

### Table safety rules

- prefer 2-4 columns
- keep header labels short
- avoid very long unbroken strings
- wrap code-like content in `<code>`
- do not add inline styles for width unless the table system is being upgraded globally

## 8. Diagram and HTML safety

- Keep inline HTML semantic and minimal.
- Prefer a shallow structure.
- Avoid deeply nested `<div>` trees unless the pattern truly needs it.
- Avoid random inline styles.
- Avoid article-local `<style>` blocks.
- Do not create new CSS for one article unless the pattern will be reused.
- If a new pattern is needed:
  - define it globally in `assets/css/extended/custom.css`
  - use a clear, reusable class name
  - document it in this guide in the same change

Important repo note:

- `markup.goldmark.renderer.unsafe = true` is enabled in `hugo.toml`, so inline HTML is allowed
- that does not mean arbitrary HTML should be used casually
- prefer Markdown first, then minimal HTML only where structure actually matters

## 9. Naming conventions

For any future reusable classes:

- prefer the existing project naming style
- use lowercase kebab-case
- avoid random names
- use clear system prefixes when appropriate

Current repo patterns include:

- `mus-*`
- `flow-*`
- `node-*`
- `silva-*`
- `archives-*`

Recommended naming style for future global article components:

- `.mus-callout`
- `.mus-callout__title`
- `.mus-image-block`
- `.mus-image-block__caption`

Do not add those classes yet unless the component is actually implemented globally.

## 10. Math and symbols

- Set `math: true` in front matter when LaTeX or MathJax is needed.
- Keep equations readable and deliberate.
- Prefer standard LaTeX notation rather than unusual copied glyphs when a formula will be rendered by MathJax.
- If you are writing symbols directly in text, verify the file remains UTF-8.
- Re-check characters such as:
  - `→`
  - `≤`
  - `≥`
  - `≈`
  - `×`
  - `∑`
  - `α`, `β`, `λ`
  - Indonesian quotation and punctuation marks

Inline math example:

```md
Nilai entropi dapat ditulis sebagai $S = k \log W$.
```

Display math example:

```md
$$
S = k \log W
$$
```

If copied symbols look corrupted after save, assume encoding is wrong first.

## 11. Ready-to-copy templates

### New musnotes article template

```md
---
title: "Judul Catatan"
date: 2026-05-15T22:00:00+07:00
draft: true
math: false
type: "garden-note"
cover:
  image: "/images/sebelum-kesepian-didefinisikan.png"
  hiddenInList: true
  hiddenInSingle: true
summary: "Ringkasan singkat catatan."
categories: ["Biology"]
tags: ["tag-1", "tag-2"]
---

Pembuka singkat.

{{< mus-divider >}}

## Subjudul

Isi catatan.
```

### New Silva Nigra article template

```md
---
title: "Judul Catatan Silva Nigra"
date: 2026-05-15T22:00:00+07:00
draft: true
math: false
type: "garden-note"
cover:
  image: "/images/sebelum-kesepian-didefinisikan.png"
  hiddenInList: true
  hiddenInSingle: true
summary: "Ringkasan singkat."
categories: ["Philosophy"]
tags: ["identity", "memory"]
---

Pembuka reflektif.

{{< mus-divider >}}

## Subjudul

Isi tulisan.
```

### New Silva Nigra fragment template

```md
---
title: "Judul Fragmen"
date: 2026-05-15T22:00:00+07:00
draft: true
type: garden-fragment
cover:
  image: "/images/sebelum-kesepian-didefinisikan.png"
  hiddenInList: true
  hiddenInSingle: true
summary: "Jejak pemikiran singkat."
tags: ["music", "consciousness"]
---

Fragmen pembuka.

{{< mus-divider >}}

Lanjutan fragmen.
```

### Reusable flow chart snippet

```html
<div class="flow-container">
  <div class="flow-wrapper">
    <div class="flow-node node-sage">
      <span class="node-icon">🌱</span>
      <span class="node-label">Awal</span>
    </div>
    <div class="flow-arrow arrow-sage"></div>
    <div class="flow-node node-orchid">
      <span class="node-icon">🔄</span>
      <span class="node-label">Transisi</span>
    </div>
    <div class="flow-arrow arrow-orchid"></div>
    <div class="flow-node node-blue">
      <span class="node-icon">⚡</span>
      <span class="node-label">Fungsi</span>
    </div>
  </div>
</div>
```

### Reusable table snippet

```html
<div class="table-wrapper">
  <table>
    <thead>
      <tr>
        <th>Istilah</th>
        <th>Makna</th>
        <th>Contoh</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>≈</code></td>
        <td>Hampir sama</td>
        <td><code>sin(0.01) ≈ 0.01</code></td>
      </tr>
      <tr>
        <td><code>≤</code></td>
        <td>Lebih kecil atau sama dengan</td>
        <td><code>x ≤ y</code></td>
      </tr>
    </tbody>
  </table>
</div>
```

### Reusable note or callout snippet

There is no dedicated callout class yet. Use a blockquote:

```md
> Catatan: pakai pola visual yang sudah ada sebelum membuat kelas baru.
```

## 12. Instructions for future AI/Codex edits

- Do not create new one-off classes unless explicitly requested.
- Reuse the documented classes in this guide.
- If adding a new reusable class, update this guide in the same change.
- Preserve UTF-8 encoding.
- Do not replace `{{< mus-divider >}}` with `---`.
- Do not change visual systems globally unless explicitly requested.
- Do not copy older article-local inline CSS patterns into new content.
- Prefer the global flow system for diagrams.
- Prefer `table-wrapper` for styled tables.
- Use blockquotes instead of inventing an undocumented callout component.
- Keep Hugo build passing.

## 13. Current reusable classes summary

Article-safe reusable classes currently documented here:

- `mus-divider`
- `flow-container`
- `flow-wrapper`
- `flow-wrapper--start`
- `flow-wrapper--end`
- `flow-wrapper--spaced`
- `flow-node`
- `flow-node--alert`
- `node-sage`
- `node-orchid`
- `node-blue`
- `node-icon`
- `node-label`
- `flow-arrow`
- `arrow-sage`
- `arrow-orchid`
- `arrow-blue`
- `flow-stack`
- `flow-stack__focus`
- `flow-stack__axis`
- `mus-flow-tree`
- `mus-flow-root`
- `mus-flow-branches`
- `mus-flow-branch`
- `mus-flow-node`
- `mus-flow-label`
- `mus-flow-note`
- `table-wrapper`

Reserved layout-level classes that should not be used inside article bodies:

- `musnotes-index*`
- `silva-archive*`
- `silva-chamber*`
- `silva-fragment*`
- `archives-register*`
