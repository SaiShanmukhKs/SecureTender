import { Routes, Route } from "react-router-dom";
import React from "react";
import './App.css'
import { Button } from './components/ui/button'
import Login from './pages/login'
import BidForm from './components/BidForm'
import BidderHome from './pages/Bidderhome'
import Tenders from "./pages/Tenders";
import TenderDescription from "./pages/TenderDescription";
import BidFormSub from "./pages/BidFormSub";
import TendersWon from "./pages/TendersWon";
import TenderWonDeatiledDescription from "./pages/TenderWonDeatiledDescription";



function App() {


  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/bidderHome" element={<BidderHome />} />
      <Route path="/Tenders" element={<Tenders />} />
      <Route path="/Tenders/:id" element={<TenderDescription />} />
      <Route path="/BidFormSub/:id" element={<BidFormSub />} />
      <Route path="/TendersWon" element={<TendersWon />} />
      <Route path="/TendersWon/:id" element={<TenderWonDeatiledDescription />} />
      
    </Routes>
  )
}

export default App
