# Musnotes Content Architecture

This document describes the content architecture that currently exists in the repository. It is a maintenance reference, not a migration plan. Existing content paths, front matter, taxonomy values, translation relationships, and graph behavior should be preserved unless a separate change explicitly approves otherwise.

## 1. Content architecture

### Homepage

The homepage is the public entry point. It renders the profile/introduction area and a recent-content feed. The feed is intentionally limited to published, non-hidden content from `content/digital-garden/silva-nigra/`; it is not a combined Musnotes/Silva Nigra feed. This is an editorial choice, not a limitation to be removed during routine maintenance.

The relevant composition is:

- `layouts/_default/list.html` — homepage list composition
- `layouts/partials/index_profile.html` — profile and introduction area
- `layouts/partials/home_feed.html` — Silva Nigra-only recent feed

### Digital Garden

`content/digital-garden/` is the umbrella for the two garden branches. Its custom section templates present Musnotes and Silva Nigra as related but distinct collections:

- `layouts/digital-garden/list.html`
- `layouts/partials/musnotes_index.html`
- `layouts/partials/silva_archive.html`

### Musnotes

`content/digital-garden/musnotes/` is primarily a raw, Indonesian-language collection of notes, explorations, and unfinished work. A note does not need an English counterpart. Its raw and exploratory editorial purpose is different from Silva Nigra's curated publication role.

### Silva Nigra

`content/digital-garden/silva-nigra/` is the curated publication branch. It follows a stronger bilingual publishing convention and contains longer reflective pieces and fragments, but exceptions and drafts are allowed. Shared subject matter with Musnotes does not make two files an active Hugo translation pair.

### Library

`content/library/` is a personal shelf of books and other resources. Library entries have their own detail/list presentation and use library-specific metadata such as singular `category`, `topics`, `status`, `author`, and `links`. Library entries are generally bilingual, but a particular entry may remain single-language.

### Projects

`content/projects/` contains project-oriented entries. Projects are generally bilingual, but individual entries may be single-language. Existing project files commonly use `type: garden-note`; this is a known content-model question for future review, not a reason to move or rewrite current entries.

### Archives and utility pages

`content/archives/` contains archive/register material. Search and other utility routes are represented by dedicated content/layout combinations rather than by garden notes. These pages support discovery and navigation and should not be treated as ordinary article content.

## 2. Bilingual publishing policy

Hugo's current language configuration is in `hugo.toml`:

- Indonesian (`id`) is the default language and uses no `/id/` URL prefix.
- English (`en`) uses the `/en/` URL prefix.
- The configured language values are `id-ID` and `en-US`.
- Hugo identifies language-specific files by filename suffix in the same content location.
- `file.en.md` and `file.id.md` are the explicit language-specific forms used for paired files.
- An unsuffixed Markdown file belongs to the default Indonesian language.

Hugo exposes relationships through its translation collections (for example, `.Translations` and `.AllTranslations`). The repository does not use `translationKey` as a universal content requirement. A shared editorial lineage, similar title, or similar filename is evidence to review, not proof that Hugo should treat two files as an active translation pair.

Branch expectations are intentionally different:

- Musnotes is not required to translate every note.
- Silva Nigra generally aims for bilingual publication, with exceptions for drafts, moved work, or editorially single-language pieces.
- Projects and Library are generally bilingual, but single-language entries are valid.

Draft status affects whether content is published and discoverable; it does not by itself create or remove a translation relationship. Content moved between branches can retain editorial lineage while no longer being in the same Hugo translation collection.

## 3. Confirmed cross-branch editorial lineage

These cases are documented for historical clarity. Do not move, rename, pair, or publish the files as part of documentation or routine content maintenance.

### Amina

- The Indonesian version moved to `content/digital-garden/musnotes/sonicexplorations/amina.id.md`.
- The English version remains at `content/digital-garden/silva-nigra/art-resonance/amina.en.md` and is drafted.
- Their editorial lineage is confirmed by the content history and matching subject metadata.
- They are not currently an active Hugo translation pair because they live in different branches/paths.

### Catatan Berbunyi

- The Indonesian version is `content/digital-garden/musnotes/sonicexplorations/catatan_berbunyi.id.md` and is drafted.
- The English version is `content/digital-garden/silva-nigra/art-resonance/catatan_berbunyi.en.md` and is drafted.
- Their editorial lineage is confirmed by the matching subject, date, category, and referenced work.
- They are not currently an active Hugo translation pair because they live in different branches/paths.

## 4. Taxonomy policy

### Categories

Categories are the structural taxonomy. The graph reads category terms and preserves post → category relationships. The Musnotes index also uses category data for presentation. Existing category values can represent subjects, editorial branches, formats, or media; that mixed historical use is part of the current data model.

The intended future naming target is English spelling, lowercase terms, and consistent hyphenated slugs where appropriate. This is a future normalization target only. It does not authorize changing existing category values, URLs, or front matter in this phase.

