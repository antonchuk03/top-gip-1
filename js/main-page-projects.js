// Projects logic specifically for index.html (main page)

document.addEventListener("DOMContentLoaded", () => {
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
