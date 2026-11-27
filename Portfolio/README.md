# Avishek Mondal: portfolio

A static site: plain HTML, CSS and JavaScript, with no build step. Everything in
this folder is published as-is.

## Pages

| File | Address on the live site |
| --- | --- |
| `index.html` | `/` |
| `about.html` | `/about` |
| `projects.html` | `/projects` |
| `contact.html` | `/contact` |
| `404.html` | shown for any address that doesn't exist |

The header and footer are written out in each page, so a change to the menu or
footer has to be made in all of them.

## Styles and scripts

- `css/style.css`: shared styles (colours, header, buttons, project cards, footer).
- `css/pages/*.css`: styles used by one page only.
- `js/main.js`: shared behaviour (menu, scroll effects, project filters and pop-up).
- `js/pages/home.js`, `js/pages/contact.js`: home page animations and the contact form.

## Adding or editing a project

Projects live in `projects.html` as `<article class="card">` blocks. To add one,
copy an existing block and change:

- `id`: a short unique name, e.g. `my-project`.
- `data-cat`: the category. It becomes a filter button automatically.
- `data-flow`: the workflow steps, separated by `|`. Leave the attribute out if there are none.
- `data-full`: the large image shown in the pop-up.
- `data-demo`: optional link to a demo video.
- the image, title, description, tags and GitHub link inside the block.

Then update the places that mention the number of projects: the description
and intro text and the `numberOfItems` list in `projects.html`, and the
"Explore all … projects" button in `index.html`. The four cards on the home
page are separate copies; edit them in `index.html` if you want different
projects featured there.

## Images

Images are grouped by the page that uses them, inside `assets/images/`:

- `home/`: the photo in the home page header.
- `about/`: the lab photo and the event photos.
- `projects/<project id>/`: one folder per project, named after the card's
  `id` in `projects.html`. Each holds `cover.webp` (1200 px wide) and
  `cover-800.webp`, a smaller copy that phones and small cards load instead.
  Extra screenshots for a project go in the same folder.
- The favicon, phone icon and link-preview image sit directly in
  `assets/images/` because every page uses them.

Folder and file names are lowercase with hyphens, e.g. `it-support-agent`.

If you add a project image without a smaller copy, point `src` at the one file
and delete the `srcset` attribute.

`assets/images/originals/` holds full-size source files. It stays on your
computer only and is not uploaded.

## Search engines

- `sitemap.xml` lists the four pages. Update the `lastmod` dates after a
  meaningful content change, and add a line if you add a page.
- `robots.txt` points search engines to the sitemap.
- Each page has its own title, description, canonical address and link-preview
  tags near the top of the file.

## Hosting

`wrangler.jsonc` publishes this folder on Cloudflare. `_headers` sets caching
and security headers.
