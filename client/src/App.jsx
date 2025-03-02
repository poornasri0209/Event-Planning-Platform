import React from 'react'
import { Routes , Route } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import MultiFacPage from './pages/MultiFacPage'
import LandingPage from './pages/LandingPage'
import UserProfilePage from './pages/UserProfilePage'
import UserFeedbackPage from './pages/UserFeedbackPage'


const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path='/register' element={<RegisterPage />} />
        <Route path='/2fa' element={<MultiFacPage />} />
        <Route path='/home' element={<LandingPage />} />
        <Route path='/profile' element={<UserProfilePage />} />
        <Route path='/feedback' element={<UserFeedbackPage />} />
      </Routes>
    </div>
  )
}

export default App