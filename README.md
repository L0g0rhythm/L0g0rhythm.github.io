<div align="center">

# L0g0rhythm — Personal Systems Interface

[![GitHub Pages](https://img.shields.io/github/deployments/l0g0rhythm/l0g0rhythm.github.io/github-pages?label=Deploy&logo=github)](https://l0g0rhythm.com.br/)
[![Live](https://img.shields.io/badge/Live-l0g0rhythm.com.br-9d4edd?logo=googlechrome&logoColor=white)](https://l0g0rhythm.com.br/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

High-performance personal portfolio built as a **Single-Page Application** with vanilla HTML, CSS, and JavaScript.  
Glassmorphism UI · Command Palette · Dual-Language · PWA-Ready · Zero Dependencies.

</div>

---

## Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Customization](#customization)
- [Performance](#performance)
- [License](#license)
- [Contact](#contact)

---

## Features

| Category | Details |
|----------|---------|
| **SPA Navigation** | Section-based routing with smooth transitions, keyboard arrows, and swipe gestures |
| **Command Palette** | `Ctrl+K` opens a VS Code-style command palette for navigation, themes, and system actions |
| **Dual Language** | Real-time PT/EN switching with full i18n dictionary |
| **5 Color Themes** | Void Purple, Cyber Blue, Hacker Green, Crimson Warning, Royal Gold |
| **Glassmorphism UI** | Frosted glass panels, 3D tilt effects, particle trails, magnetic hover |
| **Matrix Mode** | Konami code (↑↑↓↓←→←→BA) activates a Matrix rain overlay |
| **Audio System** | Synthesized hover/click sounds with Web Audio API |
| **PWA Support** | Service Worker with Network-First caching, installable on mobile |
| **HiDPI Canvas** | Particle and Matrix effects respect `devicePixelRatio` for Retina displays |
| **Accessibility** | `prefers-reduced-motion` respected, print mode, low-power mode, `<noscript>` fallback |
| **SEO** | JSON-LD structured data, Open Graph, semantic HTML, sitemap.xml |
| **Security** | Strict CSP (no `unsafe-inline` in `script-src`), `noopener noreferrer`, XSS-safe DOM construction |

---

## Architecture

The codebase follows **maximum modularity** — each file has a single responsibility.

```
main.js (Bootstrap ~100L)
├── core/           14 modules (navigation, i18n, themes, audio, input, ...)
├── components/
│   ├── render/     8 modules (profile, about, services, projects, ...)
│   └── effects     7 modules (particles, matrix, tilt, magnetic, ...)
└── pages/          1 module (404.js)
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Markup** | HTML5 (semantic, `<noscript>` fallback) |
| **Styling** | Vanilla CSS3 (variables, grid, flexbox, glassmorphism) |
| **Logic** | Vanilla JavaScript ES2022+ (ES Modules, async/await, Web Audio API) |
| **Fonts** | Google Fonts (Space Grotesk, Syncopate) |
| **Icons** | Font Awesome 6.7.2 (solid + brands subsets) |
| **Hosting** | GitHub Pages (custom domain: `l0g0rhythm.com.br`) |
| **Caching** | Service Worker (Network-First strategy) |

**Zero runtime dependencies.** No frameworks, no bundlers, no npm packages.

---

## Getting Started

```bash
git clone https://github.com/L0g0rhythm/L0g0rhythm.github.io.git
cd L0g0rhythm.github.io
npx serve .
```

Open `http://localhost:3000`. Push to `main` branch — GitHub Pages deploys automatically.

---

## Project Structure

```
L0g0rhythm.github.io/
├── index.html                          # Main SPA entry point
├── 404.html                            # Custom error page
├── manifest.json                       # PWA manifest
├── sw.js                               # Service Worker (Network-First)
├── robots.txt · sitemap.xml            # SEO
├── css/
│   ├── base/       variables · reset · base · typography
│   ├── layout/     structure · background
│   ├── components/ navbar · hero · glass · about · cards
│   │               footer · loader · cmd · context-menu
│   ├── utilities/  animations
│   ├── pages/      404
│   └── noscript · responsive · style (legacy)
├── js/
│   ├── main.js                         # Bootstrap (~100 lines)
│   ├── core/       appConfig · navigation · languageSwitcher
│   │               themeManager · footer · systemMonitor · toast
│   │               inputHandler · scrollObserver · audioSynth
│   │               audioUnlock · windowEvents · dataLoader · dictionary
│   ├── components/
│   │   ├── render/ renderConfig · profile · profileImage · about
│   │   │           services · projects · socialLinks · typewriter
│   │   └──         cmd · contextMenu · particles · matrix
│   │               tilt · hackerText · magnetic
│   └── pages/  404.js
├── data/           profile · about · services · projects
│                   socials · tools · schema (JSON-LD)
└── images/         profile.webp · favicons · PWA icons
```

---

## Customization

| What | Where |
|------|-------|
| Profile data | `data/profile.json` |
| About text | `data/about.json` (PT and EN) |
| Services | `data/services.json` |
| Projects | `data/projects.json` |
| Social links | `data/socials.json` |
| Colors/Fonts | `css/base/variables.css` |
| Translations | `js/core/dictionary.js` |
| SEO schema | `data/schema.json` |

---

## Performance

- **Critical CSS** loaded sync; non-critical deferred via `media="print"` trick
- **Font Awesome subsets** — only `solid` + `brands` (saves ~17KB vs `all.min.css`)
- **Zero render-blocking JS** — all loaded as ES Modules (`type="module"`)
- **O(1) particle removal** — swap-and-pop instead of `Array.splice()`
- **HiDPI canvas** — `devicePixelRatio` for crisp Retina rendering
- **Network-First SW** — fast offline experience with background cache updates

---

## License

[MIT License](LICENSE)

---

## Contact

**Vernier** (L0g0rhythm) — [l0g0rhythm.com.br](https://l0g0rhythm.com.br/)
