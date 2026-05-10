/**
 * contact-form.js — Contact form handling with FormSubmit
 */
(function() {
  document.addEventListener('DOMContentLoaded', function() {
    var form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', function(e) {
      e.preventDefault();
      var btn = form.querySelector('.form-submit');
      var successMsg = form.querySelector('.form-success');
      var errorMsg = form.querySelector('.form-error');
      var replyToField = form.querySelector('[name="_replyto"]');

      var name = form.querySelector('[name="name"]').value.trim();
      var email = form.querySelector('[name="email"]').value.trim();
      var subject = form.querySelector('[name="subject"]').value.trim();
      var message = form.querySelector('[name="message"]').value.trim();

      if (!name || !email || !message) {
        showError(errorMsg, 'Please fill in all required fields.');
        return;
      }

      if (!isValidEmail(email)) {
        showError(errorMsg, 'Please enter a valid email address.');
        return;
      }

      if (replyToField) {
        replyToField.value = email;
      }

      if (successMsg) {
        successMsg.style.display = 'none';
      }
      if (errorMsg) {
        errorMsg.style.display = 'none';
      }

      btn.textContent = 'Sending...';
      btn.disabled = true;

      var formData = new FormData(form);
      var effectiveSubject = subject || 'Portfolio Contact: ' + name;
      formData.set('_subject', effectiveSubject);

      fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'application/json'
        }
      }).then(function(response) {
        if (!response.ok) {
          throw new Error('Submission failed');
        }

        return response.json().catch(function() {
          return {};
        });
      }).then(function() {
        form.reset();
        if (successMsg) { successMsg.style.display = 'block'; }
        btn.textContent = 'Send Message';
        btn.disabled = false;
      }).catch(function() {
        showError(errorMsg, 'Something went wrong while sending your message. You can also email supathdh990@gmail.com directly.');
        btn.textContent = 'Send Message';
        btn.disabled = false;
      });
    });

    function showError(el, msg) {
      if (el) { el.textContent = msg; el.style.display = 'block'; }
      else alert(msg);
    }

    function isValidEmail(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
  });
})();
