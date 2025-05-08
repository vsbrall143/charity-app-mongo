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
 
const loginForm = document.getElementById('loginForm');

if (loginForm) {
  
  loginForm.addEventListener('submit', async (e) => {

    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
      // Make POST request to login endpoint
      
      const res = await axios.post('https://charity-app-3giw.onrender.com/api/auth/login', { email, password });

      // Store the token in localStorage
      localStorage.setItem('token', res.data.token);
 
      // Decode the token (using a library like jwt-decode)
      const decodedToken = jwt_decode(res.data.token); 
      const role = decodedToken.role; 

      // Redirect based on role
      if (role === 'user') {
        window.location.href = 'userdashboard.html'; 
      } else if (role === 'admin') {
        window.location.href = 'admin.html'; 
      } else {
        console.warn('Unexpected role received:', role);
        // Handle unexpected role scenario (optional: display error message)
      }

      alert('Login successful!');
    } catch (err) {
      console.error('Login error:', err.response?.data || err.message);
      alert(err.response?.data?.message || 'Failed to login');
    }
  });
}


// Handle registration form submission
const registerForm = document.getElementById('registerForm');
if (registerForm) {
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;
    try {
      // Make POST request to registration endpoint
      const res = await axios.post('https://charity-app-3giw.onrender.com/api/auth/register', { name, email, password,role });

      alert('Registration successful!');
      window.location.href = 'login.html'; // Redirect to login page
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

