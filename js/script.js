// Global script with common logic
document.addEventListener("DOMContentLoaded", () => {
  const numberEls = Array.from(document.querySelectorAll(".number-card h3"));
  if (numberEls.length) {
    const getParts = (text) => {
      const match = String(text)
        .trim()
        .match(/^(\d+)(.*)$/);
      if (!match) return null;
      return { target: Number(match[1]), suffix: match[2] || "" };
    };

    const animateTo = (el, target, suffix, durationMs = 3000) => {
      const start = performance.now();
      const step = (now) => {
        const t = Math.min((now - start) / durationMs, 1);
        const value = Math.floor(target * t);
        el.textContent = `${value}${suffix}`;
        if (t < 1) requestAnimationFrame(step);
        else el.textContent = `${target}${suffix}`;
      };
      requestAnimationFrame(step);
    };

    numberEls.forEach((el) => {
      const parts = getParts(el.textContent);
      if (!parts) return;
      el.dataset.target = String(parts.target);
      el.dataset.suffix = parts.suffix;
      el.textContent = `0${parts.suffix}`;
    });

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            if (el.dataset.animated === "0") return;
            const target = Number(el.dataset.target);
            const suffix = el.dataset.suffix || "";
            if (!Number.isFinite(target)) return;
            el.dataset.animated = "0";
            animateTo(el, target, suffix);
            observer.unobserve(el);
          });
        },
        { threshold: 0.6 },
      );

      numberEls.forEach((el) => {
        if (!el.dataset.target) return;
        observer.observe(el);
      });
    } else {
      numberEls.forEach((el) => {
        const target = Number(el.dataset.target);
        const suffix = el.dataset.suffix || "";
        if (!Number.isFinite(target)) return;
        animateTo(el, target, suffix);
      });
    }
  }

  const grid = document.querySelector(".projects-grid");
  if (!grid) return;

  // Touch handling
  grid.addEventListener("click", (e) => {
    const item = e.target.closest(".project-item");
    if (!item) {
      grid
        .querySelectorAll(".project-item.active")
        .forEach((i) => i.classList.remove("active"));
      return;
    }
    const isActive = item.classList.contains("active");
    grid
      .querySelectorAll(".project-item.active")
      .forEach((i) => i.classList.remove("active"));
    if (!isActive) {
      item.classList.add("active");
    } else {
      const category = item.getAttribute("data-category");
      if (category) {
        window.location.href = `projects.html?filter=${category}`;
      }
    }
  });

  // Desktop click / dblclick
  grid.querySelectorAll(".project-item").forEach((item) => {
    item.addEventListener("dblclick", () => {
      const category = item.getAttribute("data-category");
      if (category) {
        window.location.href = `projects.html?filter=${category}`;
      }
    });

    item.addEventListener("click", (e) => {
      if (window.matchMedia("(pointer: fine)").matches) {
        const category = item.getAttribute("data-category");
        if (category) {
          window.location.href = `projects.html?filter=${category}`;
        }
      }
    });
  });

  // Keyboard navigation
  grid.querySelectorAll(".project-item").forEach((item) => {
    item.addEventListener("focus", () => {
      grid
        .querySelectorAll(".project-item.active")
        .forEach((i) => i.classList.remove("active"));
      item.classList.add("active");
    });
  });

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".projects-grid")) {
      grid
        .querySelectorAll(".project-item.active")
        .forEach((i) => i.classList.remove("active"));
    }
  });
});
