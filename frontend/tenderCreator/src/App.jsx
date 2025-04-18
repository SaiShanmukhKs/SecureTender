import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';

// Mock data for initial development
const initialTenders = [
  {
    id: 1,
    title: "Office Supplies Procurement",
    description: "Supply of stationery and office consumables for Q1 2025",
    deadline: "2025-03-15",
    status: "Open",
    bidders: [
      { id: 101, name: "OfficeMax Inc.", bid: 12500, rating: 4.5 },
      { id: 102, name: "Stationery Plus", bid: 13800, rating: 4.8 },
      { id: 103, name: "Business Supplies Co.", bid: 11900, rating: 3.9 }
    ],
    awardedTo: null
  },
  {
    id: 2,
    title: "IT Hardware Maintenance",
    description: "Annual maintenance contract for server infrastructure",
    deadline: "2025-03-10",
    status: "Open",
    bidders: [
      { id: 201, name: "TechCare Solutions", bid: 45000, rating: 4.7 },
      { id: 202, name: "ServerPro Maintenance", bid: 42000, rating: 4.2 },
      { id: 203, name: "IT Support 365", bid: 48000, rating: 4.9 }
    ],
    awardedTo: null
  },
  {
    id: 3,
    title: "Cafeteria Services",
    description: "Providing cafeteria services for 100 employees",
    deadline: "2025-02-28",
    status: "Awarded",
    bidders: [
      { id: 301, name: "Food Delights", bid: 35000, rating: 4.6 },
      { id: 302, name: "Tasty Bites Catering", bid: 32000, rating: 4.3 },
      { id: 303, name: "Corporate Meals Inc.", bid: 38000, rating: 4.8 }
    ],
    awardedTo: 303
  }
];

