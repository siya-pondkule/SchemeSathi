import React, { useEffect, useState } from 'react';
import supabase from '../../Supabase/supabase';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('addScheme');
  const [schemes, setSchemes] = useState([]);
  
  const [scheme, setScheme] = useState({
    schemeNumber: '',
    schemeName: '',
    description: '',
    eligibility: [], // Store as an array
    category: '',
    incomeRequired: '',
    ageGroup: '',
    startDate: '',
    lastDate: '',
    schemeUrl: '',  // New field for URL

  });
  const [filterCategory, setFilterCategory] = useState('');
  const eligibilityOptions = ['Farmer', 'Male', 'Female', 'Workers', 'Teachers', 'Students', 'Widows', 'Low-Income People'];

  useEffect(() => {
    fetchSchemes();
  }, []);

  const fetchSchemes = async () => {
    const { data, error } = await supabase.from('schemes').select('*');
    if (error) console.error('Error fetching schemes:', error);
    else setSchemes(data);
  };

  const handleDelete = async (id) => {
    const { error } = await supabase.from('schemes').delete().match({ id });

    if (error) {
      console.error('Error deleting scheme:', error);
      alert('Failed to delete scheme');
    } else {
      alert('Scheme deleted successfully!');
      setSchemes(schemes.filter(scheme => scheme.id !== id));
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.from('schemes').insert([
      {
        ...scheme,
        eligibility: JSON.stringify(scheme.eligibility), // Convert eligibility to JSON string
      },
    ]);

    if (error) console.error('Error adding scheme:', error);
    else {
      alert('Scheme added successfully!');
      setScheme({
        schemeNumber: '',
        schemeName: '',
        description: '',
        eligibility: [],
        category: '',
        incomeRequired: '',
        ageGroup: '',
        startDate: '',
        lastDate: '',
        schemeUrl: '',  // Reset the new field

      });
      fetchSchemes();
      setActiveTab('showSchemes');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setScheme({ ...scheme, [name]: value });
  };

  const handleEligibilityChange = (e) => {
    const { value, checked } = e.target;
    setScheme((prevScheme) => ({
      ...prevScheme,
      eligibility: checked
        ? [...prevScheme.eligibility, value]
        : prevScheme.eligibility.filter((item) => item !== value),
    }));
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#f4f4f4', minHeight: '100vh', paddingBottom: '20px' }}>
      
      {/* Tabs */}
      <div style={{ textAlign: 'center', marginTop: '80px' }}>
        <button
          onClick={() => setActiveTab('addScheme')}
          style={{
            padding: '10px 20px',
            marginRight: '10px',
            borderRadius: '5px',
            border: 'none',
            backgroundColor: activeTab === 'addScheme' ? '#007bff' : '#ccc',
            color: activeTab === 'addScheme' ? 'white' : 'black',
            cursor: 'pointer',
          }}
        >
          Add Scheme
        </button>
        <button
          onClick={() => setActiveTab('showSchemes')}
          style={{
            padding: '10px 20px',
            borderRadius: '5px',
            border: 'none',
            backgroundColor: activeTab === 'showSchemes' ? '#007bff' : '#ccc',
            color: activeTab === 'showSchemes' ? 'white' : 'black',
            cursor: 'pointer',
          }}
        >
          Show Schemes
        </button>
      </div>

      {/* Add Scheme Form */}
      {activeTab === 'addScheme' && (
        <form onSubmit={handleSubmit} style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 0 10px rgba(0,0,0,0.1)', width: '50%', margin: '20px auto' }}>
          <label>Scheme Number:</label>
          <input type="text" name="schemeNumber" placeholder="Scheme Number" style={inputStyle} onChange={handleChange} value={scheme.schemeNumber} required />
          <label>Scheme Name:</label>
          <input type="text" name="schemeName" placeholder="Scheme Name" style={inputStyle} onChange={handleChange} value={scheme.schemeName} required />
          <label>Description:</label>
          <textarea name="description" placeholder="Description" style={{ ...inputStyle, height: '80px' }} onChange={handleChange} value={scheme.description} required />

          <label>Scheme URL:</label>
          <input type="url" name="schemeUrl" placeholder="Scheme URL" style={inputStyle} onChange={handleChange} value={scheme.schemeUrl} required />


          {/* Eligibility Checkboxes */}

          <div style={{ marginBottom: '10px' }}>
          <label style={{ fontWeight: 'bold' }}>Eligibility:</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '5px' }}>
              {eligibilityOptions.map((option) => (
                <label key={option} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <input type="checkbox" value={option} checked={scheme.eligibility.includes(option)} onChange={handleEligibilityChange} />
                  {option}
                </label>
              ))}
            </div>
          </div>

          <label>Category:</label>
          <input type="text" name="category" placeholder="Category(eg.student,farmer,NT/SC/ST,OBC)" style={inputStyle} onChange={handleChange} value={scheme.category} required />

          <label>Income Required:</label>
          <input type="number" name="incomeRequired" placeholder="Income Required (Rs.)" style={inputStyle} onChange={handleChange} value={scheme.incomeRequired} required />

          <label>Age Group:</label>
          <input type="text" name="ageGroup" placeholder="Age Group (eg.,21-60)" style={inputStyle} onChange={handleChange} value={scheme.ageGroup} required />

          <label>Start Date:</label>
          <input type="date" name="startDate" style={inputStyle} onChange={handleChange} value={scheme.startDate} required />

          <label>End Date:</label>
          <input type="date" name="lastDate" style={inputStyle} onChange={handleChange} value={scheme.lastDate} required />

          <button type="submit" style={submitButtonStyle}>Submit</button>
        </form>
      )}

      {/* Show Schemes */}
      {activeTab === 'showSchemes' && (
        <div style={{ width: '70%', margin: '20px auto' }}>
          <input type="text" placeholder="Filter by category" style={inputStyle} onChange={(e) => setFilterCategory(e.target.value)} />
          <div style={{ display: 'grid', gap: '15px' }}>
            {schemes
              .filter((scheme) => scheme.category.toLowerCase().includes(filterCategory.toLowerCase()))
              .map((scheme) => (
                <div key={scheme.id} style={schemeCardStyle}>
                  <h3 style={{ fontSize: '1.2em', fontWeight: 'bold' }}>{scheme.schemeName}</h3>
                  <p>{scheme.description}</p>
                  <p><strong>Scheme URL:</strong> <a href={scheme.schemeUrl} target="_blank" rel="noopener noreferrer">{scheme.schemeUrl}</a></p>

                  <p><strong>Category:</strong> {scheme.category}</p>
                  <p><strong>Income Required:</strong> {scheme.incomeRequired}</p>

                  <p><strong>Age Group:</strong> {scheme.ageGroup}</p>
                  <p><strong>Start Date:</strong> {scheme.startDate}</p>
                  <p><strong>Last Date:</strong> {scheme.lastDate}</p>
                  <p><strong>Eligibility:</strong> 
                  {(() => {
                    try {
                       const eligibilityArray = Array.isArray(scheme.eligibility) 
                            ? scheme.eligibility 
                            : JSON.parse(scheme.eligibility || '[]');
      
                            return Array.isArray(eligibilityArray) ? eligibilityArray.join(', ') : 'N/A';
                    } catch (error) {
                             console.error('Error parsing eligibility:', error);
                             return 'N/A';
                    }
                  })()}
                 </p>

                  {/* Delete Button */}
                  <button 
                    style={deleteButtonStyle} 
                    onClick={() => handleDelete(scheme.id)}
                  >
                    Delete
                  </button>

                  </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Styles
const inputStyle = { width: '99%', padding: '10px', border: '2px solid #ccc', marginBottom: '10px', borderRadius: '5px' };
const submitButtonStyle = { width: '100%', padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', marginTop: '10px' };
const schemeCardStyle = { backgroundColor: '#fff', padding: '15px', borderRadius: '8px', boxShadow: '0 0 10px rgba(0,0,0,0.1)' };
const deleteButtonStyle = { padding: '8px 15px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', marginTop: '10px' };

export default AdminDashboard;
