# Avishek Mondal — Portfolio

A responsive, static personal portfolio built with HTML, CSS and vanilla JavaScript. It is designed for direct deployment to Netlify.

## Preview locally

From this folder, run:

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000>.

## Personal details to update before publishing

1. Open `js/config.js` and add your real email and LinkedIn URL. Empty values are intentionally hidden from the page.
2. Confirm the Reboot Robotics Academy end date. The current page uses **30 July 2026**, matching the experience letter supplied for the portfolio.
3. Review project descriptions, repository visibility and project screenshots before publishing.
4. If you want a profile photo, add it under `assets/images/` and we can place it without changing the overall layout.

## Deploy to Netlify

- Push the contents of this folder to your GitHub repository.
- In Netlify, choose **Add new site → Import an existing project** and connect that repository.
- Set the base directory to the repository root. No build command or publish subdirectory is required for this static site.
- Deploy. Future pushes to the connected branch will trigger automatic deployments.

## Structure

```text
Portfolio/
├── index.html
├── assets/
│   └── icons/favicon.svg
├── css/
│   └── style.css
├── js/
│   ├── config.js
│   └── main.js
├── data/
├── docs/
└── README.md
```

The site uses Google Fonts when available and falls back to system fonts if they cannot be loaded. No framework, package installation or build step is required.
