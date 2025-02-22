import React from 'react'
import { Routes, Route } from 'react-router-dom'
import  TendersList  from '../components/TendersList'
import Navbar from '@/components/Navbar'

function Tenders() {
  return (
    <>
    <Navbar/> 
    <TendersList/>
    <div>Tenders</div>
    </>
  )
}

export default Tenders