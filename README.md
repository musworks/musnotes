# MuS Digital Garden

Personal digital garden and blog built with [Hugo](https://gohugo.io/) and the [PaperMod](https://github.com/adityatelange/hugo-PaperMod) theme.

The site is bilingual (`id` and `en`) and includes notes, essays, library entries, and project pages.

## Stack

- Hugo Extended
- PaperMod theme as a Git submodule
- GitHub Pages deployment via GitHub Actions

## Local development

Clone the repository with submodules:

```powershell
git clone --recurse-submodules https://github.com/musworks/musnotes.git
cd musnotes
```

If you already cloned it without submodules:

```powershell
git submodule update --init --recursive
```

Run the local development server:

```powershell
hugo server -D
```

Build the production output:

```powershell
hugo --minify --cleanDestinationDir
```

## Project structure

- `content/` main site content
- `layouts/` template overrides
- `assets/` source assets
- `static/` static public files
- `themes/PaperMod/` theme submodule
- `hugo.toml` main Hugo configuration
- `.github/workflows/hugo.yml` GitHub Pages deployment workflow

## Content areas

- `content/digital-garden/` notes and garden entries
- `content/library/` reading notes and library pages
- `content/projects/` project pages
- `content/archives/` archive landing pages

## Deployment

Pushes to `main` trigger the GitHub Actions workflow in `.github/workflows/hugo.yml`, which builds the site and deploys the generated `public/` directory to GitHub Pages.

## License

Code in this repository is available under the MIT License. See `LICENSE`.

Original written content, images, and other site materials are licensed under CC BY-NC-ND 4.0 unless stated otherwise. See `CONTENT-LICENSE.md`.

Third-party components keep their own licenses, especially `themes/PaperMod/`.

## Notes

- `.hugo_build.lock` is ignored and should not be committed.
- Temporary local build folders are also ignored through `.gitignore`.
