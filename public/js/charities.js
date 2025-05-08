document.addEventListener("DOMContentLoaded", () => {
  restoreFiltersFromURL(); // Restore search preferences from the URL
  fetchCharities(); // Load data based on initial URL
});

// Function to fetch charities based on URL query parameters
async function fetchCharities() {
  const urlParams = new URLSearchParams(window.location.search);
  const queryString = urlParams.toString(); // Convert filters into query parameters

  try {
    const response = await axios.get(`https://charity-app-3giw.onrender.com/allcharities?${queryString}`);
    displayCharities(response.data); // Display fetched charities
  } catch (err) {
    console.error(err);
    document.getElementById("charityList").innerHTML = "<p>Error loading charities.</p>";
  }
}


// Function to update URL and fetch charities dynamically when filters are changed
function applyFilters() {
  let searchInput = document.getElementById("searchCharity")?.value.toLowerCase();
  let selectedLocations = Array.from(document.querySelectorAll('input[name="location"]:checked')).map(cb => cb.value);
  let selectedCategories = Array.from(document.querySelectorAll('input[name="category"]:checked')).map(cb => cb.value);
  let selectedApproval = Array.from(document.querySelectorAll('input[name="approved"]:checked')).map(cb => cb.value);

  const params = new URLSearchParams(window.location.search); // Preserve existing parameters

  // Update the URL parameters
  params.delete("location"); // Remove old filters before updating
  params.delete("category");
  params.delete("approve");
  params.delete("search");

  if (searchInput) params.set("search", searchInput);
  if (selectedLocations.length) params.set("location", selectedLocations.join(","));
  if (selectedCategories.length) params.set("category", selectedCategories.join(","));
  if (selectedApproval.length) params.set("approve", selectedApproval.join(","));

  // Update URL in browser without reloading the page
  const newUrl = `${window.location.pathname}?${params.toString()}`;
  window.history.pushState({}, "", newUrl);

  // Fetch updated data from the backend
  fetchCharities();
}

// Function to restore search input and checkbox selections from URL
function restoreFiltersFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  
  // Restore search input
  const searchValue = urlParams.get("search");
  if (searchValue) {
    document.getElementById("searchCharity").value = searchValue;
  }

  // Restore checkboxes for location, category, and approval
  ["location", "category", "approve"].forEach((filter) => {
    const values = urlParams.get(filter)?.split(",") || [];
    document.querySelectorAll(`input[name="${filter}"]`).forEach((checkbox) => {
      checkbox.checked = values.includes(checkbox.value);
    });
  });
}

// Add event listeners to checkboxes
document.querySelectorAll('input[name="location"], input[name="category"], input[name="approved"]').forEach((checkbox) => {
  checkbox.addEventListener("change", applyFilters); // Update URL and fetch data on change
});

// Add event listener to search input
document.getElementById("searchCharity")?.addEventListener("input", applyFilters);

// Function to display charities (only updates the UI, does not fetch data)
function displayCharities(charities) {
  const charityList = document.getElementById("charityList");
  charityList.innerHTML = ""; // Clear previous entries

  if (charities.length > 0) {
    charities.forEach((charity) => {
      const charityDiv = document.createElement("div");
      charityDiv.classList.add("charity-item");

      charityDiv.innerHTML = `
        <h2>${charity.name}</h2>
        <p>${charity.email}</p>
        <p>${charity.mission}</p>
        <p><strong>Category:</strong> ${charity.category}</p>
        <p><strong>Location:</strong> ${charity.location}</p>
        <p><strong>Status:</strong> ${charity.approve === 1 ? 'Approved' : 'Pending'}</p>
        <button onclick="loadProjects('${charity.id}')">View Projects</button>
      `;

      charityList.appendChild(charityDiv);
    });
  } else {
    charityList.innerHTML = "<p>No charities found.</p>";
  }
}


// Function to fetch and display projects for a selected charity
async function loadProjects(charityId) {
  const charityList = document.getElementById("charityList");
  const projectListContainer = document.getElementById("projectListContainer");
  const projectList = document.getElementById("projectList");

  projectList.innerHTML = ""; 
  charityList.classList.add("fade"); // Fade charities
  projectListContainer.classList.remove("hidden"); // Show projects

  try {
    const response = await axios.get(`https://charity-app-3giw.onrender.com/allprojects/${charityId}`);
    const projects = response.data;

    if (projects.length > 0) {
      projects.forEach((project) => {
        const projectDiv = document.createElement("div");
        projectDiv.classList.add("project-item");

        const imageHtml = project.imageUrl
          ? `<img src="https://charity-app-3giw.onrender.com${project.imageUrl}" alt="${project.title}" class="project-image">`
          : "<p>No image available</p>";

        projectDiv.innerHTML = `
          ${imageHtml}
          <h2>${project.title}</h2>
          <p>${project.description}</p>
          <div class="progress-bar-container">
            <div class="progress-bar">
              <div class="progress" style="width: ${calculateProgress(project.current, project.target)}%"></div>
            </div>
            <p>₹${project.current} / ₹${project.target} (Progress: ${calculateProgress(project.current, project.target)}%)</p>
          </div>
          <label for="amount">Amount</label>
          <input type="text" id="amount-${project.id}" required>
          <button onclick="donate('${project.id}', '${project.charity_id}')">Donate</button>
        `;

        projectList.appendChild(projectDiv);
      });
    } else {
      projectList.innerHTML = "<p>No projects found.</p>";
    }
  } catch (err) {
    console.error(err);
    projectList.innerHTML = "<p>Error loading projects.</p>";
  }
}

// Function to close the project list
function closeProjects() {
  document.getElementById("charityList").classList.remove("fade");
  document.getElementById("projectListContainer").classList.add("hidden");
}

// Function to calculate progress percentage
function calculateProgress(current, target) {
  if (target === 0) return 0; // Prevent division by zero
  return Math.min((current / target) * 100, 100); // Ensure max progress is 100%
}

// Function to handle donations
async function donate(projectid, charityid) {
  try {
    let amount = document.getElementById(`amount-${projectid}`).value;

    if (amount === "" || amount === null) { 
      alert("Please enter the amount.");
      return false;
    }

    const token = localStorage.getItem('token');
    const response = await axios.get(`https://charity-app-3giw.onrender.com/donations/donation/${amount * 100}/${projectid}/${charityid}`, {
      headers: { Authorization: token }
    });

    var options = {
      "key": response.data.key_id,
      "order_id": response.data.order.id, 
      "handler": async function (response) {
        try {
          await axios.post(`https://charity-app-3giw.onrender.com/donations/updateTransactionStatus/${amount}/${projectid}/${charityid}`, {
            order_id: options.order_id,
            payment_id: response.razorpay_payment_id,
          }, { headers: { "Authorization": token } });

          window.location.href = 'charities.html';
        } catch (error) {
          console.error("Error updating transaction status:", error);
          alert('Transaction Failed. Please try again.');
        }
      },
      "theme": { "color": "#3399cc" }
    };

    const rzp1 = new Razorpay(options);
    rzp1.open();
  } catch (error) {
    console.error("Error during payment process:", error);
  }
}

// Logout function
function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("charitytoken");
  window.location.href = "index.html"; 
}

// Attach event listener to filter checkboxes
document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
  checkbox.addEventListener("change", applyFilters);
});

// Attach event listener for search input
document.getElementById("searchCharity")?.addEventListener("input", applyFilters);