### Tags

Tags remain in front matter as internal metadata and can contribute to SEO-related output. They are not part of the primary article interface and are not represented in the graph:

- no tag nodes are generated;
- no post → tag edges are generated.

The public `/tags/` taxonomy route remains unchanged for now. Its future editorial status is a separate decision. The historical decision to hide tags from the graph and primary interface must be preserved; restoring tag graph relationships would be an architectural change requiring explicit justification.

### Topics

`topics` is Library-specific metadata. `layouts/partials/library_single.html` renders it as non-linked chips. It is not a global Hugo taxonomy, is not used for graph relationships, and should not become a site-wide topics taxonomy without a separate content-discovery decision.

## 5. Front matter conventions

The conventions below describe actual patterns and safe authoring guidance. “Recommended” does not mean every existing file already contains the field.

### Garden section pages

Typical files: `content/digital-garden/**/_index.md`.

Recommended:

- `title`
- `description`
- `weight` when ordering matters
- `type: garden-node`
- `layout: list` where the custom section list is intended

Optional/editorial:

- `summary`
- language-specific filename suffix

These fields are template-driven for section navigation and list rendering. They are not ordinary article metadata.

### Musnotes garden notes

Typical location: `content/digital-garden/musnotes/`.

Recommended baseline:

- `title`
- `date`
- `type: garden-note`

Common optional fields:

- `draft` as a boolean when explicitly provided
- `summary`
- plural `categories`
- `tags`
- `math`
- `cover`
- `aliases`

`summary`, `cover`, and taxonomy fields are used by list, metadata, SEO, or article templates depending on the page. Musnotes notes do not require an English file.

### Silva Nigra fragments and essays

Typical location: `content/digital-garden/silva-nigra/`.

Recommended baseline:

- `title`
- `date`
- `type: garden-fragment` for fragment-style work, or the existing garden-note type for note-like essays

Common optional fields:

- boolean `draft`
- `summary`
- plural `categories`
- `tags`
- `cover`
- `featured`
- `math`

The stronger bilingual convention is editorial guidance, not a requirement that every entry must have a counterpart.

### Library entries

Typical location: `content/library/`.

Common fields:

- `title`
- `author`
- `type`
- `status`
- singular `category`
- `description`

Optional/section-specific fields:

- `topics`
- `cover`
- `links`

Library `topics` are display metadata, not global taxonomy. Library covers may be scalar URLs, unlike the structured cover maps used by many garden articles. `description` is commonly the short resource note shown by Library templates.

### Projects

Typical location: `content/projects/`.

Existing entries commonly use `title`, `date`, boolean `draft`, `type: garden-note`, `summary`, `categories`, `tags`, `math`, and `cover`. The use of `garden-note` is template-compatible today but deserves a separate content-model review before any change is proposed.

### Utility pages

Search, archive, and other utility pages may use `title`, `layout`, `summary`, `description`, `placeholder`, `weight`, or output-related settings according to their dedicated templates. These are template-driven page schemas and should not be used as a baseline for article front matter.

### Field distinctions

- Garden content generally uses plural `categories`; Library entries use singular `category`.
- Garden covers may use structured maps such as `cover.image`; Library covers may use scalar public URLs.
- `summary` commonly supplies an article/list excerpt; `description` commonly supplies section or Library descriptive metadata. Templates may use one as a fallback for the other, but they are not interchangeable editorial concepts.
- `draft` should be boolean (`true` or `false`) when explicitly provided. Existing content is not yet perfectly consistent.

## 6. Graph architecture

The current graph is taxonomy-based and intentionally narrow:

- category nodes are generated;
- post → category edges are generated;
- tag nodes are not generated;
- post → tag edges are not generated;
- direct post → post relationships are not currently implemented;
- shared category relationships imply conceptual proximity only.

The graph implementation is in `layouts/graph/section.json.json`, with the interactive presentation in `assets/js/graph-view-v2.js` and related graph templates/styles. The absence of tag nodes and tag edges is intentional and must not be “fixed” by syncing the graph to the retained tag front matter.

## 7. Known maintenance notes

These are separate future cleanup or review items, not changes made by this document:

1. `draft: draft` in `content/digital-garden/silva-nigra/art-resonance/catatan_berbunyi.en.md` should eventually be corrected to a boolean.
2. Category values need future normalization; existing values and URLs remain unchanged until that work is approved.
3. The public `/tags/` route requires a separate editorial decision.
4. Projects currently use `type: garden-note`, which may deserve a separate content-model review.
5. Homepage profile fallback duplication in `layouts/partials/index_profile.html` can be consolidated separately without changing the Silva Nigra-only feed.

Any future implementation should first verify the affected content and templates, preserve the branch distinction, and validate that drafts, language URLs, taxonomy routes, and homepage selection remain unchanged unless explicitly in scope.
