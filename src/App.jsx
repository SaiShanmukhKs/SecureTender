import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';

// Mock data for initial development
const initialTenders = [
  {
    id: 1,
    title: "Office Supplies Procurement",
    description: "Supply of stationery and office consumables for Q1 2025",
    deadline: "2025-03-15",
    status: "Open",
    createdBy: "Ministry of Education",
    estimatedBudget: "10,000 - 15,000",
    category: "Supplies",
    documents: ["tender_specs.pdf", "terms_conditions.pdf"]
  },
  {
    id: 2,
    title: "IT Hardware Maintenance",
    description: "Annual maintenance contract for server infrastructure",
    deadline: "2025-03-10",
    status: "Open",
    createdBy: "Department of Health",
    estimatedBudget: "40,000 - 50,000",
    category: "Services",
    documents: ["maintenance_requirements.pdf", "sla_template.pdf"]
  },
  {
    id: 3,
    title: "Cafeteria Services",
    description: "Providing cafeteria services for 100 employees",
    deadline: "2025-02-28",
    status: "Closed",
    createdBy: "City Council",
    estimatedBudget: "30,000 - 40,000",
    category: "Food Services",
    documents: ["cafeteria_requirements.pdf"]
  }
];

// Mock user data
const mockBidderProfile = {
  id: 1001,
  name: "TechSolutions Inc.",
  email: "contact@techsolutions.example",
  phone: "+1 (555) 123-4567",
  address: "123 Business Ave, Tech City, TC 54321",
  registrationNumber: "BID-2025-1001",
  rating: 4.7,
  categories: ["IT Services", "Hardware", "Consultancy"],
  documents: ["company_profile.pdf", "tax_certificate.pdf", "registration.pdf"]
};

// Mock bids submitted by the current bidder
const initialMyBids = [
  {
    id: 101,
    tenderId: 1,
    tenderTitle: "Office Supplies Procurement",
    bidAmount: 12500,
    submissionDate: "2025-02-25",
    status: "Submitted", // Submitted, Shortlisted, Awarded, Rejected
    notes: "Included 5% discount on bulk orders"
  },
  {
    id: 102,
    tenderId: 2,
    tenderTitle: "IT Hardware Maintenance",
    bidAmount: 45000,
    submissionDate: "2025-02-20",
    status: "Shortlisted",
    notes: "24/7 support included in pricing"
  },
  {
    id: 103,
    tenderId: 3,
    tenderTitle: "Cafeteria Services",
    bidAmount: 35000,
    submissionDate: "2025-02-15",
    status: "Awarded",
    notes: "Organic food options included"
  }
];

// Context for Bidder Application
const BidderContext = React.createContext();

function BidderProvider({ children }) {
  const [tenders, setTenders] = useState(initialTenders);
  const [myBids, setMyBids] = useState(initialMyBids);
  const [profile, setProfile] = useState(mockBidderProfile);
  
  // Add a new bid
  const submitBid = (tenderId, bidData) => {
    const tender = tenders.find(t => t.id === tenderId);
    
    if (!tender) return false;
    
    const newBid = {
      id: Math.floor(Math.random() * 1000) + 200,
      tenderId: tenderId,
      tenderTitle: tender.title,
      bidAmount: bidData.bidAmount,
      submissionDate: new Date().toISOString().split('T')[0],
      status: "Submitted",
      notes: bidData.notes
    };
    
    setMyBids([...myBids, newBid]);
    return true;
  };
  
  // Update profile information
  const updateProfile = (newProfileData) => {
    setProfile({
      ...profile,
      ...newProfileData
    });
  };
  
  return (
    <BidderContext.Provider value={{ 
      tenders, 
      myBids, 
      profile, 
      submitBid, 
      updateProfile 
    }}>
      {children}
    </BidderContext.Provider>
  );
}

