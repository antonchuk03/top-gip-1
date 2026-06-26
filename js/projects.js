document.addEventListener("DOMContentLoaded", () => {
  const projectsContainer = document.querySelector(".projects-page-grid");
  const filterButtons = document.querySelectorAll(".filter-btn");

  if (!projectsContainer) return;

  // Show loading state
  projectsContainer.innerHTML =
    '<div class="loading">Завантаження проектів...</div>';

  // Try different paths for projects.json to ensure compatibility with local servers
  const jsonPaths = ["./js/projects.json", "js/projects.json"];

  async function loadProjects() {
    let lastError = null;

    for (const path of jsonPaths) {
      try {
        console.log("Спроба завантаження проектів з:", path);
        const response = await fetch(path + "?v=" + new Date().getTime());
        if (!response.ok) {
          throw new Error(`Статус: ${response.status}`);
        }
        const projectsData = await response.json();

        // Initial render based on URL filter
        const urlParams = new URLSearchParams(window.location.search);
        const urlFilter = urlParams.get("filter") || "all";

        renderProjects(projectsData, urlFilter);
        updateActiveFilter(urlFilter);
        attachFilterEvents(projectsData);
        return; // Success!
      } catch (error) {
        console.warn(`Не вдалося завантажити з ${path}:`, error);
        lastError = error;
      }
    }

    // If we reach here, all paths failed
    projectsContainer.innerHTML = `<div class="error-message">Помилка завантаження проектів: ${lastError ? lastError.message : "невідома помилка"}. Спробуйте оновити сторінку.</div>`;
  }

  function renderProjects(projectsData, filter) {
    projectsContainer.innerHTML = "";

    const filteredProjects =
      filter === "all"
        ? projectsData
        : projectsData.filter((project) => project.categories.includes(filter));

    if (filteredProjects.length === 0) {
      projectsContainer.innerHTML =
        '<div class="no-projects">У цій категорії поки що немає проектів.</div>';
      return;
    }

    filteredProjects.forEach((project) => {
      const projectCard = document.createElement("a");
      projectCard.href = `project-details.html?project=${project.slug}`;
      projectCard.classList.add("project-card", "show");
      projectCard.style.textDecoration = "none";
      projectCard.setAttribute("data-aos", "fade-up");

      const displayCategoryName = project.categoryNames.join(", ");

      projectCard.innerHTML = `
                <img src="${project.image}" alt="${project.title}">
                <div class="project-card-overlay">
                    <div class="project-category">${displayCategoryName}</div>
                    <div class="project-title">${project.title}</div>
                </div>
            `;

      projectsContainer.appendChild(projectCard);
    });

    // Refresh AOS for new elements
    if (window.AOS) {
      window.AOS.refresh();
    }
  }

  function updateActiveFilter(filter) {
    filterButtons.forEach((btn) => {
      if (btn.getAttribute("data-filter") === filter) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });
  }

  function attachFilterEvents(projectsData) {
    filterButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const filterValue = btn.getAttribute("data-filter");
        updateActiveFilter(filterValue);
        renderProjects(projectsData, filterValue);

        // Update URL without reloading (optional, but good for UX)
        const newUrl = new URL(window.location);
        newUrl.searchParams.set("filter", filterValue);
        window.history.pushState({}, "", newUrl);
      });
    });
  }

  loadProjects();
});
