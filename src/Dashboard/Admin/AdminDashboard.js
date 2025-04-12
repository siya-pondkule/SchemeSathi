import React, { useEffect, useState } from 'react';
import { FaPlus, FaEye, FaTrashAlt, FaLink, FaFilter, FaUserCircle } from 'react-icons/fa';
import { MdLogout } from 'react-icons/md';
import supabase from '../../Supabase/supabase';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('addScheme');
  const [schemes, setSchemes] = useState([]);
  const [filterCategory, setFilterCategory] = useState('');
  const [adminProfile, setAdminProfile] = useState(null);
const [showProfile, setShowProfile] = useState(false);

useEffect(() => {
  fetchAdminProfile();
}, []);

const fetchAdminProfile = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) {
    console.error('Error fetching user:', error);
  } else {
    setAdminProfile(user);
  }
};

const handleLogout = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error('Error logging out:', error);
  } else {
    window.location.href = '/'; // Redirect to login or home
  }
};

  const [scheme, setScheme] = useState({
    schemeNumber: '',
    schemeName: '',
    description: '',
    eligibility: [],
    category: '',
    incomeRequired: '',
    ageGroup: '',
    startDate: '',
    lastDate: '',
    schemeUrl: '',
  });

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
      setSchemes(schemes.filter((scheme) => scheme.id !== id));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.from('schemes').insert([
      {
        ...scheme,
        eligibility: JSON.stringify(scheme.eligibility),
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
        schemeUrl: '',
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
    setScheme((prev) => ({
      ...prev,
      eligibility: checked
        ? [...prev.eligibility, value]
        : prev.eligibility.filter((item) => item !== value),
    }));
  };

  return (
    
    
    <div style={{ fontFamily: 'Segoe UI, sans-serif', backgroundColor: '#f4f7fa', minHeight: '100vh', paddingBottom: '40px' }}>

      {/* Profile Section */}
      {adminProfile && (
        <div style={profileContainerStyle}>
          <FaUserCircle size={100} color="#007bff" />
          <div>
            <h3 style={{ margin: 0 }}>{adminProfile.user_metadata?.name || 'Admin'}</h3>
            <p style={{ margin: 0 }}>{adminProfile.email}</p>
          </div>
          <button onClick={handleLogout} style={logoutButtonStyle}>
            <MdLogout style={{ marginRight: '6px' }} />
            Logout
          </button>
        </div>
      )}


{showProfile && adminProfile && (
  <div
    style={{
      position: 'absolute',
      top: '80px',
      right: '40px',
      backgroundColor: '#ffffff',
      padding: '30px',
      borderRadius: '16px',
      boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
      width: '1050px',
      zIndex: 1000,
      fontSize: '16px',
    }}
  >
    <h2 style={{ color: '#007bff', marginBottom: '15px', fontSize: '24px' }}>Admin Info</h2>
    <p><strong style={{ fontSize: '17px' }}>Email:</strong><br />{adminProfile.email}</p>
    <p><strong style={{ fontSize: '17px' }}>ID:</strong><br />{adminProfile.id}</p>
    <button
      onClick={handleLogout}
      style={{
        marginTop: '20px',
        backgroundColor: '#dc3545',
        color: '#fff',
        padding: '14px 20px',
        fontSize: '17px',
        border: 'none',
        borderRadius: '10px',
        cursor: 'pointer',
        fontWeight: 'bold',
        width: '100%',
      }}
    >
      Logout
    </button>
  </div>
)}



      <div style={{ textAlign: 'center', marginTop: '60px' }}>
        <button
          onClick={() => setActiveTab('addScheme')}
          style={{
            ...tabButtonStyle,
            backgroundColor: activeTab === 'addScheme' ? '#007bff' : '#ccc',
            color: activeTab === 'addScheme' ? '#fff' : '#333',
            marginTop: '30px',
          }}
        >
          <FaPlus style={{ marginRight: '8px' }} />
          Add Scheme
        </button>
        <button
          onClick={() => setActiveTab('showSchemes')}
          style={{
            ...tabButtonStyle,
            backgroundColor: activeTab === 'showSchemes' ? '#007bff' : '#ccc',
            color: activeTab === 'showSchemes' ? '#fff' : '#333',
          }}
        >
          <FaEye style={{ marginRight: '8px' }} />
          Show Schemes
        </button>
      </div>


      {activeTab === 'addScheme' && (
        <form
          onSubmit={handleSubmit}
          style={{
            backgroundColor: '#fff',
            padding: '25px',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            width: '60%',
            margin: '30px auto',
            transition: 'transform 0.3s ease',
          }}
        >
          <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#007bff' }}>Add New Scheme</h2>
          <label>Scheme Number:</label>
          <input
            type="text"
            name="schemeNumber"
            style={inputStyle}
            onChange={handleChange}
            value={scheme.schemeNumber}
            required
          />
          <label>Scheme Name:</label>
          <input
            type="text"
            name="schemeName"
            style={inputStyle}
            onChange={handleChange}
            value={scheme.schemeName}
            required
          />
          <label>Description:</label>
          <textarea
            name="description"
            style={{ ...inputStyle, height: '90px' }}
            onChange={handleChange}
            value={scheme.description}
            required
          />
          <label>Scheme URL:</label>
          <input
            type="url"
            name="schemeUrl"
            style={inputStyle}
            onChange={handleChange}
            value={scheme.schemeUrl}
            required
          />

          <div style={{ margin: '10px 0' }}>
            <label style={{ fontWeight: 'bold' }}>Eligibility:</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '8px' }}>
              {eligibilityOptions.map((option) => (
                <label key={option} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <input
                    type="checkbox"
                    value={option}
                    checked={scheme.eligibility.includes(option)}
                    onChange={handleEligibilityChange}
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>

          <label>Category:</label>
          <input
            type="text"
            name="category"
            style={inputStyle}
            onChange={handleChange}
            value={scheme.category}
            required
          />
          <label>Income Required:</label>
          <input
            type="number"
            name="incomeRequired"
            style={inputStyle}
            onChange={handleChange}
            value={scheme.incomeRequired}
            required
          />
          <label>Age Group:</label>
          <input
            type="text"
            name="ageGroup"
            style={inputStyle}
            onChange={handleChange}
            value={scheme.ageGroup}
            required
          />
          <label>Start Date:</label>
          <input
            type="date"
            name="startDate"
            style={inputStyle}
            onChange={handleChange}
            value={scheme.startDate}
            required
          />
          <label>End Date:</label>
          <input
            type="date"
            name="lastDate"
            style={inputStyle}
            onChange={handleChange}
            value={scheme.lastDate}
            required
          />

          <button type="submit" style={submitButtonStyle}>Submit Scheme</button>
        </form>
      )}

      {activeTab === 'showSchemes' && (
        <div style={{ width: '80%', margin: '30px auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
            <FaFilter style={{ marginRight: '10px', fontSize: '18px', color: '#007bff' }} />
            <input
              type="text"
              placeholder="Filter by category..."
              style={{ ...inputStyle, width: '100%' }}
              onChange={(e) => setFilterCategory(e.target.value)}
            />
          </div>
          <div style={{ display: 'grid', gap: '20px' }}>
            {schemes
              .filter((s) => s.category.toLowerCase().includes(filterCategory.toLowerCase()))
              .map((s) => (
                <div key={s.id} style={schemeCardStyle}>
                  <h3 style={{ fontSize: '1.4em', color: '#007bff' }}>{s.schemeName}</h3>
                  <p>{s.description}</p>
                  <p>
                    <strong>URL:</strong>{' '}
                    <a href={s.schemeUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#28a745' }}>
                      <FaLink style={{ marginRight: '5px' }} />
                      {s.schemeUrl}
                    </a>
                  </p>
                  <p><strong>Category:</strong> {s.category}</p>
                  <p><strong>Income Required:</strong> ₹{s.incomeRequired}</p>
                  <p><strong>Age Group:</strong> {s.ageGroup}</p>
                  <p><strong>Start Date:</strong> {s.startDate}</p>
                  <p><strong>Last Date:</strong> {s.lastDate}</p>
                  <p>
                    <strong>Eligibility:</strong>{' '}
                    {(() => {
                      try {
                        const eligibilityArray = Array.isArray(s.eligibility)
                          ? s.eligibility
                          : JSON.parse(s.eligibility || '[]');
                        return eligibilityArray.join(', ');
                      } catch (error) {
                        console.error('Error parsing eligibility:', error);
                        return 'N/A';
                      }
                    })()}
                  </p>
                  <button style={deleteButtonStyle} onClick={() => handleDelete(s.id)}>
                    <FaTrashAlt style={{ marginRight: '6px' }} />
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
const inputStyle = {
  width: '100%',
  padding: '10px',
  border: '2px solid #ddd',
  marginBottom: '10px',
  borderRadius: '6px',
  transition: '0.2s',
  outline: 'none',
};

inputStyle[':focus'] = {
  borderColor: '#007bff',
};

const submitButtonStyle = {
  width: '100%',
  padding: '12px',
  backgroundColor: '#007bff',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  fontWeight: 'bold',
  transition: '0.3s',
};
submitButtonStyle[':hover'] = {
  backgroundColor: '#0056b3',
};

const schemeCardStyle = {
  backgroundColor: '#ffffff',
  padding: '20px',
  borderRadius: '10px',
  boxShadow: '0 6px 18px rgba(0,0,0,0.1)',
  transition: 'transform 0.2s',
  cursor: 'pointer',
};

schemeCardStyle[':hover'] = {
  transform: 'scale(1.01)',
};

const deleteButtonStyle = {
  padding: '10px 16px',
  backgroundColor: '#dc3545',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  fontWeight: 'bold',
  marginTop: '10px',
};

const tabButtonStyle = {
  padding: '12px 22px',
  marginRight: '10px',
  borderRadius: '6px',
  border: 'none',
  cursor: 'pointer',
  fontSize: '16px',
  transition: 'all 0.3s ease',
};

const profileContainerStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '20px',
  backgroundColor: '#fff',
  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
  borderRadius: '10px',
  margin: '20px',
};

const logoutButtonStyle = {
  backgroundColor: '#dc3545',
  color: '#fff',
  padding: '10px 16px',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  fontWeight: 'bold',
};


export default AdminDashboard;
