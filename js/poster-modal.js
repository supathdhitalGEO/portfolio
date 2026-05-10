/* ============================================================
   POSTER-MODAL.JS — Fullscreen Poster Preview Modal
   ============================================================ */

document.addEventListener('DOMContentLoaded', function() {
  // Create modal HTML if it doesn't exist
  if (!document.getElementById('posterModal')) {
    const modalHTML = `
      <div id="posterModal" class="poster-modal">
        <div class="poster-modal-content">
          <span class="poster-modal-close">&times;</span>
          <img id="posterImage" class="poster-modal-image" src="" alt="Poster preview" />
          <div class="poster-modal-actions">
            <a id="posterDownloadBtn" href="" download target="_blank">Download PDF</a>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
  }

  const modal = document.getElementById('posterModal');
  const modalImage = document.getElementById('posterImage');
  const modalClose = document.querySelector('.poster-modal-close');
  const downloadBtn = document.getElementById('posterDownloadBtn');

  // Open modal on poster thumb click
  document.addEventListener('click', function(e) {
    const posterThumb = e.target.closest('.poster-thumb-clickable');
    if (posterThumb) {
      const imageSrc = posterThumb.src;
      const pdfLink = posterThumb.getAttribute('data-pdf');
      
      modalImage.src = imageSrc;
      if (pdfLink) {
        downloadBtn.href = pdfLink;
        downloadBtn.style.display = 'inline-block';
      } else {
        downloadBtn.style.display = 'none';
      }
      modal.classList.add('active');
    }
  });

  // Close modal on close button click
  modalClose.addEventListener('click', function() {
    modal.classList.remove('active');
  });

  // Close modal on background click
  modal.addEventListener('click', function(e) {
    if (e.target === modal) {
      modal.classList.remove('active');
    }
  });

  // Close modal on Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      modal.classList.remove('active');
    }
  });
});
