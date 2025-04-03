import React, { useEffect, useState } from 'react';

const Users = () => {  // Changed 'users' to 'Users'
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    // Retrieve user data from localStorage
    const loggedInUser = JSON.parse(localStorage.getItem('user'));
    if (loggedInUser) {
      setUser(loggedInUser);
    }
  }, []);

  return (
    <div>
      <h1>User Dashboard</h1>
      {user ? <p>Welcome, {user.email}</p> : <p>Loading...</p>}
    </div>
  );
};

export default Users; // Changed 'users' to 'Users'
