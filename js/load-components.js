/**
 * Скрипт для динамічного завантаження повторюваних компонентів (хедер, футер)
 */
document.addEventListener("DOMContentLoaded", () => {
  const loadComponent = async (placeholderId, filePath) => {
    const placeholder = document.getElementById(placeholderId);
    if (!placeholder) return;

    try {
      const response = await fetch(filePath + "?v=" + new Date().getTime());
      if (!response.ok) throw new Error(`Не вдалося завантажити ${filePath}`);
      const html = await response.text();
      placeholder.innerHTML = html;
      return true;
    } catch (error) {
      console.error("Помилка завантаження компонента:", error);
      return false;
    }
  };

  Promise.all([
    loadComponent("header-placeholder", "components/header.html"),
    loadComponent("footer-placeholder", "components/footer.html"),
  ]).then(() => {
    // Після того, як компоненти завантажені, ініціалізуємо логіку, яка від них залежить
    console.log("Компоненти завантажені");

    // Ініціалізуємо підсвічування активних посилань
    initActiveLinks();
    initBurgerMenu();

    // Оновлюємо AOS, якщо він підключений
    if (window.AOS) {
      window.AOS.refresh();
    }

    // Викликаємо подію, щоб інші скрипти знали, що DOM оновився
    document.dispatchEvent(new CustomEvent("componentsLoaded"));
  });

  function initActiveLinks() {
    const navLinks = document.querySelectorAll(
      ".burger-menu a, .footer-pages-links a",
    );
    const currentPath = window.location.pathname;
    const currentPage = currentPath.split("/").pop() || "index.html";

    navLinks.forEach((link) => {
      const linkHref = link.getAttribute("href");
      if (!linkHref) return;

      const linkPage = linkHref.split("/").pop();

      // Точний збіг
      if (linkPage === currentPage) {
        link.classList.add("active");
      }
      // Спеціальний випадок для сторінки деталей проекту
      else if (
        currentPage === "project-details.html" &&
        linkPage === "projects.html"
      ) {
        link.classList.add("active");
      }
    });
  }

  function initBurgerMenu() {
    const toggleBtn = document.querySelector(".burger-toggle");
    const panel = document.querySelector(".burger-menu-panel");
    const overlay = document.querySelector(".menu-overlay");
    const closeBtn = document.querySelector(".burger-menu-close");
    if (!toggleBtn || !panel || !overlay || !closeBtn) return;

    const closeMenu = () => {
      document.body.classList.remove("menu-open");
      panel.classList.remove("open");
      overlay.classList.remove("open");
      toggleBtn.setAttribute("aria-expanded", "false");
      panel.setAttribute("aria-hidden", "true");
      overlay.setAttribute("aria-hidden", "true");
    };

    const openMenu = () => {
      document.body.classList.add("menu-open");
      panel.classList.add("open");
      overlay.classList.add("open");
      toggleBtn.setAttribute("aria-expanded", "true");
      panel.setAttribute("aria-hidden", "false");
      overlay.setAttribute("aria-hidden", "false");
    };

    toggleBtn.addEventListener("click", () => {
      if (panel.classList.contains("open")) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    overlay.addEventListener("click", () => {
      closeMenu();
    });

    closeBtn.addEventListener("click", () => {
      closeMenu();
    });
  }
});
