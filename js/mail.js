document.addEventListener("DOMContentLoaded", function () {
  const contactForm = document.getElementById("contactForm");
  if (!contactForm) return;

  contactForm.addEventListener("submit", function (e) {
    e.preventDefault(); // Забороняємо перезавантаження сторінки

    let formData = new FormData(this);

    fetch("send_mail.php", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.text())
      .then((data) => {
        if (data.trim() === "success") {
          alert("Message sent successfully!");
          this.reset(); // Очищаємо форму
        } else {
          alert("Error! Try again.");
        }
      })
      .catch((error) => alert("Connection error!"));
  });
});
