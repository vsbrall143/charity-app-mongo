document.addEventListener('DOMContentLoaded', async () => {
    await loadCharityHistory();
  });
  
  async function loadCharityHistory() {
    const charityHistoryDiv = document.getElementById('charityhistory');
    charityHistoryDiv.innerHTML = ""; // Clear existing history
  
    try {
      const token = localStorage.getItem('token'); // Fetch token for authentication
  
      const response = await axios.get('https://charity-app-3giw.onrender.com/donations/allhistory', {
        headers: { Authorization: token }
      });
  
      const donations = response.data; // Assuming response is an array of donation history
  
      if (donations.length > 0) {
        donations.forEach((donation) => {
          const historyDiv = document.createElement('div');
          historyDiv.classList.add('history-item'); // Add a CSS class for styling
  
          historyDiv.innerHTML = `
            <h3>${donation.charityName}</h3>
            <p>Project: ${donation.projectTitle}</p>
            <p>Amount Donated: ₹${donation.amount}</p>
            <p>Date: ${new Date(donation.date).toLocaleDateString()}</p>
            <p>Status: <strong style="color: ${donation.status === 'Success' ? 'green' : 'red'}">${donation.status}</strong></p>
          `;
  
          charityHistoryDiv.appendChild(historyDiv);
        });
      } else {
        charityHistoryDiv.innerHTML = '<p>No donation history found.</p>';
      }
    } catch (error) {
      console.error("Error fetching charity history:", error);
      charityHistoryDiv.innerHTML = '<p>Error loading history.</p>';
    }
  }
  

    
  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("charitytoken");
  
    window.location.href = "index.html"; // Or the correct path to your index page
  }
  