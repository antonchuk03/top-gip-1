// Scroll-To-Top button
function initScrollToTop() {
  const btn = document.getElementById("scrollTopBtn");
  if (!btn) return;

  window.addEventListener("scroll", () => {
    if (window.scrollY > 400) {
      btn.classList.add("show"); // додаємо клас для плавної появи
    } else {
      btn.classList.remove("show"); // плавне зникнення
    }
  });

  btn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

// Ініціалізуємо відразу, якщо кнопка вже є, або чекаємо завантаження компонентів
if (document.getElementById("scrollTopBtn")) {
  initScrollToTop();
} else {
  document.addEventListener("componentsLoaded", initScrollToTop);
}
