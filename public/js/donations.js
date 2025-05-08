// donation.js

document.addEventListener('DOMContentLoaded', () => {
    const donationHistoryContainer = document.getElementById('donationHistory');
    const donationForm = document.getElementById('donationForm');
  
    // Fetch and display donation history
    async function loadDonationHistory() {
      try {
        const response = await fetch('/api/donations', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`, // Include token for authentication
          },
        });
  
        const data = await response.json();
  
        if (data.success) {
          displayDonations(data.donations);
        } else {
          donationHistoryContainer.innerHTML = `<p>${data.message || 'No donations found.'}</p>`;
        }
      } catch (error) {
        console.error('Error fetching donation history:', error);
        donationHistoryContainer.innerHTML = '<p>Failed to load donation history.</p>';
      }
    }
  
    // Display donations in the DOM
    function displayDonations(donations) {
      donationHistoryContainer.innerHTML = '';
  
      if (donations.length === 0) {
        donationHistoryContainer.innerHTML = '<p>No donations found.</p>';
        return;
      }
  
      donations.forEach((donation) => {
        const donationDiv = document.createElement('div');
        donationDiv.classList.add('donation-item');
        donationDiv.innerHTML = `
          <p><strong>Charity:</strong> ${donation.charityName}</p>
          <p><strong>Amount:</strong> ₹${donation.amount}</p>
          <p><small>${new Date(donation.createdAt).toLocaleString()}</small></p>
        `;
        donationHistoryContainer.appendChild(donationDiv);
      });
    }
  
    // Handle new donation submission
    donationForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const charityId = document.getElementById('charitySelect').value;
      const amount = document.getElementById('amountInput').value;
  
      try {
        const response = await fetch('/api/donations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`, // Include token for authentication
          },
          body: JSON.stringify({ charityId, amount }),
        });
  
        const data = await response.json();
  
        if (data.success) {
          alert('Donation successful!');
          loadDonationHistory(); // Refresh donation history
        } else {
          alert(data.message || 'Failed to donate.');
        }
      } catch (error) {
        console.error('Error making donation:', error);
        alert('Error making donation.');
      }
    });
  
    // Load donation history on page load
    loadDonationHistory();
  });
  
  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("charitytoken");
  
    window.location.href = "index.html"; // Or the correct path to your index page
  }
  
  