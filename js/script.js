// Global script with common logic
document.addEventListener("DOMContentLoaded", () => {
  // Swiper JS on about page - only init if element exists

  const servicesSlider = document.querySelector(".services-slider");
  if (servicesSlider && typeof Swiper !== "undefined") {
    new Swiper(".services-slider", {
      slidesPerView: 1,
      spaceBetween: 30,
      loop: true,
      centeredSlides: true,
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
      breakpoints: {
        640: {
          slidesPerView: 2,
          spaceBetween: 20,
        },
        1024: {
          slidesPerView: 3,
          spaceBetween: 30,
        },
      },
    });
  }

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
});
