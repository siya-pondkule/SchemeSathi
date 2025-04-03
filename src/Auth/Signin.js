import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../Supabase/supabase';

const Signin = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { data, error } = await supabase
      .from('users')
      .select('email, password, role')
      .eq('email', formData.email)
      .single();

    if (error || !data) {
      alert('User not found');
      return;
    }

    if (formData.password === data.password) {
      alert('Login successful');
      localStorage.setItem('user', JSON.stringify(data));
      switch (data.role) {
        case 'admin':
          navigate('/admin');
          break;
        case 'student':
          navigate('/students');
          break;
        case 'user':
          navigate('/users');
          break;
        default:
          alert('Unknown role');
          navigate('/');
      }
    } else {
      alert('Invalid password');
    }
  };

  return (
    <div style={{
      display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', /*background: 'linear-gradient(135deg, #667eea, #764ba2)'*/
    }}>
      <form 
        style={{
          width: '100%', maxWidth: '400px', padding: '30px', backgroundColor: 'white', borderRadius: '10px', 
          boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.2)', textAlign: 'center'
        }} 
        onSubmit={handleSubmit}
      >
        <h2 style={{ marginBottom: '20px', color: '#333' }}>Sign In</h2>
        <input 
          type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="Email" 
          style={{ width: '100%', padding: '10px', marginBottom: '15px', borderRadius: '5px', border: '1px solid #ccc' }}
        />
        <input 
          type="password" name="password" value={formData.password} onChange={handleChange} required placeholder="Password" 
          style={{ width: '100%', padding: '10px', marginBottom: '20px', borderRadius: '5px', border: '1px solid #ccc' }}
        />
        <button 
          type="submit" 
          style={{
            width: '100%', padding: '10px', backgroundColor: '#667eea', color: 'white', border: 'none', 
            borderRadius: '5px', cursor: 'pointer', fontSize: '16px', marginBottom: '10px'
          }}
        >Sign In</button>
        <button 
          type="button" onClick={() => navigate('/signup')} 
          style={{
            width: '100%', padding: '10px', backgroundColor: '#764ba2', color: 'white', border: 'none', 
            borderRadius: '5px', cursor: 'pointer', fontSize: '16px'
          }}
        >Register</button>
      </form>
    </div>
  );
};

export default Signin;