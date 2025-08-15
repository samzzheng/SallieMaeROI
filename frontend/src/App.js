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
    "Associate's Degree",
    "Bachelor's Degree", 
    "Doctoral Degree",
    "First Professional Degree",
    "Master's Degree"
  ];

  const majors = [
    "Accounting and Related Services.",
    "Advanced/Graduate Dentistry and Oral Sciences.",
    "Aerospace, Aeronautical and Astronautical Engineering.",
    "Agricultural Business and Management.",
    "Agricultural Engineering.",
    "Agricultural Mechanization.",
    "Agricultural Production Operations.",
    "Agricultural Public Services.",
    "Agricultural and Domestic Animal Services.",
    "Agricultural and Food Products Processing.",
    "Agriculture, Agriculture Operations, and Related Sciences, Other.",
    "Agriculture, General.",
    "Agriculture/Veterinary Preparatory Programs.",
    "Air Transportation.",
    "Allied Health Diagnostic, Intervention, and Treatment Professions.",
    "Allied Health and Medical Assisting Services.",
    "Alternative and Complementary Medicine and Medical Systems.",
    "American Sign Language.",
    "Animal Sciences.",
    "Anthropology.",
    "Apparel and Textiles.",
    "Applied Horticulture and Horticultural Business Services.",
    "Applied Mathematics.",
    "Archeology.",
    "Architectural Engineering Technologies/Technicians.",
    "Architectural Engineering.",
    "Architectural Sciences and Technology.",
    "Architecture and Related Services, Other.",
    "Architecture.",
    "Area Studies.",
    "Arts, Entertainment,and Media Management.",
    "Astronomy and Astrophysics.",
    "Atmospheric Sciences and Meteorology.",
    "Audiovisual Communications Technologies/Technicians.",
    "Basic Skills and Developmental/Remedial Education.",
    "Behavioral Sciences.",
    "Bible/Biblical Studies.",
    "Bilingual, Multilingual, and Multicultural Education.",
    "Biochemical Engineering.",
    "Biochemistry, Biophysics and Molecular Biology.",
    "Bioethics/Medical Ethics.",
    "Biological and Biomedical Sciences, Other.",
    "Biological and Physical Sciences.",
    "Biological/Biosystems Engineering.",
    "Biology Technician/Biotechnology Laboratory Technician.",
    "Biology, General.",
    "Biomathematics, Bioinformatics, and Computational Biology.",
    "Biomedical/Medical Engineering.",
    "Biopsychology.",
    "Biotechnology.",
    "Botany/Plant Biology.",
    "Building/Construction Finishing, Management, and Inspection.",
    "Business Administration, Management and Operations.",
    "Business Operations Support and Assistant Services.",
    "Business, Management, Marketing, and Related Support Services, Other.",
    "Business/Commerce, General.",
    "Business/Corporate Communications.",
    "Business/Managerial Economics.",
    "Carpenters.",
    "Cell/Cellular Biology and Anatomical Sciences.",
    "Chemical Engineering.",
    "Chemistry.",
    "Chiropractic.",
    "City/Urban, Community and Regional Planning.",
    "Civil Engineering Technologies/Technicians.",
    "Civil Engineering.",
    "Classical and Ancient Studies.",
    "Classics and Classical Languages, Literatures, and Linguistics.",
    "Clinical, Counseling and Applied Psychology.",
    "Clinical/Medical Laboratory Science/Research and Allied Professions.",
    "Cognitive Science.",
    "Communication Disorders Sciences and Services.",
    "Communication and Media Studies.",
    "Communication, Journalism, and Related Programs, Other.",
    "Communications Technologies/Technicians and Support Services, Other.",
    "Communications Technology/Technician.",
    "Community Organization and Advocacy.",
    "Computer Engineering Technologies/Technicians.",
    "Computer Engineering.",
    "Computer Programming.",
    "Computer Science.",
    "Computer Software and Media Applications.",
    "Computer Systems Analysis.",
    "Computer Systems Networking and Telecommunications.",
    "Computer and Information Sciences and Support Services, Other.",
    "Computer and Information Sciences, General.",
    "Computer/Information Technology Administration and Management.",
    "Construction Engineering Technologies.",
    "Construction Engineering.",
    "Construction Management.",
    "Construction Trades, General.",
    "Construction Trades, Other.",
    "Cosmetology and Related Personal Grooming Services.",
    "Crafts/Craft Design, Folk Art and Artisanry.",
    "Criminal Justice and Corrections.",
    "Criminology.",
    "Culinary Arts and Related Services.",
    "Cultural Studies/Critical Theory and Analysis.",
    "Curriculum and Instruction.",
    "Dance.",
    "Data Entry/Microcomputer Applications.",
    "Data Processing.",
    "Dental Residency Programs.",
    "Dental Support Services and Allied Professions.",
    "Dentistry.",
    "Design and Applied Arts.",
    "Dietetics and Clinical Nutrition Services.",
    "Dispute Resolution.",
    "Drafting/Design Engineering Technologies/Technicians.",
    "Drama/Theatre Arts and Stagecraft.",
    "East Asian Languages, Literatures, and Linguistics.",
    "Ecology, Evolution, Systematics, and Population Biology.",
    "Economics.",
    "Education, General.",
    "Education, Other.",
    "Educational Administration and Supervision.",
    "Educational Assessment, Evaluation, and Research.",
    "Educational/Instructional Media Design.",
    "Electrical Engineering Technologies/Technicians.",
    "Electrical and Power Transmission Installers.",
    "Electrical, Electronics and Communications Engineering.",
    "Electrical/Electronics Maintenance and Repair Technology.",
    "Electromechanical Engineering.",
    "Electromechanical Instrumentation and Maintenance Technologies/Technicians.",
    "Energy Systems Technologies/Technicians.",
    "Engineering Mechanics.",
    "Engineering Physics.",
    "Engineering Science.",
    "Engineering Technologies/Technicians, Other.",
    "Engineering Technology, General.",
    "Engineering, General.",
    "Engineering, Other.",
    "Engineering-Related Fields.",
    "Engineering-Related Technologies.",
    "English Language and Literature, General.",
    "English Language and Literature/Letters, Other.",
    "Entrepreneurial and Small Business Operations.",
    "Environmental Control Technologies/Technicians.",
    "Environmental Design.",
    "Environmental/Environmental Health Engineering.",
    "Ethnic, Cultural Minority, Gender, and Group Studies.",
    "Family and Consumer Economics and Related Studies.",
    "Family and Consumer Sciences/Human Sciences Business Services.",
    "Family and Consumer Sciences/Human Sciences, General.",
    "Film/Video and Photographic Arts.",
    "Finance and Financial Management Services.",
    "Fine and Studio Arts.",
    "Fire Protection.",
    "Fishing and Fisheries Sciences and Management.",
    "Food Science and Technology.",
    "Foods, Nutrition, and Related Services.",
    "Foreign Languages, Literatures, and Linguistics, Other.",
    "Forest Engineering.",
    "Forestry.",
    "Funeral Service and Mortuary Science.",
    "General Sales, Merchandising and Related Marketing Operations.",
    "Genetics.",
    "Geography and Cartography.",
    "Geological and Earth Sciences/Geosciences.",
    "Geological/Geophysical Engineering.",
    "Germanic Languages, Literatures, and Linguistics.",
    "Gerontology.",
    "Graphic Communications.",
    "Ground Transportation.",
    "Health Aides/Attendants/Orderlies.",
    "Health Professions and Related Clinical Sciences, Other.",
    "Health Services/Allied Health/Health Sciences, General.",
    "Health and Medical Administrative Services.",
    "Health and Physical Education/Fitness.",
    "Health-Related Knowledge and Skills.",
    "Health/Medical Preparatory Programs.",
    "Heating, Air Conditioning, Ventilation and Refrigeration Maintenance Technology/Technician (HAC, HACR, HVAC, HVACR).",
    "Heavy/Industrial Equipment Maintenance Technologies.",
    "High School/Secondary Diploma Programs.",
    "Historic Preservation and Conservation.",
    "History.",
    "Homeland Security, Law Enforcement, Firefighting and Related Protective Services, Other.",
    "Homeland Security.",
    "Hospitality Administration/Management.",
    "Housing and Human Environments.",
    "Human Biology.",
    "Human Computer Interaction.",
    "Human Development, Family Studies, and Related Services.",
    "Human Resources Management and Services.",
    "Human Services, General.",
    "Industrial Engineering.",
    "Industrial Production Technologies/Technicians.",
    "Information Science/Studies.",
    "Insurance.",
    "Intelligence, Command Control and Information Operations.",
    "Intercultural/Multicultural and Diversity Studies.",
    "Interior Architecture.",
    "International Agriculture.",
    "International Business.",
    "International Relations and National Security Studies.",
    "International and Comparative Education.",
    "International/Global Studies.",
    "Journalism.",
    "Landscape Architecture.",
    "Law.",
    "Legal Professions and Studies, Other.",
    "Legal Research and Advanced Professional Studies.",
    "Legal Support Services.",
    "Leisure and Recreational Activities.",
    "Liberal Arts and Sciences, General Studies and Humanities.",
    "Library Science and Administration.",
    "Library Science, Other.",
    "Library and Archives Assisting.",
    "Linguistic, Comparative, and Related Language Studies and Services.",
    "Literature.",
    "Management Information Systems and Services.",
    "Management Sciences and Quantitative Methods.",
    "Manufacturing Engineering.",
    "Marine Sciences.",
    "Marine Transportation.",
    "Marketing.",
    "Materials Engineering",
    "Materials Sciences.",
    "Mathematics and Computer Science.",
    "Mathematics and Statistics, Other.",
    "Mathematics.",
    "Mechanic and Repair Technologies/Technicians, Other.",
    "Mechanical Engineering Related Technologies/Technicians.",
    "Mechanical Engineering.",
    "Mechatronics, Robotics, and Automation Engineering.",
    "Medical Clinical Sciences/Graduate Medical Studies.",
    "Medical Illustration and Informatics.",
    "Medicine.",
    "Mental and Social Health Services and Allied Professions.",
    "Metallurgical Engineering.",
    "Microbiological Sciences and Immunology.",
    "Middle/Near Eastern and Semitic Languages, Literatures, and Linguistics.",
    "Military Technologies and Applied Sciences, Other.",
    "Mining and Mineral Engineering.",
    "Mining and Petroleum Technologies/Technicians.",
    "Movement and Mind-Body Therapies and Education.",
    "Multi-/Interdisciplinary Studies, General.",
    "Multi/Interdisciplinary Studies, Other.",
    "Museology/Museum Studies.",
    "Music.",
    "Natural Resources Conservation and Research.",
    "Natural Resources Management and Policy.",
    "Natural Resources and Conservation, Other.",
    "Natural Sciences.",
    "Naval Architecture and Marine Engineering.",
    "Neurobiology and Neurosciences.",
    "Non-Professional General Legal Studies (Undergraduate).",
    "Nuclear Engineering Technologies/Technicians.",
    "Nuclear Engineering.",
    "Nuclear and Industrial Radiologic Technologies/Technicians.",
    "Nursing.",
    "Nutrition Sciences.",
    "Ocean Engineering.",
    "Operations Research.",
    "Ophthalmic and Optometric Support Services and Allied Professions.",
    "Optometry.",
    "Outdoor Education.",
    "Parks, Recreation and Leisure Facilities Management.",
    "Parks, Recreation and Leisure Studies.",
    "Parks, Recreation, Leisure, and Fitness Studies, Other.",
    "Pastoral Counseling and Specialized Ministries.",
    "Peace Studies and Conflict Resolution.",
    "Petroleum Engineering.",
    "Pharmacology and Toxicology.",
    "Pharmacy, Pharmaceutical Sciences, and Administration.",
    "Philosophy and Religious Studies, Other.",
    "Philosophy.",
    "Physical Science Technologies/Technicians.",
    "Physical Sciences, Other.",
    "Physical Sciences.",
    "Physics.",
    "Physiology, Pathology and Related Sciences.",
    "Plant Sciences.",
    "Plumbing and Related Water Supply Services.",
    "Political Science and Government.",
    "Polymer/Plastics Engineering.",
    "Practical Nursing, Vocational Nursing and Nursing Assistants.",
    "Precision Metal Working.",
    "Precision Systems Maintenance and Repair Technologies.",
    "Psychology, General.",
    "Psychology, Other.",
    "Public Administration and Social Service Professions, Other.",
    "Public Administration.",
    "Public Health.",
    "Public Policy Analysis.",
    "Public Relations, Advertising, and Applied Communication.",
    "Publishing.",
    "Quality Control and Safety Technologies/Technicians.",
    "Radio, Television, and Digital Communication.",
    "Real Estate Development.",
    "Real Estate.",
    "Registered Nursing, Nursing Administration, Nursing Research and Clinical Nursing.",
    "Rehabilitation and Therapeutic Professions.",
    "Religion/Religious Studies.",
    "Religious Education.",
    "Religious/Sacred Music.",
    "Research and Experimental Psychology.",
    "Rhetoric and Composition/Writing Studies.",
    "Romance Languages, Literatures, and Linguistics.",
    "Science Technologies/Technicians, Other.",
    "Science, Technology and Society.",
    "Security Policy and Strategy.",
    "Security Science and Technology.",
    "Slavic, Baltic and Albanian Languages, Literatures, and Linguistics.",
    "Social Sciences, General.",
    "Social Sciences, Other.",
    "Social Work.",
    "Social and Philosophical Foundations of Education.",
    "Sociology and Anthropology.",
    "Sociology.",
    "Soil Sciences.",
    "Somatic Bodywork and Related Therapeutic Services.",
    "Special Education and Teaching.",
    "Specialized Sales, Merchandising and  Marketing Operations.",
    "Statistics.",
    "Student Counseling and Personnel Services.",
    "Sustainability Studies.",
    "Systems Engineering.",
    "Systems Science and Theory.",
    "Taxation.",
    "Teacher Education and Professional Development, Specific Levels and Methods.",
    "Teacher Education and Professional Development, Specific Subject Areas.",
    "Teaching Assistants/Aides.",
    "Teaching English or French as a Second or Foreign Language.",
    "Textile Sciences and Engineering.",
    "Theological and Ministerial Studies.",
    "Theology and Religious Vocations, Other.",
    "Urban Studies/Affairs.",
    "Vehicle Maintenance and Repair Technologies.",
    "Veterinary Biomedical and Clinical Sciences.",
    "Veterinary Medicine.",
    "Veterinary/Animal Health Technologies/Technicians.",
    "Visual and Performing Arts, General.",
    "Visual and Performing Arts, Other.",
    "Wildlife and Wildlands Science and Management.",
    "Woodworking.",
    "Zoology/Animal Biology."
  ];

  const controlTypes = [
    'Foreign',
    'Private, for-profit',
    'Private, nonprofit',
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
      setPrediction(data);
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
                {formatCurrency(prediction.predicted_income)}
              </div>
              
              <div className="prediction-range">
                <h3>Typical Range:</h3>
                <div className="range-values">
                  {formatCurrency(prediction.range_low)} - {formatCurrency(prediction.range_high)}
                </div>
                <div className="range-explanation">
                  This range accounts for natural variation in earnings outcomes. 
                  Most graduates with similar backgrounds earn within this range.
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;