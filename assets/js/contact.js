'use strict';

// Enable form button when all inputs are valid
const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll(".form-input");
const formBtn = document.querySelector("[data-form-btn]");

formInputs.forEach(input => {
  input.addEventListener("input", () => {
    if (form.checkValidity()) {
      formBtn.removeAttribute("disabled");
    } else {
      formBtn.setAttribute("disabled", "");
    }
  });
});

// Email sending function
function sendEmail(event) {
  event.preventDefault(); // Prevent form from submitting normally

  const params = {
    name: document.getElementById("fullname").value,
    email: document.getElementById("email").value,
    message: document.getElementById("message").value
  };

  // Replace with your actual EmailJS service and template IDs
  const serviceID = "service_7ucwc0a";
  const templateID = "template_7djsaef";

  emailjs.send(serviceID, templateID, params)
    .then(() => {
      alert("Message sent successfully!");
      form.reset();
      formBtn.setAttribute("disabled", ""); // Disable again
    })
    .catch(err => {
      console.error("Email sending failed:", err);
      alert("Failed to send message. Please try again.");
    });
}
