const AccountPage = {
    async render() {
      return `
        <div class="account-page">
          <h1>Account</h1>
          <div id="user-info">
            <p><strong>Username:</strong> <span id="account-username"></span></p>
            <p><strong>Name:</strong> <span id="account-name"></span></p>
          </div>
          <button id="edit-password-btn">Edit Password</button>
          
          <!-- Form Edit Password -->
          <div id="edit-password-form" style="display:none;">
            <h2>Edit Password</h2>
            <form id="password-form">
              <input type="password" id="current-password" placeholder="Current Password" required>
              <input type="password" id="new-password" placeholder="New Password" required>
              <button type="submit">Update Password</button>
            </form>
            <button id="cancel-edit-password">Cancel</button>
          </div>
          
          <!-- Popup Account -->
          <div class="pop-up-account" id="account-popup" style="display:none;">
            <p id="popup-message"></p>
            <button id="close-popup">Close</button>
          </div>
  
          <!-- Logout Button -->
          <button id="logout-button">Logout</button>
        </div>
      `;
    },
  
    async afterRender() {
      const username = localStorage.getItem('userName');
      const name = localStorage.getItem('name');
      
      // Populate user info
      document.getElementById('account-username').textContent = username || 'N/A';
      document.getElementById('account-name').textContent = name || 'N/A';
  
      // Edit password button
      document.getElementById('edit-password-btn').addEventListener('click', () => {
        document.getElementById('edit-password-form').style.display = 'block';
      });
  
      // Cancel edit password
      document.getElementById('cancel-edit-password').addEventListener('click', () => {
        document.getElementById('edit-password-form').style.display = 'none';
      });
  
      // Handle password update
      document.getElementById('password-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const currentPassword = document.getElementById('current-password').value;
        const newPassword = document.getElementById('new-password').value;
  
        if (!currentPassword || !newPassword) {
          this.showPopup('Please fill in both fields.');
          return;
        }
  
        try {
          const token = localStorage.getItem('token');
  
          // Verify token before proceeding
          const verifyTokenResponse = await fetch('https://datausertravelkuy-448b9311f98b.herokuapp.com/verify-token', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ token }),
          });
  
          if (verifyTokenResponse.ok) {
            const response = await fetch('https://datausertravelkuy-448b9311f98b.herokuapp.com/change-password', {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
              },
              body: JSON.stringify({ oldPassword: currentPassword, newPassword }),
            });
  
            if (response.ok) {
              this.showPopup('Password updated successfully!');
              document.getElementById('edit-password-form').style.display = 'none';
            } else {
              const errorData = await response.json();
              this.showPopup(`Error: ${errorData.message || 'Failed to update password.'}`);
            }
          } else {
            const errorData = await verifyTokenResponse.json();
            this.showPopup(`Token verification failed: ${errorData.message}`);
          }
        } catch (error) {
          console.error('Error updating password:', error);
          this.showPopup('An error occurred. Please try again later.');
        }
      });
  
      // Close popup
      document.getElementById('close-popup').addEventListener('click', () => {
        document.getElementById('account-popup').style.display = 'none';
      });
  
      // Logout functionality
      const logoutButton = document.getElementById('logout-button');
      if (logoutButton) {
        logoutButton.addEventListener('click', () => this.handleLogout());
      }
    },
  
    showPopup(message) {
      const popup = document.getElementById('account-popup');
      document.getElementById('popup-message').textContent = message;
      popup.style.display = 'block';
    },
  
    handleLogout() {
      // Remove user data from localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('userName');
      localStorage.removeItem('name');
      
      // Redirect to home page
      window.location.href = '#/home';
    }
  };
  
  export default AccountPage;
  