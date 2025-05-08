// auth.js

// Handle login form submission
const loginForm = document.getElementById('charity-loginForm');

if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
 
    try {
      // Make POST request to login endpoint
      const res = await axios.post('https://charity-app-3giw.onrender.com/api/auth/charitylogin', { email, password }); 
      console.log(res);
      // Store the token in localStorage (or cookies)
      localStorage.setItem('charitytoken', res.data.charitytoken); 

      // Redirect to the charity dashboard or another appropriate page
      window.location.href = 'charity-dashboard.html'; 
      console.log(res);
    } catch (err) {
      console.error('Login error:', err.response?.data || err.message);
      alert(err.response?.data?.message || 'Failed to login');
    }
  });
}

// Handle registration form submission
const registerForm = document.getElementById('charity-registerForm');

if (registerForm) {
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const mission = document.getElementById('mission').value;
    const registrationNumber = document.getElementById('registrationNumber').value;
    const category = document.getElementById('category').value;
    const location = document.getElementById('location').value;

    try {
      // Make POST request to registration endpoint
      const res = await axios.post('https://charity-app-3giw.onrender.com/api/auth/charityregister', { 
        name, 
        email, 
        password, 
        mission, 
        registrationNumber,
        category, 
        location 
      });

      alert('Registration successful!');
      window.location.href = 'charities-login.html'; // Redirect to login page
    } catch (err) {
      console.error('Registration error:', err.response?.data || err.message);
      alert(err.response?.data?.message || 'Failed to register');
    }
  });
}


function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("charitytoken");

  window.location.href = "index.html"; // Or the correct path to your index page
}

