import React from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Footer from '../components/Footer'
import Services from '../components/Services'
import Features from '../components/Features'

const LandingPage = () => {
  return (
    <div>
        <Navbar />
        <Hero />
        <Services />
        <Features />
        <Footer />
    </div>
  )
}

export default LandingPage