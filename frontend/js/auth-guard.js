(function(){
  try{
    // Public pages that don't require authentication
    var publicPaths = ['signup.html', 'products.html', 'index.html', ''];
    var path = (location.pathname.split('/').pop() || '').toLowerCase();
    
    // If it's a public page, don't block anything
    if(publicPaths.indexOf(path) !== -1) return;
    
    // Check if user has a token
    var token = localStorage.getItem('token');
    var user = localStorage.getItem('user');
    
    if(!token || !user){
      console.log('No authentication found, redirecting to signup');
      // Redirect to signup page
      window.location.href = 'signup.html';
      return;
    }
    
    // Validate token by making a request to /api/users/me
    fetch('/api/users/me', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Token validation failed');
      }
      return response.json();
    })
    .then(userData => {
      console.log('Token validated successfully');
      // Update user data in localStorage
      localStorage.setItem('user', JSON.stringify(userData));
    })
    .catch(error => {
      console.log('Token validation failed:', error.message);
      // Clear invalid auth data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Redirect to signup
      window.location.href = 'signup.html';
    });
    
  }catch(error){
    console.error('Auth guard error:', error);
    // On any error, redirect to signup for safety
    window.location.href = 'signup.html';
  }
})();

