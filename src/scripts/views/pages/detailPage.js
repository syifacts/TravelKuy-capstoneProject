const Detail = {
  async render() {
    return `
      <section class="detail-desa">
        <div id="detail-container">Memuat detail...</div>
      </section>
    `;
  },

  async afterRender() {
    const urlParams = window.location.hash.split('/');
    const id = urlParams[urlParams.length - 1];

    try {
      const response = await fetch(`https://apidesawisata-353b9a2a7d66.herokuapp.com/desawisata/${id}`);
      const desa = await response.json();

      const detailContainer = document.getElementById('detail-container');
      if (!detailContainer) {
        console.error('Elemen detail-container tidak ditemukan.');
        return;
      }

      if (!desa) {
        detailContainer.innerHTML = '<p>Desa tidak ditemukan.</p>';
        return;
      }

      // Render detail desa
      detailContainer.innerHTML = `
        <div class="detail-container">
          <h2>${desa.name}</h2>
          <img src="${desa.photo}" alt="${desa.name}" class="detail-image">
          <p><strong>Lokasi:</strong> ${desa.location}</p>
          <p><strong>Deskripsi:</strong> ${desa.description}</p>
          <p><strong>Detail:</strong> ${desa.longdesc}</p>
          <div class="video-container">
            <h3>Video</h3>
            <iframe width="560" height="315" src="${desa.urlvid}" frameborder="0" allowfullscreen></iframe>
          </div>
          <h3>Ulasan</h3>
          <div id="reviews-container">Memuat ulasan...</div>
          <form id="review-form">
            <label for="reviewer-name">Nama:</label>
            <input type="text" id="reviewer-name" placeholder="Nama" required>
            <label for="review-text">Ulasan:</label>
            <textarea id="review-text" placeholder="Tulis ulasan" required></textarea>
            <label for="rating">Rating:</label>
            <select id="rating" required>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
            <button type="submit" id="submit-review">Tambah Ulasan</button>
            <p id="review-status"></p>
          </form>
          <a href="#/desawisata" class="back-button">Kembali</a>
        </div>
      `;

      // Fetch and display reviews
      await this.loadReviews(id);

      // Handle review form submission
      const reviewForm = document.getElementById('review-form');
      reviewForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const statusText = document.getElementById('review-status');
        const reviewerName = document.getElementById('reviewer-name').value;
        const reviewText = document.getElementById('review-text').value;
        const rating = parseInt(document.getElementById('rating').value);

        statusText.textContent = 'Menambahkan ulasan...';

        try {
          await this.addReview(id, reviewerName, reviewText, rating);
          this.showPopup('success', 'Ulasan berhasil ditambahkan!');
          reviewForm.reset();
          
          // Add the new review to the UI directly
          this.addReviewToUI(reviewerName, reviewText, rating);
        } catch (error) {
          console.error('Error adding review:', error);
          this.showPopup('error', 'Gagal menambahkan ulasan. Coba lagi!');
        }
      });
    } catch (error) {
      console.error('Error fetching desa data:', error);
      const detailContainer = document.getElementById('detail-container');
      detailContainer.innerHTML = '<p>Terjadi kesalahan. Desa tidak ditemukan.</p>';
    }
  },

  // Load reviews and display them
  async loadReviews(id) {
    try {
      const response = await fetch(`https://apidesawisata-353b9a2a7d66.herokuapp.com/desawisata/${id}/reviews`);
      const reviews = await response.json();

      const uniqueReviews = this.getUniqueReviews(reviews);

      const reviewsContainer = document.getElementById('reviews-container');
      if (!reviewsContainer) return;

      if (uniqueReviews.length === 0) {
        reviewsContainer.innerHTML = '<p>Tidak ada ulasan.</p>';
      } else {
        reviewsContainer.innerHTML = uniqueReviews.map(review => `
          <div class="review" id="review-${review._id}">
            <p><strong>${review.reviewerName || 'Anonym'}</strong> - ${review.rating || 'Tidak ada rating'}⭐</p>
            <p>${review.reviewText || 'Tidak ada ulasan.'}</p>
            <p><small>Ditulis pada: ${review.createdAt ? new Date(review.createdAt).toLocaleString() : 'Tanggal tidak tersedia'}</small></p>
            <button class="delete-review ${!this.isReviewOwner(review) ? 'disabled' : ''}" data-review-id="${review._id}" ${this.isReviewOwner(review) ? '' : 'disabled'}>Hapus</button>
          </div>
        `).join('');
        this.attachDeleteReviewListeners(id);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      const reviewsContainer = document.getElementById('reviews-container');
      reviewsContainer.innerHTML = '<p>Gagal memuat ulasan.</p>';
    }
  },

  // Filter out duplicate reviews
  getUniqueReviews(reviews) {
    const uniqueReviews = [];
    const seenReviews = new Set();

    reviews.forEach(review => {
      const reviewIdentifier = `${review.reviewerName}-${review.reviewText}-${review.rating}`;
      if (!seenReviews.has(reviewIdentifier)) {
        seenReviews.add(reviewIdentifier);
        uniqueReviews.push(review);
      }
    });

    return uniqueReviews;
  },

  // Add review to the UI directly after submitting
  addReviewToUI(reviewerName, reviewText, rating) {
    const reviewsContainer = document.getElementById('reviews-container');
    if (!reviewsContainer) return;

    const reviewElement = document.createElement('div');
    reviewElement.classList.add('review');
    reviewElement.innerHTML = `
      <p><strong>${reviewerName}</strong> - ${rating}⭐</p>
      <p>${reviewText}</p>
      <p><small>Ditulis pada: ${new Date().toLocaleString()}</small></p>
      <button class="delete-review" data-review-id="new" disabled>Hapus</button>
    `;
    reviewsContainer.prepend(reviewElement);

    // Attach delete listeners for new review
    this.attachDeleteReviewListeners();
  },

  // Show popup message for success or error
  showPopup(type, message) {
    const popup = document.createElement('div');
    popup.classList.add('popup', type);
    popup.innerHTML = message;
    document.body.appendChild(popup);

    setTimeout(() => {
      popup.classList.add('visible');
    }, 10);

    setTimeout(() => {
      popup.classList.remove('visible');
      setTimeout(() => {
        popup.remove();
      }, 300);
    }, 3000);
  },

  // Check if the review belongs to the logged-in user
  isReviewOwner(review) {
    const loggedInUserId = localStorage.getItem('userId');
    return review.userId === loggedInUserId;
  },

  // Add a review and update UI
  async addReview(id, reviewerName, reviewText, rating) {
    const existingReviews = await this.getReviews(id);
    const isDuplicate = existingReviews.some(review =>
      review.reviewerName === reviewerName &&
      review.reviewText === reviewText &&
      review.rating === rating
    );

    if (isDuplicate) {
      throw new Error('Ulasan yang sama sudah ada.');
    }

    await fetch(`https://apidesawisata-353b9a2a7d66.herokuapp.com/desawisata/${id}/review`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        reviewerName,
        reviewText,
        rating,
        userId: localStorage.getItem('userId')
      }),
    });
  },

  // Get reviews for checking duplicates
  async getReviews(id) {
    try {
      const response = await fetch(`https://apidesawisata-353b9a2a7d66.herokuapp.com/desawisata/${id}/reviews`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching reviews:', error);
      return [];
    }
  },

  // Attach listeners to delete buttons
  attachDeleteReviewListeners(id) {
    const deleteButtons = document.querySelectorAll('.delete-review');
    deleteButtons.forEach(button => {
      button.addEventListener('click', async () => {
        const reviewId = button.getAttribute('data-review-id');
        if (reviewId !== 'new') {
          await this.deleteReview(id, reviewId);
          await this.loadReviews(id);
        }
      });
    });
  },

  // Delete a review
  async deleteReview(id, reviewId) {
    try {
      await fetch(`https://apidesawisata-353b9a2a7d66.herokuapp.com/desawisata/${id}/review/${reviewId}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  },
};

export default Detail;
