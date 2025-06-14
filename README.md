# L0g0rhythm - Personal Profile Website

[![GitHub Pages Status](https://img.shields.io/github/deployments/l0g0rhythm/l0g0rhythm.github.io/github-pages?label=Site%20Status&logo=github)](https://l0g0rhythm.github.io/)
[![Live Site](https://img.shields.io/badge/Live_Site-l0g0rhythm.github.io-brightgreen?logo=google-chrome&logoColor=white)](https://l0g0rhythm.github.io/)

Source code for my personal profile website and digital card, hosted at [l0g0rhythm.github.io](https://l0g0rhythm.github.io/). Built with vanilla HTML, CSS, and JavaScript, featuring a Synthwave-inspired theme.


## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [File Structure](#file-structure)
- [Running Locally](#running-locally)
- [Customization](#customization)
- [Status](#status)
- [Contact](#contact)

## Features

* Themed profile card interface (Dark/Neon/Synthwave aesthetic).
* Tabbed navigation (About Me, Social Media, Projects).
* Dynamic project list loaded from external JSON (`data/projects.json`) via Fetch API.
* Horizontally scrolling project cards using CSS Flexbox.
* Modular CSS structure for better organization and maintenance.
* Use of CSS Variables for easy theming.
* Custom web fonts via Google Fonts ('Share Tech Mono' & 'Poppins').
* Conceptual Synthwave background effect with perspective grid and stars (CSS only).
* Custom styled 404 error page.
* Responsive design for various screen sizes.
* Accessibility enhancements (semantic HTML, focus indicators).
* SEO and Social Media meta tags (Open Graph, Twitter Cards).
* Direct links to social/professional profiles and email contact.

## Technologies Used

* **Frontend:** HTML5, CSS3, Vanilla JavaScript (ES6+)
* **CSS Features:** Flexbox, CSS Variables, Transitions, Gradients, Pseudo-elements, Media Queries
* **JavaScript Features:** DOM Manipulation, Fetch API, Async/Await
* **Libraries/Assets:** Font Awesome (Icons), Google Fonts
* **Hosting:** GitHub Pages

## File Structure

### The project uses a modular structure:

```bash
L0g0rhythm.github.io/
    index.html                      # Main profile page
    404.html                        # Custom error page
    README.md                       # This file
    data/
        projects.json               # Project data
    css/
        style.css                   # Main CSS file (imports modules)
        base.css                    # Base styles, variables, body, focus
        card.css                    # Profile card styles
        tabs.css                    # Tab layout and content styles
        buttons.css                 # Social button styles
        projects.css                # Project list/item styles
        404.css                     # 404 page specific styles
        responsive.css              # All @media query rules
        synthwave-background.css    # Background effect styles
    js/
        script.js                   # Tab logic and project loading
    images/
        profile.jpg                 # Profile picture
        screenshot/                 # Folder for screenshots                        
```


## Running Locally

Because this project uses the `Workspace` API in JavaScript to load project data from a local JSON file, you need to run it through a local web server to avoid potential browser security restrictions (CORS issues with `file:///` protocols).

A simple way is to use Python's built-in server:
1. Navigate to the project's root directory in your terminal.
2. Run the command: `python -m http.server` (or `python3 -m http.server` depending on your setup).
3. Open your browser and go to `http://localhost:8000` (or the port specified).

Alternatively, use extensions like "Live Server" for VS Code.


## Customization

* **Personal Info:** Update text content in `index.html` (About Me, Subtitle).
* **Projects:** Edit the `data/projects.json` file to add, remove, or modify project details.
* **Social Links:** Change URLs in the `<a>` tags within the `#social-content` div in `index.html`.
* **Theme/Colors:** Modify CSS variables in `css/base.css`.
* **Fonts:** Change imported fonts in `index.html`/`404.html` and update `--font-main`/`--font-headings` variables in `css/base.css`.
* **Background:** Tune parameters in `css/synthwave-background.css` or replace with an image background (adjusting `css/style.css` and `index.html` accordingly).


## Status

Project Status: **Active** - Core functionality complete, visual refinements ongoing.


## Contact

Victor Oliveira (L0g0rhythm) - Connect via the links on the profile site: [l0g0rhythm.github.io](https://l0g0rhythm.github.io/)