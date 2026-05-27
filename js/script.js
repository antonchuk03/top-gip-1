// Global script with common logic
document.addEventListener("DOMContentLoaded", () => {
  // Swiper JS - only init if element exists
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
});
