# Avishek Mondal: portfolio

Personal portfolio of Avishek Mondal, AI engineer working across agentic AI,
RAG, computer vision and embedded robotics.

**Live site:** https://amondal-dev.in

## What's here

`Portfolio/` is the published site: plain HTML, CSS and JavaScript, with no
build step. See [Portfolio/README.md](Portfolio/README.md) for the page layout
and how to add a project.

## Running it locally

The site is static, so any web server pointed at the `Portfolio/` folder works:

```
python -m http.server 8123 --directory Portfolio
```

Then open http://localhost:8123.

## Hosting

Cloudflare publishes the `Portfolio/` folder on every push to `main`
(configured in `Portfolio/wrangler.jsonc`).

## License

See [LICENSE](LICENSE).
