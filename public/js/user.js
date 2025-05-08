// user.js

document.addEventListener('DOMContentLoaded', () => {
    const profileContainer = document.getElementById('profileContainer');
    const updateForm = document.getElementById('updateForm');
  
    // Fetch and display user profile
    async function loadUserProfile() {
      try {
        const response = await fetch('/api/users/profile', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`, // Add token for authentication
          },
        });
  
        const data = await response.json();
  
        if (data.success) {
          const user = data.user;
  
          // Populate the profile details
          profileContainer.innerHTML = `
            <h2>User Profile</h2>
            <p><strong>Name:</strong> ${user.name}</p>
            <p><strong>Email:</strong> ${user.email}</p>
            <button id="editProfileButton">Edit Profile</button>
          `;
  
          // Add event listener to edit button
          document.getElementById('editProfileButton').addEventListener('click', () => {
            showEditForm(user);
          });
        } else {
          alert(data.message || 'Failed to fetch profile');
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        alert('Error fetching user profile');
      }
    }
  
    // Show the update form with pre-filled values
    function showEditForm(user) {
      updateForm.style.display = 'block';
      document.getElementById('nameInput').value = user.name;
      document.getElementById('emailInput').value = user.email;
    }
  
    // Handle profile update form submission
    updateForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('nameInput').value;
      const email = document.getElementById('emailInput').value;
  
      try {
        const response = await fetch('/api/users/profile', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`, // Add token for authentication
          },
          body: JSON.stringify({ name, email }),
        });
  
        const data = await response.json();
  
        if (data.success) {
          alert('Profile updated successfully!');
          updateForm.style.display = 'none';
          loadUserProfile(); // Reload profile details
        } else {
          alert(data.message || 'Failed to update profile');
        }
      } catch (error) {
        console.error('Error updating profile:', error);
        alert('Error updating profile');
      }
    });
  
    // Load user profile on page load
    loadUserProfile();
  });
  


  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("charitytoken");
  
    window.location.href = "index.html"; // Or the correct path to your index page
  }
  
  