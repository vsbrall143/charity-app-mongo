 
  
document.addEventListener('DOMContentLoaded', async () => {
  const charityList = document.getElementById('charityList');

  try {
    const response = await axios.get('https://charity-app-3giw.onrender.com/unapprovedcharities');
    const charities = response.data; // Assuming the response is an array of charities

    if (charities.length > 0) {
      charities.forEach((charity) => {
        const charityDiv = document.createElement('div');
        charityDiv.classList.add('charity-item'); // Add a CSS class for styling

        charityDiv.innerHTML = `
          <h2>${charity.name}</h2>
          <p>${charity.email}</p>
          <p>${charity.mission}</p>
          <button onclick="approveCharity('${charity.id}')"> approve</button>
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
 

  
  async function loadProjects() {
    console.log("reloaded")
    const projectList = document.getElementById('projectList');
    projectList.innerHTML = ""; // Clear existing project list
  
    try {
      const response = await axios.get('https://charity-app-3giw.onrender.com/unapprovedprojects');
      const projects = response.data; // Assuming the response is an array of projects
      console.log(response.data);
      if (projects.length > 0) {
        projects.forEach((project) => {
          console.log(project.id);
          const projectDiv = document.createElement('div');
          projectDiv.classList.add('project-item'); // Add a CSS class for styling
  
          projectDiv.innerHTML = `
          <div id="project-${project.id}">
            <h2>${project.title}</h2>
            <p>${project.description}</p>
            <button onclick="approveCharity('${project.id}')"> approve</button>
          </div>
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
  

  
  async function approveCharity(charityId) {
    try {
      const token = localStorage.getItem('token'); // Get token from local storage
      await axios.post(`https://charity-app-3giw.onrender.com/approvecharity/${charityId}`,   {  headers: { Authorization: token } });
  
      alert('Charity approved successfully!');
      // Refresh project list (consider using a more efficient method like DOM manipulation)
      window.location.reload(); // For now, reload the page to refresh
    } catch (err) {
      console.error('Error approving project:', err);
      alert('Error approving project.');
    }
  }
  
  
  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("charitytoken");
  
    window.location.href = "index.html"; // Or the correct path to your index page
  }
  
  