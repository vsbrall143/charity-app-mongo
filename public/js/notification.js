// notification.js

document.addEventListener('DOMContentLoaded', () => {
    const notificationContainer = document.getElementById('notificationContainer');
  
    // Fetch notifications for the user
    async function loadNotifications() {
      try {
        const response = await fetch('/api/notifications', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`, // Add token for authentication
          },
        });
  
        const data = await response.json();
  
        if (data.success) {
          displayNotifications(data.notifications);
        } else {
          notificationContainer.innerHTML = `<p>${data.message || 'No notifications available.'}</p>`;
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
        notificationContainer.innerHTML = '<p>Failed to load notifications.</p>';
      }
    }
  
    // Display notifications in the DOM
    function displayNotifications(notifications) {
      notificationContainer.innerHTML = '';
  
      if (notifications.length === 0) {
        notificationContainer.innerHTML = '<p>No notifications available.</p>';
        return;
      }
  
      notifications.forEach((notification) => {
        const notificationDiv = document.createElement('div');
        notificationDiv.classList.add('notification-item');
        notificationDiv.innerHTML = `
          <h3>${notification.title}</h3>
          <p>${notification.message}</p>
          <p><small>${new Date(notification.createdAt).toLocaleString()}</small></p>
        `;
        notificationContainer.appendChild(notificationDiv);
      });
    }
  
    // Load notifications on page load
    loadNotifications();
  });
  

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("charitytoken");
  
    window.location.href = "index.html"; // Or the correct path to your index page
  }
  
  