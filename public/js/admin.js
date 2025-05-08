 

document.addEventListener('DOMContentLoaded', async () => {
  const charityList = document.getElementById('charityList');

  try {
    const response = await axios.get('https://charity-app-3giw.onrender.com/allcharities');
    const charities = response.data; // Assuming the response is an array of charities

    if (charities.length > 0) {
      charities.forEach((charity) => {
        const charityDiv = document.createElement('div');
        charityDiv.classList.add('charity-item'); // Add a CSS class for styling

        charityDiv.innerHTML = `
          <h2>${charity.name}</h2>
          <p>${charity.email}</p>
          <p>${charity.mission}</p>
         <button onclick="loadProjects('${charity.id}')">projects</button>
        `;
      
        charityList.appendChild(charityDiv);
      });
    } else {
      charityList.innerHTML = '<p>No charities found.</p>';
    }
  } catch (err) {
    console.error(err);
    charityList.innerHTML = '<p>Error loading charities.</p>';
  }
});
 



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
        projectDiv.id = `project-${project.id}`; // Add an ID here
        

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
          <input type="text" id="amount" required>
          <button onclick="deleteProject('${project.id}')">Delete</button>
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


async function deleteProject(projectid) {
 
  try {
    const token = localStorage.getItem('token'); // Get token from local storage
    const res = await axios.delete(`https://charity-app-3giw.onrender.com/deleteproject/${projectid}`, {  headers: { Authorization: token } });

    alert('Project deleted successfully!');

    // Remove deleted project from DOM instead of reloading
    const projectDiv = document.getElementById(`project-${projectid}`);
    if (projectDiv) {
      projectDiv.remove();
    }

  } catch (err) {
    console.error('Error deleting project:', err);
    alert('Error deleting project.');
  }
}


 

function closeProjects() {
  document.getElementById("charityList").classList.remove("fade");
  document.getElementById("projectListContainer").classList.add("hidden");
}

function calculateProgress(current, target) {
  return (current / target) * 100;
}


function calculateProgress(current, target) {
  if (target === 0) return 0; // Prevent division by zero
  return Math.min((current / target) * 100, 100); // Ensure max progress is 100%
}
function calculateProgressreal(current, target) {
  if (target === 0) return 0; // Prevent division by zero
  return Math.min((current / target) * 100); // Ensure max progress is 100%
}
 



 

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("charitytoken");

  window.location.href = "index.html"; // Or the correct path to your index page
}

