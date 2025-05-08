document.addEventListener('DOMContentLoaded', async () => {
  await loadProjects();  
});



function jwt_decode(token) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid JWT token format');
    }

    const payload = parts[1];
    const padding = '='.repeat((4 - (payload.length % 4)) % 4); 
    const base64UrlDecoded = payload + padding; 
    const decodedPayload = atob(base64UrlDecoded); 
    return JSON.parse(decodedPayload); 
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null; 
  }
}


async function loadProjects() {

  const token=localStorage.getItem('charitytoken');
 
  // Decode the token (using a library like jwt-decode)
  const decodedToken = jwt_decode(token); 
  const charityid = decodedToken.id; 

  const projectList = document.getElementById('projectList');
  projectList.innerHTML = ""; // Clear existing project list


  try {
    const response = await axios.get(`https://charity-app-3giw.onrender.com/allprojects/${charityid}`);
    const projects = response.data; // Assuming the response is an array of projects

    if (projects.length > 0) {
      projects.forEach((project) => {
        const projectDiv = document.createElement('div');
        projectDiv.classList.add('project-item'); // Add a CSS class for styling

        // Check if project has an image
        const imageHtml = project.imageUrl
          ? `<img src="https://charity-app-3giw.onrender.com${project.imageUrl}" alt="${project.title}" class="project-image">`
          : '<p>No image available</p>';

        projectDiv.innerHTML = `
          ${imageHtml}
          <h2>${project.title}</h2>
          <p>${project.description}</p>
          <button onclick="window.location.href = 'projects.html' ">Donate</button>
        `;

        projectList.appendChild(projectDiv);
      });
    } else {
      projectList.innerHTML = '<p>No projects found.</p>';
    }
  } catch (err) {
    console.error(err);
    projectList.innerHTML = '<p>Error loading projects.</p>';
  }
}

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("charitytoken");

  window.location.href = "index.html"; // Or the correct path to your index page
}

