import React, { useState } from 'react';
import supabase from '../Supabase/supabase';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    age: '',
    gender: '',
    adharNumber: '',
    mobileNumber: '',
    address: '',
    annualIncome: '',
    role: 'student',
    educationType: '',
    collegeName: '',
    maritalStatus: '',
    govServiceNumber: '',
    photo: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, photo: e.target.files[0] });
  };

  const uploadPhoto = async (file) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const { data, error } = await supabase.storage
      .from('user-photos') // Make sure you create a "user-photos" bucket in Supabase Storage
      .upload(fileName, file);
    
    if (error) {
      console.error('Error uploading photo:', error);
      return null;
    }
    return `${supabase.storage.from('user-photos').getPublicUrl(fileName).data.publicUrl}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    let photoUrl = null;
    if (formData.photo) {
      photoUrl = await uploadPhoto(formData.photo);
    }

    const { data, error } = await supabase.from('users').insert([
      {
        name: formData.name,
        email: formData.email,
        password: formData.password, // In a real app, hash the password before storing
        age: formData.age,
        gender: formData.gender,
        adharNumber: formData.adharNumber,
        mobileNumber: formData.mobileNumber,
        address: formData.address,
        annualIncome: formData.annualIncome,
        role: formData.role,
        educationType: formData.role === 'student' ? formData.educationType : null,
        collegeName: formData.role === 'student' ? formData.collegeName : null,
        maritalStatus: formData.role === 'user' ? formData.maritalStatus : null,
        govServiceNumber: formData.role === 'admin' ? formData.govServiceNumber : null,
        photoUrl: photoUrl,
      },
    ]);

    if (error) {
      console.error('Error inserting data:', error);
    } else {
      console.log('User registered:', data);
      alert('Registration Successful');
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: 'auto', 
      backgroundColor: '#e3f2fd',
      padding: '40px'
    }}>
      <form 
        style={{ 
          width: '100%', 
          maxWidth: '700px', 
          padding: '25px', 
          backgroundColor: '#ffffff', 
          borderRadius: '12px', 
          boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.15)'
        }} 
        onSubmit={handleSubmit}
      >
        <h2 style={{ textAlign: 'center', color: '#1e40af', marginBottom: '20px' }}>Sign Up</h2>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
          {[
            { label: 'Name', type: 'text', name: 'name' },
            { label: 'Email', type: 'email', name: 'email' },
            { label: 'Password', type: 'password', name: 'password' },
            { label: 'Age', type: 'number', name: 'age' },
            { label: 'Aadhar Number', type: 'text', name: 'adharNumber' },
            { label: 'Mobile Number', type: 'text', name: 'mobileNumber' },
            { label: 'Annual Family Income', type: 'number', name: 'annualIncome' }
          ].map((field, index) => (
            <div key={index} style={{ flex: '1 1 calc(50% - 10px)', minWidth: '250px' }}>
              <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>{field.label}</label>
              <input 
                type={field.type} 
                name={field.name} 
                value={formData[field.name]} 
                onChange={handleChange} 
                required 
                style={{ 
                  width: '80%', 
                  padding: '10px', 
                  borderRadius: '6px', 
                  border: '1px solid #ccc', 
                  outline: 'none'
                }} 
              />
            </div>
          ))}

          <div style={{ flex: '1 1 calc(50% - 10px)', minWidth: '250px' }}>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Gender</label>
            <select 
              name="gender" 
              value={formData.gender} 
              onChange={handleChange} 
              required 
              style={{ 
                width: '80%', 
                padding: '10px', 
                borderRadius: '6px', 
                border: '1px solid #ccc',
                backgroundColor: 'white',
                outline: 'none' 
              }}
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div style={{ flex: '1 1 100%', minWidth: '250px' }}>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Address</label>
            <textarea 
              name="address" 
              value={formData.address} 
              onChange={handleChange} 
              required 
              style={{ 
                width: '80%', 
                padding: '10px', 
                borderRadius: '6px', 
                border: '1px solid #ccc',
                outline: 'none',
                resize: 'none' 
              }} 
            />
          </div>

          <div style={{ flex: '1 1 calc(50% - 10px)', minWidth: '250px' }}>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Role</label>
            <select 
              name="role" 
              value={formData.role} 
              onChange={handleChange} 
              required 
              style={{ 
                width: '80%', 
                padding: '10px', 
                borderRadius: '6px', 
                border: '1px solid #ccc', 
                backgroundColor: 'white', 
                outline: 'none' 
              }}
            >
              <option value="student">Student</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>

        {formData.role === 'student' && (
          <>
            <label>Current Education Type</label>
            <input type="text" name="educationType" value={formData.educationType} onChange={handleChange} required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', marginBottom: '15px' }} />
            
            <label>College Name</label>
            <input type="text" name="collegeName" value={formData.collegeName} onChange={handleChange} required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', marginBottom: '15px' }} />
          </>
        )}

        {formData.role === 'user' && (
          <>
            <label>Marital Status</label>
            <select name="maritalStatus" value={formData.maritalStatus} onChange={handleChange} required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', backgroundColor: 'white', outline: 'none', marginBottom: '15px' }}>
              <option value="">Select Status</option>
              <option value="married">Married</option>
              <option value="unmarried">Unmarried</option>
              <option value="widow">Widow</option>
            </select>
          </>
        )}

        {formData.role === 'admin' && (
          <>
          <label>Government Service Number</label>
           <input type="text" name="govServiceNumber" value={formData.govServiceNumber} onChange={handleChange} required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', marginBottom: '15px' }} />
          </>
        )}

        <label>Upload Photo</label>
        <input type="file" name="photo" accept="image/*" onChange={handleFileChange} required style={{ width: '100%', padding: '10px', marginBottom: '15px' }} />

        <button type="submit" 
          style={{ 
            width: '100%', 
            padding: '12px', 
            backgroundColor: '#1e40af', 
            color: 'white', 
            fontSize: '16px', 
            border: 'none', 
            borderRadius: '6px', 
            cursor: 'pointer', 
            transition: 'background-color 0.3s ease-in-out' 
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#153b8a'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#1e40af'}
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default Signup;
