/* Shared behaviour for every page. Loaded with `defer`.
   The header, footer and project cards are plain HTML; this file only adds
   interaction on top of them. */
(() => {
  "use strict";

  const $ = (sel, el = document) => el.querySelector(sel);
  const $$ = (sel, el = document) => [...el.querySelectorAll(sel)];
  const root = document.documentElement;
  const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = matchMedia("(pointer: fine)").matches;
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  /* ---------- Mobile menu ---------- */
  const burger = $("#burger");
  const menu = $("#menu");
  if (burger && menu) {
    const setOpen = open => {
      menu.classList.toggle("open", open);
      burger.setAttribute("aria-expanded", String(open));
    };
    burger.addEventListener("click", () => setOpen(!menu.classList.contains("open")));
    menu.addEventListener("click", e => { if (e.target.closest("a")) setOpen(false); });
    addEventListener("keydown", e => { if (e.key === "Escape") setOpen(false); });
  }

  /* ---------- Scroll progress bar and header state ---------- */
  const header = $(".site-header");
  const bar = document.createElement("div");
  bar.id = "bar";
  bar.setAttribute("aria-hidden", "true");
  document.body.append(bar);

  let scrollQueued = false;
  const onScroll = () => {
    scrollQueued = false;
    const max = Math.max(1, root.scrollHeight - innerHeight);
    bar.style.transform = `scaleX(${Math.min(1, scrollY / max)})`;
    if (header) header.classList.toggle("scrolled", scrollY > 8);
  };
  addEventListener("scroll", () => {
    if (!scrollQueued) { scrollQueued = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  onScroll();

  /* ---------- Scroll reveal ----------
     Elements with .rv fade up as they enter the viewport. Items that arrive
     together are staggered. The class is removed afterwards so it never
     interferes with hover transitions. */
  const revealItems = $$(".rv");
  if (still || !("IntersectionObserver" in window)) {
    revealItems.forEach(el => el.classList.add("in"));
  } else {
    const finish = el => { el.classList.remove("rv"); el.style.removeProperty("--d"); };
    const io = new IntersectionObserver(entries => {
      let i = 0;
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const el = entry.target;
        const delay = Math.min(i++, 6) * 80;
        el.style.setProperty("--d", delay + "ms");
        el.classList.add("in");
        io.unobserve(el);
        setTimeout(finish, delay + 1000, el);
      }
    }, { threshold: 0.1, rootMargin: "0px 0px -5% 0px" });
    revealItems.forEach(el => io.observe(el));
  }

  /* ---------- Pointer effects (mouse only) ---------- */
  if (fine) {
    // Highlight that follows the pointer inside cards and panels
    document.addEventListener("pointermove", e => {
      const el = e.target instanceof Element ? e.target.closest(".spot, .card") : null;
      if (!el) return;
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", e.clientX - r.left + "px");
      el.style.setProperty("--my", e.clientY - r.top + "px");
    }, { passive: true });

    // Soft glow behind the cursor
    if (!still) {
      const glow = document.createElement("div");
      glow.className = "glow";
      glow.setAttribute("aria-hidden", "true");
      document.body.prepend(glow);
      let gx = 0, gy = 0, glowQueued = false;
      addEventListener("pointermove", e => {
        gx = e.clientX; gy = e.clientY;
        if (glowQueued) return;
        glowQueued = true;
        requestAnimationFrame(() => {
          glowQueued = false;
          glow.style.transform = `translate3d(${gx}px,${gy}px,0)`;
        });
      }, { passive: true });
    }
  }

  /* ---------- Project cards: category filters and details dialog ---------- */
  const grid = $("#grid");
  if (grid) {
    const cards = $$(".card", grid);

    const filters = $("#filters");
    if (filters) {
      const cats = [...new Set(cards.map(c => c.dataset.cat))];
      const button = (label, count, on) =>
        `<button type="button" aria-pressed="${on}" data-cat="${esc(label)}">${esc(label)} <span>${count}</span></button>`;
      filters.innerHTML = button("All", cards.length, true) +
        cats.map(c => button(c, cards.filter(x => x.dataset.cat === c).length, false)).join("");

      filters.addEventListener("click", e => {
        const b = e.target.closest("button");
        if (!b || b.getAttribute("aria-pressed") === "true") return;
        const cat = b.dataset.cat;
        const apply = () => {
          $$("button", filters).forEach(x => x.setAttribute("aria-pressed", String(x === b)));
          cards.forEach(c => c.classList.toggle("hide", cat !== "All" && c.dataset.cat !== cat));
        };
        // Where supported, cards glide to their new places instead of jumping
        if (still || !document.startViewTransition) { apply(); return; }
        cards.forEach((c, i) => { c.style.viewTransitionName = "card-" + i; });
        root.classList.add("vt-filter");
        document.startViewTransition(apply).finished.finally(() => {
          cards.forEach(c => { c.style.viewTransitionName = ""; });
          root.classList.remove("vt-filter");
        });
      });
    }

    const dlg = $("#dlg");
    const body = $("#dbody");
    if (dlg && body) {
      const open = card => {
        const title = $(".card-open", card).textContent.trim();
        const cat = card.dataset.cat || "";
        const desc = $(".card-desc", card).textContent.trim();
        const img = $(".thumb", card);
        const full = card.dataset.full || (img && img.currentSrc) || "";
        const flow = (card.dataset.flow || "").split("|").filter(Boolean);
        const tags = $$(".tags li", card).map(li => li.textContent);
        const repo = $(".card-repo", card);
        const demo = card.dataset.demo;

        body.innerHTML =
          `<button class="d-close" type="button" data-close aria-label="Close">×</button>` +
          (full ? `<img class="d-img" src="${esc(full)}" alt="${esc(title)} project preview" width="1200" height="670">` : "") +
          `<div class="d-body">` +
            `<p class="card-cat">${esc(cat)}</p>` +
            `<h2>${esc(title)}</h2>` +
            `<p>${esc(desc)}</p>` +
            (flow.length ? `<ol class="flow" aria-label="Workflow">${flow.map(s => `<li><span>${esc(s)}</span></li>`).join("")}</ol>` : "") +
            `<ul class="tags">${tags.map(t => `<li>${esc(t)}</li>`).join("")}</ul>` +
            `<p class="d-actions">` +
              (repo ? `<a class="btn" href="${esc(repo.href)}" target="_blank" rel="noopener">View on GitHub <span class="arr" aria-hidden="true">→</span></a>` : "") +
              (demo ? `<a class="btn ghost" href="${esc(demo)}" target="_blank" rel="noopener">Watch demo</a>` : "") +
              `<button class="btn ghost" type="button" data-close>Close</button>` +
            `</p>` +
          `</div>`;
        dlg.style.setProperty("--c", getComputedStyle(card).getPropertyValue("--c"));
        dlg.showModal();
        dlg.scrollTop = 0;
      };

      grid.addEventListener("click", e => {
        if (e.target.closest(".card-repo")) return;
        const card = e.target.closest(".card");
        if (card) open(card);
      });
      dlg.addEventListener("click", e => {
        if (e.target === dlg || e.target.closest("[data-close]")) dlg.close();
      });
    }
  }

  /* ---------- Footer year ---------- */
  const year = $("#year");
  if (year) year.textContent = new Date().getFullYear();
})();