function App() {
  return (
    <BidderProvider>
      <Router>
        <div className="app-container">
          <nav className="navbar">
            <div className="navbar-brand">Tender Bidding Portal</div>
            <ul className="navbar-nav">
              <li><Link to="/">Dashboard</Link></li>
              <li><Link to="/tenders">Available Tenders</Link></li>
              <li><Link to="/my-bids">My Bids</Link></li>
              <li><Link to="/profile">My Profile</Link></li>
            </ul>
          </nav>
          
          <div className="content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/tenders" element={<AvailableTenders />} />
              <Route path="/tender/:id" element={<TenderDetail />} />
              <Route path="/my-bids" element={<MyBids />} />
              <Route path="/profile" element={<BidderProfile />} />
              <Route path="/submit-bid/:id" element={<SubmitBid />} />
            </Routes>
          </div>
        </div>
      </Router>
    </BidderProvider>
  );
}

// Dashboard Component
function Dashboard() {
  const { tenders, myBids, profile } = React.useContext(BidderContext);
  
  const openTenders = tenders.filter(tender => tender.status === "Open").length;
  const submittedBids = myBids.filter(bid => bid.status === "Submitted").length;
  const awardedBids = myBids.filter(bid => bid.status === "Awarded").length;
  
  // Filter tenders by profile categories (matching)
  const recommendedTenders = tenders.filter(tender => 
    tender.status === "Open" && !myBids.some(bid => bid.tenderId === tender.id)
  ).slice(0, 3);
  
  return (
    <div className="dashboard">
      <h1>Welcome, {profile.name}</h1>
      <p className="subtitle">Your current rating: <span className="rating">{profile.rating.toFixed(1)}/5</span></p>
      
      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Open Tenders</h3>
          <p className="stat-value">{openTenders}</p>
          <Link to="/tenders" className="stat-link">Browse All</Link>
        </div>
        <div className="stat-card">
          <h3>My Active Bids</h3>
          <p className="stat-value">{submittedBids}</p>
          <Link to="/my-bids" className="stat-link">View Details</Link>
        </div>
        <div className="stat-card">
          <h3>Awarded Contracts</h3>
          <p className="stat-value">{awardedBids}</p>
          <Link to="/my-bids" className="stat-link">View All</Link>
        </div>
      </div>
      
      <div className="recommendations">
        <h2>Recommended Tenders</h2>
        {recommendedTenders.length > 0 ? (
          <div className="tender-cards">
            {recommendedTenders.map(tender => (
              <div key={tender.id} className="tender-card">
                <h3>{tender.title}</h3>
                <p className="tender-description">{tender.description}</p>
                <div className="tender-details">
                  <span><strong>Created by:</strong> {tender.createdBy}</span>
                  <span><strong>Deadline:</strong> {tender.deadline}</span>
                  <span><strong>Budget:</strong> ${tender.estimatedBudget}</span>
                </div>
                <Link to={`/tender/${tender.id}`} className="btn btn-primary">View Details</Link>
              </div>
            ))}
          </div>
        ) : (
          <p>No recommended tenders found at this time.</p>
        )}
      </div>
      
      <div className="recent-activity">
        <h2>Recent Bid Activity</h2>
        <table>
          <thead>
            <tr>
              <th>Tender</th>
              <th>Bid Amount</th>
              <th>Submission Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {myBids.slice(0, 5).map(bid => (
              <tr key={bid.id}>
                <td>{bid.tenderTitle}</td>
                <td>${bid.bidAmount.toLocaleString()}</td>
                <td>{bid.submissionDate}</td>
                <td><span className={`status ${bid.status.toLowerCase()}`}>{bid.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Available Tenders Component
function AvailableTenders() {
  const { tenders, myBids } = React.useContext(BidderContext);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  
  // Filter tenders based on status and search term
  const filteredTenders = tenders.filter(tender => {
    const matchesFilter = filter === "all" || tender.status.toLowerCase() === filter.toLowerCase();
    const matchesSearch = tender.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          tender.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });
  
  // Check if the user has already bid on a tender
  const hasBid = (tenderId) => {
    return myBids.some(bid => bid.tenderId === tenderId);
  };
  
  return (
    <div className="available-tenders">
      <h1>Available Tenders</h1>
      
      <div className="filter-container">
        <div className="search-box">
          <input 
            type="text" 
            placeholder="Search tenders..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
          />
        </div>
        
        <div className="filter-buttons">
          <button 
            className={filter === "all" ? "active" : ""} 
            onClick={() => setFilter("all")}
          >
            All
          </button>
          <button 
            className={filter === "open" ? "active" : ""} 
            onClick={() => setFilter("open")}
          >
            Open
          </button>
          <button 
            className={filter === "closed" ? "active" : ""} 
            onClick={() => setFilter("closed")}
          >
            Closed
          </button>
        </div>
      </div>
      
      <div className="tender-list">
        {filteredTenders.length > 0 ? (
          filteredTenders.map(tender => (
            <div key={tender.id} className="tender-item">
              <div className="tender-header">
                <h3>{tender.title}</h3>
                <span className={`status ${tender.status.toLowerCase()}`}>{tender.status}</span>
              </div>
              
              <p className="tender-description">{tender.description}</p>
              
              <div className="tender-meta">
                <div className="meta-item">
                  <span className="meta-label">Created by:</span>
                  <span className="meta-value">{tender.createdBy}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Deadline:</span>
                  <span className="meta-value">{tender.deadline}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Est. Budget:</span>
                  <span className="meta-value">${tender.estimatedBudget}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Category:</span>
                  <span className="meta-value">{tender.category}</span>
                </div>
              </div>
              
              <div className="tender-actions">
                <Link to={`/tender/${tender.id}`} className="btn btn-secondary">View Details</Link>
                {tender.status === "Open" && !hasBid(tender.id) && (
                  <Link to={`/submit-bid/${tender.id}`} className="btn btn-primary">Submit Bid</Link>
                )}
                {hasBid(tender.id) && (
                  <span className="bid-submitted">Bid Submitted</span>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="no-results">No tenders match your criteria.</p>
        )}
      </div>
    </div>
  );
}

// Tender Detail Component
function TenderDetail() {
  const { tenders, myBids } = React.useContext(BidderContext);
  const { id } = useParams();
  const tenderId = parseInt(id);
  const navigate = useNavigate();
  
  const tender = tenders.find(t => t.id === tenderId);
  const myBid = myBids.find(b => b.tenderId === tenderId);
  
  if (!tender) {
    return <div>Tender not found</div>;
  }
  
  return (
    <div className="tender-detail">
      <h1>Tender Details</h1>
      
      <div className="detail-header">
        <h2>{tender.title}</h2>
        <span className={`status ${tender.status.toLowerCase()}`}>{tender.status}</span>
      </div>
      
      <div className="detail-section">
        <h3>Description</h3>
        <p>{tender.description}</p>
      </div>
      
      <div className="detail-grid">
        <div className="detail-item">
          <h3>Created By</h3>
          <p>{tender.createdBy}</p>
        </div>
        <div className="detail-item">
          <h3>Category</h3>
          <p>{tender.category}</p>
        </div>
        <div className="detail-item">
          <h3>Estimated Budget</h3>
          <p>${tender.estimatedBudget}</p>
        </div>
        <div className="detail-item">
          <h3>Submission Deadline</h3>
          <p>{tender.deadline}</p>
        </div>
      </div>
      
      <div className="detail-section">
        <h3>Documents</h3>
        <ul className="document-list">
          {tender.documents.map((doc, index) => (
            <li key={index}>
              <span className="document-icon">📄</span>
              <span className="document-name">{doc}</span>
              <button className="btn btn-sm">Download</button>
            </li>
          ))}
        </ul>
      </div>
      
      {myBid && (
        <div className="my-bid-section">
          <h3>My Bid</h3>
          <div className="bid-details">
            <div className="bid-info">
              <p><strong>Amount:</strong> ${myBid.bidAmount.toLocaleString()}</p>
              <p><strong>Submitted:</strong> {myBid.submissionDate}</p>
              <p><strong>Status:</strong> <span className={`status ${myBid.status.toLowerCase()}`}>{myBid.status}</span></p>
            </div>
            <div className="bid-notes">
              <p><strong>Notes:</strong></p>
              <p>{myBid.notes}</p>
            </div>
          </div>
        </div>
      )}
      
      <div className="detail-actions">
        {tender.status === "Open" && !myBid && (
          <button 
            onClick={() => navigate(`/submit-bid/${tenderId}`)} 
            className="btn btn-primary"
          >
            Submit Bid
          </button>
        )}
        <button onClick={() => navigate("/tenders")} className="btn btn-secondary">
          Back to Tenders
        </button>
      </div>
    </div>
  );
}

// Submit Bid Component
function SubmitBid() {
  const { tenders, submitBid } = React.useContext(BidderContext);
  const { id } = useParams();
  const tenderId = parseInt(id);
  const navigate = useNavigate();
  
  const [bidData, setBidData] = useState({
    bidAmount: "",
    notes: ""
  });
  
  const tender = tenders.find(t => t.id === tenderId);
  
  if (!tender) {
    return <div>Tender not found</div>;
  }
  
  if (tender.status !== "Open") {
    return (
      <div className="submit-bid">
        <h1>Submit Bid</h1>
        <div className="alert alert-error">
          This tender is no longer accepting bids.
        </div>
        <button onClick={() => navigate("/tenders")} className="btn btn-secondary">
          Back to Tenders
        </button>
      </div>
    );
  }
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setBidData({
      ...bidData,
      [name]: name === "bidAmount" ? parseFloat(value) || "" : value
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (submitBid(tenderId, bidData)) {
      navigate("/my-bids");
    }
  };
  
  return (
    <div className="submit-bid">
      <h1>Submit Bid for Tender</h1>
      
      <div className="tender-summary">
        <h2>{tender.title}</h2>
        <p>{tender.description}</p>
        <div className="summary-details">
          <p><strong>Created by:</strong> {tender.createdBy}</p>
          <p><strong>Deadline:</strong> {tender.deadline}</p>
          <p><strong>Estimated Budget:</strong> ${tender.estimatedBudget}</p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="bid-form">
        <div className="form-group">
          <label htmlFor="bidAmount">Bid Amount ($)</label>
          <input 
            type="number" 
            id="bidAmount" 
            name="bidAmount" 
            value={bidData.bidAmount} 
            onChange={handleChange} 
            required 
            min="1"
            step="0.01"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="notes">Bid Notes/Proposal Details</label>
          <textarea 
            id="notes" 
            name="notes" 
            value={bidData.notes} 
            onChange={handleChange} 
            placeholder="Describe your bid details, terms, and any special considerations..."
            required
          ></textarea>
        </div>
        
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">Submit Bid</button>
          <button 
            type="button" 
            onClick={() => navigate(`/tender/${tenderId}`)} 
            className="btn btn-secondary"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

// My Bids Component
function MyBids() {
  const { myBids } = React.useContext(BidderContext);
  const [filter, setFilter] = useState("all");
  
  // Filter bids based on status
  const filteredBids = myBids.filter(bid => {
    return filter === "all" || bid.status.toLowerCase() === filter.toLowerCase();
  });
  
  return (
    <div className="my-bids">
      <h1>My Bids</h1>
      
      <div className="filter-buttons">
        <button 
          className={filter === "all" ? "active" : ""} 
          onClick={() => setFilter("all")}
        >
          All Bids
        </button>
        <button 
          className={filter === "submitted" ? "active" : ""} 
          onClick={() => setFilter("submitted")}
        >
          Submitted
        </button>
        <button 
          className={filter === "shortlisted" ? "active" : ""} 
          onClick={() => setFilter("shortlisted")}
        >
          Shortlisted
        </button>
        <button 
          className={filter === "awarded" ? "active" : ""} 
          onClick={() => setFilter("awarded")}
        >
          Awarded
        </button>
        <button 
          className={filter === "rejected" ? "active" : ""} 
          onClick={() => setFilter("rejected")}
        >
          Rejected
        </button>
      </div>
      
      {filteredBids.length > 0 ? (
        <div className="bid-list">
          {filteredBids.map(bid => (
            <div key={bid.id} className="bid-card">
              <div className="bid-header">
                <h3>{bid.tenderTitle}</h3>
                <span className={`status ${bid.status.toLowerCase()}`}>{bid.status}</span>
              </div>
              
              <div className="bid-details">
                <div className="bid-info-row">
                  <div className="bid-info-item">
                    <span className="label">Bid Amount:</span>
                    <span className="value">${bid.bidAmount.toLocaleString()}</span>
                  </div>
                  <div className="bid-info-item">
                    <span className="label">Submitted On:</span>
                    <span className="value">{bid.submissionDate}</span>
                  </div>
                </div>
                
                <div className="bid-notes">
                  <span className="label">Notes:</span>
                  <p>{bid.notes}</p>
                </div>
              </div>
              
              <div className="bid-actions">
                <Link to={`/tender/${bid.tenderId}`} className="btn btn-secondary">View Tender</Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="no-results">No bids found with the selected filter.</p>
      )}
    </div>
  );
}

// Bidder Profile Component
function BidderProfile() {
  const { profile, updateProfile } = React.useContext(BidderContext);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ ...profile });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile(formData);
    setEditMode(false);
  };
  
  return (
    <div className="bidder-profile">
      <h1>My Profile</h1>
      
      {!editMode ? (
        <div className="profile-view">
          <div className="profile-header">
            <div className="profile-main">
              <h2>{profile.name}</h2>
              <p className="registration-number">Registration: {profile.registrationNumber}</p>
              <div className="rating-display">
                <span className="rating">{profile.rating.toFixed(1)}</span>
                <div className="stars">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={i < Math.round(profile.rating) ? "star filled" : "star"}>★</span>
                  ))}
                </div>
              </div>
            </div>
            <button onClick={() => setEditMode(true)} className="btn btn-secondary">
              Edit Profile
            </button>
          </div>
          
          <div className="profile-sections">
            <div className="profile-section">
              <h3>Contact Information</h3>
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Email:</span>
                  <span className="info-value">{profile.email}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Phone:</span>
                  <span className="info-value">{profile.phone}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Address:</span>
                  <span className="info-value">{profile.address}</span>
                </div>
              </div>
            </div>
            
            <div className="profile-section">
              <h3>Business Categories</h3>
              <div className="categories-list">
                {profile.categories.map((category, index) => (
                  <span key={index} className="category-tag">{category}</span>
                ))}
              </div>
            </div>
            
            <div className="profile-section">
              <h3>Documents</h3>
              <ul className="document-list">
                {profile.documents.map((doc, index) => (
                  <li key={index}>
                    <span className="document-icon">📄</span>
                    <span className="document-name">{doc}</span>
                    <button className="btn btn-sm">View</button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ) : (
        <form className="profile-edit-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Company Name</label>
            <input 
              type="text" 
              id="name" 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              required 
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              required 
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="phone">Phone</label>
            <input 
              type="text" 
              id="phone" 
              name="phone" 
              value={formData.phone} 
              onChange={handleChange} 
              required 
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="address">Address</label>
            <textarea 
              id="address" 
              name="address" 
              value={formData.address} 
              onChange={handleChange} 
              required 
            ></textarea>
          </div>
          
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">Save Changes</button>
            <button 
              type="button" 
              onClick={() => {
                setFormData({ ...profile });
                setEditMode(false);
              }} 
              className="btn btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

// Add this at the bottom of your file
export default App;
// // CSS Styles
// const styles = `
// * {
//   box-sizing: border-box;
//   margin: 0;
//   padding: 0;
// }

// body {
//   font-family: 'Segoe UI', 'Roboto', sans-serif;
//   line-height: 1.6;
//   color: #333;
//   background-color: #f5f5f5;
// }

// .app-container {
//   display: flex;
//   flex-direction: column;
//   min-height: 100vh;
// }

// .navbar {
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   background-color: #2c3e50;
//   color: white;
//   padding: 1rem 2rem;
// }

// .navbar-brand {
//   font-size: 1.5rem;
//   font-weight: bold;
// }

// .navbar-nav {
//   display: flex;
//   list-style-type: none;
// }

// .navbar-nav li {
//   margin-left: 1.5rem;
// }

// .navbar-nav a {
//   color: white;
//   text-decoration: none;
//   transition: color 0.3s;
// }

// .navbar-nav a:hover {
//   color: #3498db;
// }

// .content {
//   flex: 1;
//   padding: 2rem;
//   max-width: 1200px;
//   margin: 0 auto;
//   width: 100%;
// }

// h1 {
//   margin-bottom: 1.5rem;
//   color: #2c3e50;
// }

// h2 {
//   margin-bottom: 1rem;
//   color: #2c3e50;
// }

// .subtitle {
//   color: #7f8c8d;
//   margin-bottom: 1.5rem;
//   font-size: 1.1rem;
// }

// /* Dashboard */
// .dashboard-stats {
//   display: grid;
//   grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
//   gap: 1.5rem;
//   margin-bottom: 2rem;
// }

// .stat-card {
//   background-color: white;
//   border-radius: 8px;
//   padding: 1.5rem;
//   box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
//   text-align: center;
// }

// .stat-value {
//   font-size: 2.5rem;
//   font-weight: bold;
//   color: #3498db;
//   margin: 1rem 0;
// }

// .stat-link {
//   display: inline-block;
//   color: #3498db;
//   text-decoration: none;
//   font-weight: 500;
// }

// .rating {
//   background-color: #f1c40f;
//   color: #fff;
//   padding: 0.2rem 0.5rem;
//   border-radius: 3px;
//   font-weight: bold;
// }

// /* Tender Cards */
// .tender-cards {
//   display: grid;
//   grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
//   gap: 1.5rem;
//   margin-top: 1rem;
// }

// .tender-card {
//   background-color: white;
//   border-radius: 8px;
//   padding: 1.5rem;
//   box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
//   display: flex;
//   flex-direction: column;
//   height: 100%;
// }

// .tender-description {
//   margin-bottom: 1rem;
//   color: #666;
// }

// .tender-details {
//   display: flex;
//   flex-direction: column;
//   gap: 0.5rem;
//   margin-bottom: 1rem;
// }

// .btn {
//   display: inline-block;
//   padding: 0.6rem 1.2rem;
//   background-color: #3498db;
//   color: white;
//   border: none;
//   border-radius: 4px;
//   cursor: pointer;
//   text-decoration: none;
//   font-weight: 500;
//   transition: background-color 0.3s;
// }

// .btn-primary {
//   background-color: #3498db;
// }

// .btn-primary:hover {
//   background-color: #2980b9;
// }

// .btn-secondary {
//   background-color: #7f8c8d;
// }

// .btn-secondary:hover {
//   background-color: #6c7a7d;
// }

// .btn-sm {
//   padding: 0.3rem 0.6rem;
//   font-size: 0.9rem;
// }

// /* Recent Activity */
// .recent-activity {
//   margin-top: 2rem;
// }

// table {
//   width: 100%;
//   border-collapse: collapse;
//   background-color: white;
//   border-radius: 8px;
//   box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
//   overflow: hidden;
// }

// th, td {
//   padding: 1rem;
//   text-align: left;
// }

// th {
//   background-color: #f0f0f0;
//   font-weight: 600;
// }

// tr:not(:last-child) {
//   border-bottom: 1px solid #eee;
// }

// .status {
//   display: inline-block;
//   padding: 0.3rem 0.6rem;
//   border-radius: 3px;
//   font-size: 0.85rem;
//   font-weight: bold;
//   text-transform: uppercase;
// }

// .open {
//   background-color: #3498db;
//   color: white;
// }

// .closed {
//   background-color: #95a5a6;
//   color: white;
// }

// .submitted {
//   background-color: #f39c12;
//   color: white;
// }

// .shortlisted {
//   background-color: #9b59b6;
//   color: white;
// }

// .awarded {
//   background-color: #2ecc71;
//   color: white;
// }

// .rejected {
//   background-color: #e74c3c;
//   color: white;
// }

// /* Available Tenders */
// .filter-container {
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   margin-bottom: 1.5rem;
//   flex-wrap: wrap;
//   gap: 1rem;
// }

// .search-box input {
//   padding: 0.7rem 1rem;
//   border-radius: 4px;
//   border: 1px solid #ddd;
//   width: 300px;
//   font-size: 1rem;
// }

// .filter-buttons {
//   display: flex;
//   gap: 0.5rem;
// }

// .filter-buttons button {
//   padding: 0.7rem 1.2rem;
//   border: none;
//   background-color: white;
//   border-radius: 4px;
//   cursor: pointer;
//   font-weight: 500;
//   transition: all 0.3s;
// }

// .filter-buttons button.active {
//   background-color: #3498db;
//   color: white;
// }

// .tender-list {
//   display: flex;
//   flex-direction: column;
//   gap: 1.5rem;
// }

// .tender-item {
//   background-color: white;
//   border-radius: 8px;
//   padding: 1.5rem;
//   box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
// }

// .tender-header {
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   margin-bottom: 1rem;
// }

// .tender-meta {
//   display: grid;
//   grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
//   gap: 1rem;
//   margin: 1rem 0;
// }

// .meta-item {
//   display: flex;
//   flex-direction: column;
// }

// .meta-label {
//   font-size: 0.85rem;
//   color: #7f8c8d;
// }

// .meta-value {
//   font-weight: 500;
// }

// .tender-actions {
//   display: flex;
//   gap: 1rem;
//   margin-top: 1rem;
// }

// .bid-submitted {
//   padding: 0.6rem 1.2rem;
//   background-color: #ecf0f1;
//   border-radius: 4px;
//   color: #7f8c8d;
//   font-weight: 500;
// }

// /* Tender Detail */
// .detail-header {
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   margin-bottom: 1.5rem;
// }

// .detail-section {
//   background-color: white;
//   border-radius: 8px;
//   padding: 1.5rem;
//   box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
//   margin-bottom: 1.5rem;
// }

// .detail-grid {
//   display: grid;
//   grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
//   gap: 1.5rem;
//   margin-bottom: 1.5rem;
// }

// .detail-item {
//   background-color: white;
//   border-radius: 8px;
//   padding: 1.5rem;
//   box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
// }

// .document-list {
//   list-style-type: none;
// }

// .document-list li {
//   display: flex;
//   align-items: center;
//   padding: 0.8rem 0;
//   border-bottom: 1px solid #eee;
// }

// .document-list li:last-child {
//   border-bottom: none;
// }

// .document-icon {
//   margin-right: 0.8rem;
// }

// .document-name {
//   flex: 1;
// }

// .my-bid-section {
//   background-color: #f8f9fa;
//   border-radius: 8px;
//   padding: 1.5rem;
//   box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
//   margin-bottom: 1.5rem;
//   border-left: 4px solid #3498db;
// }

// .bid-details {
//   display: flex;
//   flex-direction: column;
//   gap: 1rem;
//   margin-top: 1rem;
// }

// .bid-info {
//   display: flex;
//   gap: 2rem;
// }

// .detail-actions {
//   display: flex;
//   gap: 1rem;
//   margin-top: 1.5rem;
// }

// /* Submit Bid */
// .tender-summary {
//   background-color: #f8f9fa;
//   border-radius: 8px;
//   padding: 1.5rem;
//   margin-bottom: 1.5rem;
//   border-left: 4px solid #3498db;
// }

// .summary-details {
//   display: flex;
//   flex-wrap: wrap;
//   gap: 1.5rem;
//   margin-top: 1rem;
// }

// .bid-form {
//   background-color: white;
//   border-radius: 8px;
//   padding: 1.5rem;
//   box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
// }

// .form-group {
//   margin-bottom: 1.5rem;
// }

// .form-group label {
//   display: block;
//   margin-bottom: 0.5rem;
//   font-weight: 500;
// }

// .form-group input,
// .form-group textarea {
//   width: 100%;
//   padding: 0.8rem;
//   border: 1px solid #ddd;
//   border-radius: 4px;
//   font-size: 1rem;
// }

// .form-group textarea {
//   min-height: 150px;
//   resize: vertical;
// }

// .form-actions {
//   display: flex;
//   gap: 1rem;
// }

// /* My Bids */
// .bid-card {
//   background-color: white;
//   border-radius: 8px;
//   padding: 1.5rem;
//   box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
// }

// .bid-header {
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   margin-bottom: 1rem;
// }

// .bid-info-row {
//   display: flex;
//   gap: 2rem;
//   margin-bottom: 1rem;
// }

// .bid-info-item {
//   display: flex;
//   flex-direction: column;
// }

// .label {
//   font-size: 0.85rem;
//   color: #7f8c8d;
// }

// .value {
//   font-weight: 500;
// }

// .bid-notes {
//   margin-bottom: 1rem;
// }

// .bid-actions {
//   display: flex;
//   gap: 1rem;
//   margin-top: 1rem;
// }

// .no-results {
//   text-align: center;
//   padding: 2rem;
//   background-color: white;
//   border-radius: 8px;
//   box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
//   color: #7f8c8d;
// }

// /* Profile */
// .profile-view {
//   background-color: white;
//   border-radius: 8px;
//   padding: 1.5rem;
//   box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
// }

// .profile-header {
//   display: flex;
//   justify-content: space-between;
//   align-items: flex-start;
//   margin-bottom: 2rem;
// }

// .profile-main {
//   display: flex;
//   flex-direction: column;
// }

// .registration-number {
//   color: #7f8c8d;
//   margin-bottom: 0.5rem;
// }

// .rating-display {
//   display: flex;
//   align-items: center;
//   gap: 1rem;
// }

// .stars {
//   display: flex;
// }

// .star {
//   color: #ddd;
//   font-size: 1.2rem;
// }

// .star.filled {
//   color: #f1c40f;
// }

// .profile-sections {
//   display: flex;
//   flex-direction: column;
//   gap: 2rem;
// }

// .profile-section h3 {
//   margin-bottom: 1rem;
//   border-bottom: 1px solid #eee;
//   padding-bottom: 0.5rem;
// }

// .info-grid {
//   display: grid;
//   grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
//   gap: 1rem;
// }

// .info-item {
//   display: flex;
//   flex-direction: column;
// }

// .info-label {
//   font-size: 0.85rem;
//   color: #7f8c8d;
// }

// .info-value {
//   font-weight: 500;
// }

// .categories-list {
//   display: flex;
//   flex-wrap: wrap;
//   gap: 0.5rem;
// }

// .category-tag {
//   background-color: #e0f7fa;
//   color: #00838f;
//   padding: 0.4rem 0.8rem;
//   border-radius: 20px;
//   font-size: 0.9rem;
// }

// .profile-edit-form {
//   background-color: white;
//   border-radius: 8px;
//   padding: 1.5rem;
//   box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
// }

// /* Responsive adjustments */
// @media (max-width: 768px) {
//   .navbar {
//     flex-direction: column;
//     padding: 1rem;
//   }
  
//   .navbar-brand {
//     margin-bottom: 1rem;
//   }
  
//   .navbar-nav {
//     width: 100%;
//     justify-content: space-between;
//   }
  
//   .navbar-nav li {
//     margin-left: 0;
//   }
  
//   .content {
//     padding: 1rem;
//   }
  
//   .dashboard-stats {
//     grid-template-columns: 1fr;
//   }
  
//   .tender-cards {
//     grid-template-columns: 1fr;
//   }
  
//   .filter-container {
//     flex-direction: column;
//     align-items: stretch;
//   }
  
//   .search-box input {
//     width: 100%;
//   }
  
//   .bid-info {
//     flex-direction: column;
//     gap: 0.5rem;
//   }
  
//   .profile-header {
//     flex-direction: column;
//   }
  
//   .profile-header button {
//     margin-top: 1rem;
//   }
// `
