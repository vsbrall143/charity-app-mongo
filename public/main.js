document.addEventListener("DOMContentLoaded", () => {
    const charityList = document.getElementById("charityList");
  
    // Function to fetch and display charities
    async function loadCharities() {
      try {
        const response = await fetch('/api/charities');
        const data = await response.json();
  
        if (data.success) {
          data.charities.forEach(charity => {
            const charityItem = document.createElement('div');
            charityItem.classList.add('charity-item');
            charityItem.innerHTML = `
              <h3>${charity.name}</h3>
              <p>${charity.description}</p>
              <button onclick="donate(${charity.id})">Donate</button>
            `;
            charityList.appendChild(charityItem);
          });
        } else {
          charityList.innerHTML = `<p>No charities available at the moment.</p>`;
        }
      } catch (error) {
        console.error("Error fetching charities:", error);
        charityList.innerHTML = `<p>Failed to load charities.</p>`;
      }
    }
  
    // Function to simulate a donation
    function donate(charityId) {
      alert(`Donating to charity ID: ${charityId}`);
      // Here you would call your donation API
    }
  
    // Load charities on page load
    loadCharities();
  });
  