import React, { useState } from 'react';
import './App.css';

function App() {
  const [formData, setFormData] = useState({
    degree_type: '',
    major_field: '',
    control_type: '',
    state: ''
  });
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const degreeTypes = [
    'Associate_Degree',
    'Bachelor_Degree',
    'Certificate_1_Year',
    'Certificate_2_Year',
    'Certificate_4_Year'
  ];

  const majors = [
    'Agriculture_Natural_Resources',
    'Architecture',
    'Area_Ethnic_Cultural_Studies',
    'Biological_Life_Sciences',
    'Business_Management_Marketing',
    'Communication_Journalism',
    'Communications_Technologies',
    'Computer_Information_Sciences',
    'Construction_Trades',
    'Education',
    'Engineering',
    'Engineering_Technologies',
    'English_Language_Literature',
    'Family_Consumer_Sciences',
    'Foreign_Languages_Literature',
    'Health_Professions',
    'History',
    'Homeland_Security_Law_Enforcement',
    'Legal_Professions_Studies',
    'Liberal_Arts_General_Studies',
    'Library_Science',
    'Mathematics_Statistics',
    'Mechanic_Repair_Technologies',
    'Military_Technologies',
    'Multi_Interdisciplinary_Studies',
    'Natural_Resources_Conservation',
    'Parks_Recreation_Leisure',
    'Personal_Culinary_Services',
    'Philosophy_Religious_Studies',
    'Physical_Sciences',
    'Precision_Production',
    'Psychology',
    'Public_Administration_Social_Service',
    'Science_Technologies',
    'Social_Sciences',
    'Theology_Religious_Vocations',
    'Transportation_Materials_Moving',
    'Visual_Performing_Arts'
  ];

  const controlTypes = [
    'Private_ForProfit',
    'Private_Nonprofit',
    'Public'
  ];

  const states = [
    'AK', 'AL', 'AR', 'AS', 'AZ', 'CA', 'CO', 'CT', 'DC', 'DE', 'FL', 'FM',
    'GA', 'GU', 'HI', 'IA', 'ID', 'IL', 'IN', 'KS', 'KY', 'LA', 'MA', 'MD',
    'ME', 'MI', 'MN', 'MO', 'MP', 'MS', 'MT', 'NC', 'ND', 'NE', 'NH', 'NJ',
    'NM', 'NV', 'NY', 'OH', 'OK', 'OR', 'PA', 'PR', 'PW', 'RI', 'SC', 'SD',
    'TN', 'TX', 'UT', 'VA', 'VI', 'VT', 'WA', 'WI', 'WV', 'WY'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
    setPrediction(null);
  };

  const isFormValid = () => {
    return Object.values(formData).every(value => value !== '');
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid()) return;

    setLoading(true);
    setError('');
    setPrediction(null);

    try {
            const response = await fetch('/predict_roi', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setPrediction(data.predicted_income);
    } catch (err) {
      setError('Failed to get prediction. Please try again.');
      console.error('Prediction error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src="/sallie_mae.png" alt="Sallie Mae Logo" className="logo" />
        <h1>College ROI Calculator</h1>
      </header>
      
      <main className="App-main">
        <div className="form-container">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="degree_type">Degree Type:</label>
              <select
                id="degree_type"
                name="degree_type"
                value={formData.degree_type}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Degree Type</option>
                {degreeTypes.map(type => (
                  <option key={type} value={type}>
                    {type.replace(/_/g, ' ')}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="major_field">Major Field:</label>
              <select
                id="major_field"
                name="major_field"
                value={formData.major_field}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Major Field</option>
                {majors.map(major => (
                  <option key={major} value={major}>
                    {major.replace(/_/g, ' ')}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="control_type">School Type:</label>
              <select
                id="control_type"
                name="control_type"
                value={formData.control_type}
                onChange={handleInputChange}
                required
              >
                <option value="">Select School Type</option>
                {controlTypes.map(type => (
                  <option key={type} value={type}>
                    {type.replace(/_/g, ' ')}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="state">State:</label>
              <select
                id="state"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                required
              >
                <option value="">Select State</option>
                {states.map(state => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>

            <button 
              type="submit" 
              className="calculate-btn"
              disabled={!isFormValid() || loading}
            >
              {loading ? 'Calculating...' : 'Calculate ROI'}
            </button>
          </form>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {prediction !== null && (
            <div className="results">
              <h2>Predicted Median Income:</h2>
              <div className="prediction-value">
                {formatCurrency(prediction)}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;