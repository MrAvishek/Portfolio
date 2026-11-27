(() => {
  "use strict";

  const menuToggle = document.querySelector(".menu-toggle");
  const navigation = document.querySelector(".primary-nav");
  const navLinks = [...document.querySelectorAll(".nav-link")];
  const filterButtons = [...document.querySelectorAll(".filter-button")];
  const featuredProjects = [...document.querySelectorAll(".project-card[data-category]")];
  const compactProjects = [...document.querySelectorAll(".compact-project[data-category]")];
  const contactLinks = document.getElementById("contact-links");
  const currentYear = document.getElementById("current-year");

  if (currentYear) currentYear.textContent = String(new Date().getFullYear());

  // Mobile navigation: close after a selection and keep the expanded state accessible.
  if (menuToggle && navigation) {
    menuToggle.addEventListener("click", () => {
      const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
      menuToggle.setAttribute("aria-expanded", String(!isOpen));
      menuToggle.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
      navigation.classList.toggle("is-open", !isOpen);
    });

    navigation.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation");
        navigation.classList.remove("is-open");
      });
    });
  }

  // Project filters update both the featured cards and the compact project list.
  function applyFilter(filter) {
    [...featuredProjects, ...compactProjects].forEach((project) => {
      const matches = filter === "all" || project.dataset.category === filter;
      project.classList.toggle("is-hidden", !matches);
    });

    filterButtons.forEach((button) => {
      const selected = button.dataset.filter === filter;
      button.classList.toggle("is-selected", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
  }

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => applyFilter(button.dataset.filter || "all"));
  });

  // Populate optional contact methods from js/config.js; no dummy address is published.
  const config = window.PORTFOLIO_CONFIG || {};
  if (contactLinks) {
    const optionalLinks = [];
    if (typeof config.email === "string" && config.email.trim()) {
      optionalLinks.push({ label: "Email me", href: `mailto:${config.email.trim()}`, external: false });
    }
    if (typeof config.linkedin === "string" && /^https:\/\//i.test(config.linkedin.trim())) {
      optionalLinks.push({ label: "LinkedIn", href: config.linkedin.trim(), external: true });
    }

    optionalLinks.forEach(({ label, href, external }) => {
      const link = document.createElement("a");
      link.className = "button button-light";
      link.href = href;
      link.textContent = label;
      if (external) {
        link.target = "_blank";
        link.rel = "noopener noreferrer";
      }
      contactLinks.appendChild(link);
    });
  }

  // Reveal content as it enters the viewport. Reduced-motion users see content immediately.
  const revealItems = document.querySelectorAll("[data-reveal]");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  } else {
    const observer = new IntersectionObserver((entries, activeObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          activeObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -35px 0px" });

    revealItems.forEach((item) => observer.observe(item));
  }

  // Highlight the current section in the header while scrolling.
  const sections = [...document.querySelectorAll("main section[id]")];
  if ("IntersectionObserver" in window && sections.length) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => {
          const active = link.getAttribute("href") === `#${entry.target.id}`;
          link.classList.toggle("is-active", active);
        });
      });
    }, { rootMargin: "-35% 0px -55% 0px" });
    sections.forEach((section) => sectionObserver.observe(section));
  }
})();
