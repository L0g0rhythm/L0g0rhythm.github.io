# Changelog

All notable changes to this project will be documented in this file.  
Format based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

---

## [2.0.0] — 2026-03-02

### Added
- **Maximum Modularity** — 20 new ES Modules (1 responsibility = 1 file)
- Command Palette (`Ctrl+K`) with navigation, themes, and system actions
- 5 color themes (Void Purple, Cyber Blue, Hacker Green, Crimson, Gold)
- Matrix mode via Konami code
- Web Audio synthesizer for hover/click feedback
- `prefers-reduced-motion` support, low-power mode, print mode
- JSON-LD structured data for SEO (`data/schema.json`)
- External `noscript.css` fallback
- LICENSE (MIT), CHANGELOG.md

### Changed
- `main.js` reduced from 594 → ~100 lines (pure bootstrap)
- `renderer.js` decomposed into 8 render modules
- Font Awesome: `all.min.css` → `fontawesome` + `solid` + `brands` subsets (−17KB unused)
- CSS: critical sync / non-critical deferred via `media="print"` trick
- Mobile nav links now have `href` attributes (SEO crawlable)
- Canvas elements use `devicePixelRatio` for HiDPI displays
- Tilt effect reads `--accent-primary` CSS variable (theme-aware)
- Particle removal optimized from `O(n)` splice to `O(1)` swap-and-pop
- All comments translated from pt-BR to English
- CSP hardened: `'unsafe-inline'` removed from `script-src`
- Copyright updated to 2026
- Service Worker cache: `v18-modular`
- Context menu separator: `<hr>` → `<li role="separator">` (valid HTML)
- Footer telemetry: contrast improved (WCAG AA)
- Command palette input: `aria-label` added

### Removed
- `js/components/renderer.js` (decomposed)
- Dead code: `audioManager.js`, `card-tilt.js`, `tabs.js`, `visualizer.js`
- All inline JavaScript and inline CSS from HTML files
- 60+ orphan CSS rules and duplicate keyframes
- `testededesempenhodosite.txt`

---

## [1.0.0] — 2025-11-24

### Added
- Initial release with SPA navigation
- Glassmorphism UI with dark theme
- PT/EN language support
- Custom 404 page
- Service Worker with offline caching
- GitHub Pages deployment
