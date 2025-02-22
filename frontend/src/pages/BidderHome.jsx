import { useState } from "react";
import Navbar from "../components/Navbar";
import ProfileCard from "../components/ProfileCard";
import BidsList from "../components/BidsList";

const BidderHome = () => {
  // Sample bidder data
  const [bidder, setBidder] = useState({
    fullName: "John Doe",
    companyName: "Doe Constructions",
    email: "johndoe@example.com",
    phone: "+123456789",
    address: "1234 Street, City, Country",
    rating: 4.7,
  });

  // Sample bids data
  const [bids, setBids] = useState([
    { tenderId: "T1001", tenderTitle: "Road Construction", amount: 50000, bidDate: "2025-02-20", timeline: "3 months" },
    { tenderId: "T1002", tenderTitle: "Bridge Repair", amount: 75000, bidDate: "2025-02-18", timeline: "6 months" },
    { tenderId: "T1003", tenderTitle: "Building Renovation", amount: 60000, bidDate: "2025-02-15", timeline: "4 months" },
  ]);

  const handleLogout = () => {
    alert("Logging out...");
    // Add actual logout logic here
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar onLogout={handleLogout} />
      <div className="container mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <ProfileCard bidder={bidder} />
        <BidsList bids={bids} />
      </div>
    </div>
  );
};

export default BidderHome;
