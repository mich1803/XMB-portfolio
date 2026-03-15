# XMB Portfolio Template

A PS3-style XMB-inspired portfolio site built with vanilla HTML/CSS/JS.

## Open-source usage

You are free to fork, modify, and use this project as your own academic/professional portfolio.

If you publish a derivative, please give a quick credit/shout out to:
- [mich1803](https://github.com/mich1803) (me)
- [menonparik/xmb-on-web](https://github.com/menonparik/xmb-on-web).

---

## Personalization tutorial

### 1) Clone and run locally

```bash
git clone https://github.com/mich1803/XMB-portfolio.git
cd XMB-portfolio
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

> Important: use a local server (like `python3 -m http.server`). The app loads content from `data/portfolio.json`, and most browsers block `fetch` when opening `index.html` directly as a file.

### 2) Edit your portfolio content in one file

All menu/section content is now driven by:

- `data/portfolio.json`

You usually **do not need to edit `index.html`** anymore.

### 3) JSON structure overview

Top level:

```json
{
  "sections": []
}
```

Each section supports:

- `id`: unique section key (used as `data-section` in DOM)
- `title`: top label
- `icon`: path to section icon
- `iconClass`: optional icon class (`home`, `settings`, `messages`, ...)
- `active`: optional boolean (first active section)
- `items`: array of submenu cards

Each item supports:

- `title`: item title
- `image`: path to item icon/image
- `imageClass`: optional image class (`abimg`, `resimg`, `sysimg`, ...)
- `subtext`: optional line 1
- `subtext2`: optional line 2
- `enterUrl`: optional URL opened by Enter/click
- `link`: optional inline link object:
  - `href`
  - `text`

### 4) Rename or reorder columns

In `data/portfolio.json`, edit/reorder objects inside `sections`.

- Rename: change section `title`
- Reorder: move section objects up/down
- Change icon: edit `icon`

### 5) Add a new column/section

1. Duplicate a section object in `sections`.
2. Give it a new `id`.
3. Update `title`, `icon`, and `items`.

The UI/navigation is generated automatically from JSON, so no JS offset table update is required.

### 6) Add/edit submenu entries

Inside a section’s `items` array, add objects with `title`, `image`, and optional `subtext`/`subtext2`.

For clickable entries:

- use `enterUrl` for card-level open behavior
- or use `link` to render a clickable anchor

### 7) Optional style tuning

- Main stylesheet: `scss/main.css`
- Source modules: `scss/` folder

If you introduce brand-new section IDs and want special spacing per section, you can add targeted CSS rules using:

```css
.xmb-main > .xmb-title.xmb-column[data-section="your-id"] { ... }
```

### 8) Deploy on GitHub Pages

1. Push your repo to GitHub.
2. Go to **Settings → Pages**.
3. Under **Build and deployment**, set:
   - Source: **Deploy from a branch**
   - Branch: **main** (or your default) and `/ (root)`
4. Save and wait for deployment.
5. Your site will be available at:
   `https://<your-username>.github.io/<repo-name>/`

---

## Acknowledgments

- Original inspiration and base implementation: [menonparik/xmb-on-web](https://github.com/menonparik/xmb-on-web).
- Huge shout out to **@menonparik** for the original project.

## Copyright and trademark note (Sony / PS3 / XMB)

This repository is an unofficial recreation inspired by the visual style of Sony's PS3 XMB interface.

- "PlayStation", "PS3", and "XMB" are trademarks/copyrighted properties of Sony Interactive Entertainment and related entities.
- This project is a fan-made, educational/portfolio-oriented interface clone.
- It is not affiliated with, endorsed by, or sponsored by Sony.
