const AccountPage = {
  async render() {
    return `
      <div class="account-page">
        <h1>Account</h1>
        <div id="user-info">
          <p><strong>Username:</strong> <span id="account-username"></span></p>
          <p><strong>Name:</strong> <span id="account-name"></span></p>
        </div>
        
        <!-- Button to Edit Username -->
        <button id="edit-username-btn">Edit Username</button>
        
        <!-- Form to Edit Username -->
        <div id="edit-username-form" style="display:none;">
          <h2>Edit Username</h2>
          <form id="username-form">
            <input type="text" id="new-username" placeholder="New Username" required>
            <button type="submit">Update Username</button>
          </form>
          <button id="cancel-edit-username">Cancel</button>
        </div>

        <!-- Button to Edit Name -->
        <button id="edit-name-btn">Edit Name</button>

        <!-- Form to Edit Name -->
        <div id="edit-name-form" style="display:none;">
          <h2>Edit Name</h2>
          <form id="name-form">
            <input type="text" id="new-name" placeholder="New Name" required>
            <button type="submit">Update Name</button>
          </form>
          <button id="cancel-edit-name">Cancel</button>
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

    // Edit username button
    document.getElementById('edit-username-btn').addEventListener('click', () => {
      // Hide name form and password form if visible
      document.getElementById('edit-name-form').style.display = 'none';
      document.getElementById('edit-password-form').style.display = 'none';
      // Show username form
      document.getElementById('edit-username-form').style.display = 'block';
    });

    // Cancel edit username
    document.getElementById('cancel-edit-username').addEventListener('click', () => {
      document.getElementById('edit-username-form').style.display = 'none';
    });

    // Handle username update
    document.getElementById('username-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const newUsername = document.getElementById('new-username').value;

      if (!newUsername) {
        this.showPopup('Please fill in the username.', 'error');
        return;
      }

      if (newUsername === username) {
        this.showPopup('Username is the same as the current one.', 'error');
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
          // Check if username already exists
          const checkUsernameResponse = await fetch('https://datausertravelkuy-448b9311f98b.herokuapp.com/check-username', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username: newUsername }),
          });

          const usernameData = await checkUsernameResponse.json();

          // Handle duplicate username
          if (usernameData.exists) {
            this.showPopup('Username is already taken.', 'error');
            return;
          }

          // Proceed with updating username
          const response = await fetch('https://datausertravelkuy-448b9311f98b.herokuapp.com/update-user', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ username: newUsername }),
          });

          if (response.ok) {
            this.showPopup('Username updated successfully!', 'success');
            document.getElementById('edit-username-form').style.display = 'none';
            localStorage.setItem('userName', newUsername);
            document.getElementById('account-username').textContent = newUsername;
          } else {
            const errorData = await response.json();
            this.showPopup(`Error: ${errorData.message || 'Failed to update username.'}`, 'error');
          }
        } else {
          const errorData = await verifyTokenResponse.json();
          this.showPopup(`Token verification failed: ${errorData.message}`, 'error');
        }
      } catch (error) {
        console.error('Error updating username:', error);
        this.showPopup('An error occurred. Please try again later.', 'error');
      }
    });

    // Edit name button
    document.getElementById('edit-name-btn').addEventListener('click', () => {
      // Hide username form and password form if visible
      document.getElementById('edit-username-form').style.display = 'none';
      document.getElementById('edit-password-form').style.display = 'none';
      // Show name form
      document.getElementById('edit-name-form').style.display = 'block';
    });

    // Cancel edit name
    document.getElementById('cancel-edit-name').addEventListener('click', () => {
      document.getElementById('edit-name-form').style.display = 'none';
    });

    // Handle name update
    document.getElementById('name-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const newName = document.getElementById('new-name').value;

      if (!newName) {
        this.showPopup('Please fill in the name.', 'error');
        return;
      }

      if (newName === name) {
        this.showPopup('Name is the same as the current one.', 'error');
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
          // Check if name already exists
          const checkNameResponse = await fetch('https://datausertravelkuy-448b9311f98b.herokuapp.com/check-name', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: newName }),
          });

          const nameData = await checkNameResponse.json();

          // Handle duplicate name
          if (nameData.exists) {
            this.showPopup('Name is already taken.', 'error');
            return;
          }

          // Proceed with updating name
          const response = await fetch('https://datausertravelkuy-448b9311f98b.herokuapp.com/update-user', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ name: newName }),
          });

          if (response.ok) {
            this.showPopup('Name updated successfully!', 'success');
            document.getElementById('edit-name-form').style.display = 'none';
            localStorage.setItem('name', newName);
            document.getElementById('account-name').textContent = newName;
          } else {
            const errorData = await response.json();
            this.showPopup(`Error: ${errorData.message || 'Failed to update name.'}`, 'error');
          }
        } else {
          const errorData = await verifyTokenResponse.json();
          this.showPopup(`Token verification failed: ${errorData.message}`, 'error');
        }
      } catch (error) {
        console.error('Error updating name:', error);
        this.showPopup('An error occurred. Please try again later.', 'error');
      }
    });

    // Edit password button
    document.getElementById('edit-password-btn').addEventListener('click', () => {
      // Hide user info form if visible
      document.getElementById('edit-username-form').style.display = 'none';
      document.getElementById('edit-name-form').style.display = 'none';
      // Show password form
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
        this.showPopup('Please fill in both fields.', 'error');
        return;
      }

      // Check if the new password is the same as the current password
      if (currentPassword === newPassword) {
        this.showPopup('New password cannot be the same as the current password.', 'error');
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
            this.showPopup('Password updated successfully!', 'success');
            document.getElementById('edit-password-form').style.display = 'none';
          } else {
            const errorData = await response.json();
            this.showPopup(`Error: ${errorData.message || 'Failed to update password.'}`, 'error');
          }
        } else {
          const errorData = await verifyTokenResponse.json();
          this.showPopup(`Token verification failed: ${errorData.message}`, 'error');
        }
      } catch (error) {
        console.error('Error updating password:', error);
        this.showPopup('An error occurred. Please try again later.', 'error');
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

  showPopup(message, type) {
    const popup = document.getElementById('account-popup');
    const popupMessage = document.getElementById('popup-message');
    popupMessage.textContent = message;
    popup.style.display = 'block';

    // Customize the popup style based on the type (success or error)
    popup.style.backgroundColor = type === 'success' ? 'green' : 'red';
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