function App() {
  return (
    <Router>
      <div className="app-container">
        <nav className="navbar">
          <div className="navbar-brand">Tender Management System</div>
          <ul className="navbar-nav">
            <li><Link to="/">Dashboard</Link></li>
            <li><Link to="/create">Create Tender</Link></li>
            <li><Link to="/all-tenders">All Tenders</Link></li>
            <li><Link to="/awarded-tenders">Awarded Tenders</Link></li>
          </ul>
        </nav>
        
        <div className="content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/create" element={<CreateTender />} />
            <Route path="/all-tenders" element={<AllTenders />} />
            <Route path="/awarded-tenders" element={<AwardedTenders />} />
            <Route path="/tender/:id" element={<TenderDetail />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

// TenderContext to manage state globally
const TenderContext = React.createContext();

function TenderProvider({ children }) {
  const [tenders, setTenders] = useState(initialTenders);
  
  const addTender = (newTender) => {
    const tender = {
      ...newTender,
      id: tenders.length + 1,
      status: "Open",
      bidders: [],
      awardedTo: null
    };
    setTenders([...tenders, tender]);
  };
  
  const awardTender = (tenderId, bidderId) => {
    setTenders(
      tenders.map(tender => 
        tender.id === tenderId 
          ? { ...tender, status: "Awarded", awardedTo: bidderId } 
          : tender
      )
    );
  };
  
  // For demo purposes - add mock bidders to a tender
  const addMockBidders = (tenderId) => {
    const mockBidders = [
      { id: Math.floor(Math.random() * 1000), name: "Vendor A", bid: Math.floor(Math.random() * 10000) + 10000, rating: (Math.random() * 2) + 3 },
      { id: Math.floor(Math.random() * 1000), name: "Vendor B", bid: Math.floor(Math.random() * 10000) + 10000, rating: (Math.random() * 2) + 3 },
      { id: Math.floor(Math.random() * 1000), name: "Vendor C", bid: Math.floor(Math.random() * 10000) + 10000, rating: (Math.random() * 2) + 3 }
    ];
    
    setTenders(
      tenders.map(tender => 
        tender.id === tenderId 
          ? { ...tender, bidders: mockBidders } 
          : tender
      )
    );
  };
  
  return (
    <TenderContext.Provider value={{ tenders, addTender, awardTender, addMockBidders }}>
      {children}
    </TenderContext.Provider>
  );
}

// Wrap the App in the TenderProvider
function AppWithProvider() {
  return (
    <TenderProvider>
      <App />
    </TenderProvider>
  );
}

// Dashboard Component
function Dashboard() {
  const { tenders } = React.useContext(TenderContext);
  
  const openTenders = tenders.filter(tender => tender.status === "Open").length;
  const awardedTenders = tenders.filter(tender => tender.status === "Awarded").length;
  
  return (
    <div className="dashboard">
      <h1>Tender Management Dashboard</h1>
      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Open Tenders</h3>
          <p className="stat-value">{openTenders}</p>
          <Link to="/all-tenders" className="stat-link">View All</Link>
        </div>
        <div className="stat-card">
          <h3>Awarded Tenders</h3>
          <p className="stat-value">{awardedTenders}</p>
          <Link to="/awarded-tenders" className="stat-link">View All</Link>
        </div>
        <div className="stat-card">
          <h3>Total Tenders</h3>
          <p className="stat-value">{tenders.length}</p>
          <Link to="/create" className="stat-link">Create New</Link>
        </div>
      </div>
      
      <div className="recent-tenders">
        <h2>Recent Tenders</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Deadline</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tenders.slice(0, 5).map(tender => (
              <tr key={tender.id}>
                <td>{tender.id}</td>
                <td>{tender.title}</td>
                <td>{tender.deadline}</td>
                <td><span className={`status ${tender.status.toLowerCase()}`}>{tender.status}</span></td>
                <td>
                  <Link to={`/tender/${tender.id}`} className="btn btn-view">View</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Create Tender Component
function CreateTender() {
  const { addTender } = React.useContext(TenderContext);
  const navigate = useNavigate();
  const [tender, setTender] = useState({
    title: "",
    description: "",
    deadline: ""
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTender({
      ...tender,
      [name]: value
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    addTender(tender);
    navigate("/all-tenders");
  };
  
  return (
    <div className="create-tender">
      <h1>Create New Tender</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Tender Title</label>
          <input 
            type="text" 
            id="title" 
            name="title" 
            value={tender.title} 
            onChange={handleChange} 
            required 
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea 
            id="description" 
            name="description" 
            value={tender.description} 
            onChange={handleChange} 
            required 
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="deadline">Submission Deadline</label>
          <input 
            type="date" 
            id="deadline" 
            name="deadline" 
            value={tender.deadline} 
            onChange={handleChange} 
            required 
          />
        </div>
        
        <button type="submit" className="btn btn-primary">Create Tender</button>
      </form>
    </div>
  );
}

// All Tenders Component
function AllTenders() {
  const { tenders } = React.useContext(TenderContext);
  
  return (
    <div className="all-tenders">
      <h1>All Tenders</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Deadline</th>
            <th>Status</th>
            <th>Bidders</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tenders.map(tender => (
            <tr key={tender.id}>
              <td>{tender.id}</td>
              <td>{tender.title}</td>
              <td>{tender.deadline}</td>
              <td><span className={`status ${tender.status.toLowerCase()}`}>{tender.status}</span></td>
              <td>{tender.bidders.length}</td>
              <td>
                <Link to={`/tender/${tender.id}`} className="btn btn-view">View</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Awarded Tenders Component
function AwardedTenders() {
  const { tenders } = React.useContext(TenderContext);
  const awardedTenders = tenders.filter(tender => tender.status === "Awarded");
  
  return (
    <div className="awarded-tenders">
      <h1>Awarded Tenders</h1>
      {awardedTenders.length === 0 ? (
        <p>No tenders have been awarded yet.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Deadline</th>
              <th>Awarded To</th>
              <th>Bid Amount</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {awardedTenders.map(tender => {
              const awardedBidder = tender.bidders.find(bidder => bidder.id === tender.awardedTo);
              return (
                <tr key={tender.id}>
                  <td>{tender.id}</td>
                  <td>{tender.title}</td>
                  <td>{tender.deadline}</td>
                  <td>{awardedBidder ? awardedBidder.name : "N/A"}</td>
                  <td>${awardedBidder ? awardedBidder.bid.toLocaleString() : "N/A"}</td>
                  <td>
                    <Link to={`/tender/${tender.id}`} className="btn btn-view">View</Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

// Tender Detail Component
function TenderDetail() {
  const { tenders, awardTender, addMockBidders } = React.useContext(TenderContext);
  const navigate = useNavigate();
  const { id } = useParams();
  const tenderId = parseInt(id);
  
  const tender = tenders.find(t => t.id === tenderId);
  
  if (!tender) {
    return <div>Tender not found</div>;
  }
  
  // Sort bidders by a combination of rating and bid price
  const sortedBidders = [...tender.bidders].sort((a, b) => {
    // Create a score that values higher ratings and lower bids
    const scoreA = (a.rating * 10000) / a.bid;
    const scoreB = (b.rating * 10000) / b.bid;
    return scoreB - scoreA; // Higher score first
  });
  
  const handleAward = (bidderId) => {
    awardTender(tenderId, bidderId);
    navigate("/awarded-tenders");
  };
  
  const handleAddBidders = () => {
    addMockBidders(tenderId);
  };
  
  const awardedBidder = tender.awardedTo 
    ? tender.bidders.find(bidder => bidder.id === tender.awardedTo) 
    : null;
  
  return (
    <div className="tender-detail">
      <h1>Tender Details</h1>
      
      <div className="tender-info">
        <h2>{tender.title}</h2>
        <p><strong>Status:</strong> <span className={`status ${tender.status.toLowerCase()}`}>{tender.status}</span></p>
        <p><strong>Deadline:</strong> {tender.deadline}</p>
        <p><strong>Description:</strong> {tender.description}</p>
        
        {awardedBidder && (
          <div className="awarded-info">
            <h3>Awarded To</h3>
            <p><strong>Vendor:</strong> {awardedBidder.name}</p>
            <p><strong>Bid Amount:</strong> ${awardedBidder.bid.toLocaleString()}</p>
            <p><strong>Rating:</strong> {awardedBidder.rating.toFixed(1)}/5</p>
          </div>
        )}
      </div>
      
      {tender.status === "Open" && (
        <div className="bidders-section">
          <div className="bidders-header">
            <h3>Bidders</h3>
            {tender.bidders.length === 0 && (
              <button onClick={handleAddBidders} className="btn btn-secondary">
                Simulate Bidders (Demo)
              </button>
            )}
          </div>
          
          {tender.bidders.length > 0 ? (
            <div className="top-bidders">
              <h4>Top 3 Bidders (Sorted by Rating and Bid)</h4>
              <table>
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Name</th>
                    <th>Bid Amount</th>
                    <th>Rating</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedBidders.slice(0, 3).map((bidder, index) => (
                    <tr key={bidder.id}>
                      <td>{index + 1}</td>
                      <td>{bidder.name}</td>
                      <td>${bidder.bid.toLocaleString()}</td>
                      <td>{bidder.rating.toFixed(1)}/5</td>
                      <td>
                        <button 
                          onClick={() => handleAward(bidder.id)} 
                          className="btn btn-award"
                        >
                          Award Tender
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>No bidders have submitted proposals yet.</p>
          )}
        </div>
      )}
      
      <div className="back-link">
        <Link to="/all-tenders">Back to All Tenders</Link>
      </div>
    </div>
  );
}

// Add some missing imports
function useParams() {
  const location = window.location.pathname;
  const parts = location.split('/');
  const id = parts[parts.length - 1];
  return { id };
}

// CSS
const styles = `
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Segoe UI', 'Roboto', sans-serif;
  line-height: 1.6;
  color: #333;
  background-color: #f5f5f5;
}

.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #2c3e50;
  color: white;
  padding: 1rem 2rem;
}

.navbar-brand {
  font-size: 1.5rem;
  font-weight: bold;
}

.navbar-nav {
  display: flex;
  list-style-type: none;
}

.navbar-nav li {
  margin-left: 1.5rem;
}

.navbar-nav a {
  color: white;
  text-decoration: none;
  transition: color 0.3s;
}

.navbar-nav a:hover {
  color: #3498db;
}

.content {
  flex: 1;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

h1 {
  margin-bottom: 1.5rem;
  color: #2c3e50;
}

h2 {
  margin-bottom: 1rem;
  color: #2c3e50;
}

/* Dashboard */
.dashboard-stats {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background-color: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.stat-value {
  font-size: 2.5rem;
  font-weight: bold;
  color: #3498db;
  margin: 1rem 0;
}

.stat-link {
  display: inline-block;
  color: #3498db;
  text-decoration: none;
  font-weight: 500;
}

/* Tables */
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
  background-color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow: hidden;
}

th, td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #eee;
}

th {
  background-color: #f8f9fa;
  font-weight: 600;
}

/* Status Styles */
.status {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 50px;
  font-size: 0.85rem;
  font-weight: 500;
}

.status.open {
  background-color: #e3f2fd;
  color: #1976d2;
}

.status.awarded {
  background-color: #e8f5e9;
  color: #2e7d32;
}

/* Buttons */
.btn {
  display: inline-block;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  font-weight: 500;
  text-align: center;
  text-decoration: none;
  cursor: pointer;
  border: none;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.btn-primary {
  background-color: #3498db;
  color: white;
}

.btn-primary:hover {
  background-color: #2980b9;
}

.btn-secondary {
  background-color: #95a5a6;
  color: white;
}

.btn-secondary:hover {
  background-color: #7f8c8d;
}

.btn-view {
  background-color: #f8f9fa;
  color: #2c3e50;
  border: 1px solid #ddd;
}

.btn-view:hover {
  background-color: #eaecef;
}

.btn-award {
  background-color: #27ae60;
  color: white;
}

.btn-award:hover {
  background-color: #219653;
}

/* Forms */
.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

input, textarea {
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

textarea {
  min-height: 150px;
  resize: vertical;
}

/* Tender Detail */
.tender-info {
  background-color: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.awarded-info {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #eee;
}

.bidders-section {
  background-color: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.bidders-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.back-link {
  margin-top: 1rem;
}

.back-link a {
  color: #3498db;
  text-decoration: none;
}

/* Responsiveness */
@media (max-width: 768px) {
  .navbar {
    flex-direction: column;
    padding: 1rem;
  }
  
  .navbar-brand {
    margin-bottom: 1rem;
  }
  
  .navbar-nav {
    width: 100%;
    justify-content: space-between;
  }
  
  .dashboard-stats {
    grid-template-columns: 1fr;
  }
  
  .content {
    padding: 1rem;
  }
}
`;

// Entry point
function TenderManagementApp() {
  useEffect(() => {
    // Add styles to document
    const styleElement = document.createElement('style');
    styleElement.innerHTML = styles;
    document.head.appendChild(styleElement);
    
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);
  
  return <AppWithProvider />;
}

export default TenderManagementApp;