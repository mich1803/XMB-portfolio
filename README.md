# XMB Portfolio Template

A PS3-style XMB-inspired portfolio site built with vanilla HTML/CSS/JS.

## Acknowledgments

- Original inspiration and base implementation: [menonparik/xmb-on-web](https://github.com/menonparik/xmb-on-web).
- Huge shout out to **@menonparik** for the original project and to **you** for adapting it into a personal portfolio.

## Copyright and trademark note (Sony / PS3 / XMB)

This repository is an unofficial recreation inspired by the visual style of Sony's PS3 XMB interface.

- "PlayStation", "PS3", and "XMB" are trademarks/copyrighted properties of Sony Interactive Entertainment and related entities.
- This project is a fan-made, educational/portfolio-oriented interface clone.
- It is not affiliated with, endorsed by, or sponsored by Sony.

## Open-source usage

You are free to fork, modify, and use this project as your own academic/professional portfolio.

If you publish a derivative, please give a quick credit/shout out to:
- mich1803 (me), and
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

### 2) Edit your portfolio sections

Main content lives in `index.html`.

Current top-level sections are:
- About
- Education
- Experience
- Research
- Side Projects
- Contacts

Each section has one or more `.submenu` blocks. Replace placeholder text with your own content.

### 3) Change About (photo + bio)

In the `About` section (`.xmb-title.homeMenu`):
- Replace title/subtext text.
- Swap image paths in `<img src="...">`.

### 4) Update Education slots

In the `Education` section (`.xmb-title.settings`), there are 3 placeholders:
- High School
- Bachelor's Degree
- Master's Degree

For each slot, fill in:
- Institution
- Degree
- Field of Study
- Description

### 5) Update Experience / Research / Side Projects

Each section includes one placeholder card. Replace with your own:
- Experience: `Title · Company`
- Research: `Title · Authors · Short Description · Keywords · DOI`
- Side Projects: `Title · Short Description · Keywords · Repository Link`

### 6) Update Contacts

In the `Contacts` section, replace text/links with your profiles:
- GitHub
- LinkedIn
- ORCID
- Google Scholar
- Instagram

### 7) Add a new section

1. Duplicate one `.xmb-title ...` block in `index.html`.
2. Change its icon/title/submenus.
3. In `js/script.js`, update the menu offset list in `moveMenu()` to include one more position for the new section.

### 8) Adjust styles

- Main styles are in `scss/main.css`.
- Tune spacing, font sizes, glow effects, and animation timings there.

### 9) Deploy on GitHub Pages

1. Push your repo to GitHub.
2. Go to **Settings → Pages**.
3. Under **Build and deployment**, set:
   - Source: **Deploy from a branch**
   - Branch: **main** (or your default) and `/ (root)`
4. Save and wait for deployment.
5. Your site will be available at:
   `https://<your-username>.github.io/<repo-name>/`

---

## Tech stack

- HTML
- CSS (compiled from SCSS structure)
- Vanilla JavaScript
