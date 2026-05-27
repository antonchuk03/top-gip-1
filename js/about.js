document.addEventListener("DOMContentLoaded", function () {
  // Ініціалізація AOS
  AOS.init({
    duration: 1000,
    once: true,
    offset: 100,
  });

  // Swiper
  const swiper = new Swiper(".about-us-slider", {
    loop: true,
    slidesPerView: 1,
    spaceBetween: 20,
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
  });

  // Lightbox
  let currentIndex = 0;
  let images = [];

  window.openLightbox = function (img) {
    images = Array.from(document.querySelectorAll(".team-member img"));
    currentIndex = images.indexOf(img);

    showSlide(currentIndex);
    document.getElementById("lightbox").style.display = "flex"; // Використовуємо flex для центрування
  };

  window.closeLightbox = function () {
    document.getElementById("lightbox").style.display = "none";
  };

  function showSlide(index) {
    const lightboxImg = document.getElementById("lightbox-img");

    if (index >= images.length) currentIndex = 0;
    if (index < 0) currentIndex = images.length - 1;

    lightboxImg.src = images[currentIndex].src;
  }

  window.changeSlide = function (n) {
    currentIndex += n;
    showSlide(currentIndex);
  };

  // Додавання обробки клавіш клавіатури
  document.addEventListener("keydown", function (event) {
    const lightbox = document.getElementById("lightbox");
    // Перевіряємо, чи відкритий лайтбокс
    if (lightbox && lightbox.style.display === "flex") {
      if (event.key === "ArrowLeft") {
        // Стрілка вліво - попереднє фото
        window.changeSlide(-1);
      } else if (event.key === "ArrowRight") {
        // Стрілка вправо - наступне фото
        window.changeSlide(1);
      } else if (event.key === "Escape") {
        // Клавіша Esc - закрити лайтбокс
        window.closeLightbox();
      }
    }
  });
});
