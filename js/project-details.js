document.addEventListener("DOMContentLoaded", () => {
  const contentContainer = document.getElementById("project-content");

  if (!contentContainer) {
    console.error("Content container not found!");
    return;
  }

  // Update loading message to show script is active
  contentContainer.innerHTML =
    '<div class="loading">Завантаження даних...</div>';

  // Get project slug from URL
  const urlParams = new URLSearchParams(window.location.search);
  const projectSlug = urlParams.get("project");

  if (!projectSlug) {
    renderNotFound("Проект не вказано у посиланні.");
    return;
  }

  // Try different paths for projects.json to ensure compatibility with local servers
  const jsonPaths = ["./js/projects.json", "js/projects.json"];

  // Lightbox
  let currentIndex = 0;
  let images = [];

  window.openLightbox = function (img) {
    images = Array.from(
      document.querySelectorAll(".hero-image-container img, .gallery-item img"),
    );
    currentIndex = images.indexOf(img);

    showSlide(currentIndex);
    document.getElementById("lightbox").style.display = "flex";
  };

  window.closeLightbox = function () {
    document.getElementById("lightbox").style.display = "none";
  };

  function showSlide(index) {
    const lightboxImg = document.getElementById("lightbox-img");

    if (index >= images.length) currentIndex = 0;
    else if (index < 0) currentIndex = images.length - 1;
    else currentIndex = index;

    if (images[currentIndex]) {
      lightboxImg.src = images[currentIndex].src;
    }
  }

  window.changeSlide = function (n) {
    currentIndex += n;
    showSlide(currentIndex);
  };

  // Keyboard navigation
  document.addEventListener("keydown", (event) => {
    const lightbox = document.getElementById("lightbox");
    if (lightbox && lightbox.style.display === "flex") {
      if (event.key === "ArrowLeft") {
        window.changeSlide(-1);
      } else if (event.key === "ArrowRight") {
        window.changeSlide(1);
      } else if (event.key === "Escape") {
        window.closeLightbox();
      }
    }
  });

  async function loadProject() {
    let lastError = null;
    console.log("Завантаження проекту:", projectSlug);

    for (const path of jsonPaths) {
      try {
        console.log("Спроба завантаження з:", path);
        const response = await fetch(path + "?v=" + new Date().getTime());
        if (!response.ok) {
          throw new Error(`Статус: ${response.status}`);
        }
        const projectsData = await response.json();
        console.log("Дані отримано:", projectsData.length, "проектів");

        const project = projectsData.find(
          (p) => p.slug.trim() === projectSlug.trim(),
        );

        if (project) {
          console.log("Проект знайдено:", project.title);
          renderProjectDetails(project);
          return; // Success!
        } else {
          console.warn("Проект не знайдено за slug:", projectSlug);
          renderNotFound(`Проект із посиланням "${projectSlug}" не знайдено.`);
          return;
        }
      } catch (error) {
        console.warn(`Не вдалося завантажити з ${path}:`, error);
        lastError = error;
      }
    }

    // If we reach here, all paths failed
    console.error("Помилка завантаження:", lastError);
    renderNotFound(
      `Помилка завантаження даних для проекту "${projectSlug}". Помилка: ${lastError ? lastError.message : "невідома"}`,
    );
  }

  function renderProjectDetails(project) {
    // Build gallery HTML
    const galleryHtml = project.gallery
      .map(
        (imgSrc) => `
            <div class="gallery-item" data-aos="fade-up">
                <img src="${imgSrc}" alt="${project.title}" onclick="openLightbox(this)">
            </div>
        `,
      )
      .join("");

    // Build details list
    const detailsHtml = project.details
      .map((detail) => `<li>${detail}</li>`)
      .join("");

    // Render content
    contentContainer.innerHTML = `
            <div class="project-hero" data-aos="fade-in">
                <div class="hero-image-container">
                    <img src="${project.image}" alt="${project.title}" onclick="openLightbox(this)" style="cursor: pointer;">
                    <div class="hero-overlay"></div>
                </div>
                
                <div class="hero-bottom-left">
                    <div class="back-link">
                        <a href="projects.html">
                            <svg class="arrow-back" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M5 12h14M12 5l7 7-7 7"/>
                            </svg>
                            Назад до проектів
                        </a>
                    </div>
                    <h1 class="hero-title">${project.title}</h1>
                </div>

                <div class="hero-bottom-right">
                    <div class="hero-category-label">Категорія</div>
                    <div class="hero-category-name">${project.categoryName}</div>
                </div>
            </div>

            <div class="container project-details-content">
                <div class="project-info-grid">
                    <div class="project-description" data-aos="fade-right">
                        <h2>Про проект</h2>
                        <p>${project.description}</p>
                    </div>
                    <div class="project-specs" data-aos="fade-left">
                        <h2>Деталі</h2>
                        <ul>${detailsHtml}</ul>
                    </div>
                </div>

                <div class="project-gallery">
                    <h2>Галерея</h2>
                    <div class="gallery-grid">
                        ${galleryHtml}
                    </div>
                </div>
            </div>
        `;

    // Re-init AOS for dynamically added content
    if (window.AOS) {
      window.AOS.refresh();
    }
  }

  function renderNotFound(
    message = "Вибачте, але запитуваний проект не існує або був видалений.",
  ) {
    contentContainer.innerHTML = `
            <div class="error-message">
                <h2>Проект не знайдено</h2>
                <p>${message}</p>
                <a href="projects.html" class="btn">Повернутися до проектів</a>
            </div>
        `;
  }

  loadProject();
});
