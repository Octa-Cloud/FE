import React from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home.jsx'
import SleepDashboard from './pages/SleepDashboard.jsx'
import SleepSetup from './pages/SleepSetup.jsx'
import SleepMeasuring from './pages/SleepMeasuring.jsx'
import WakeUp from './pages/WakeUp.jsx'
import WakeUpSummary from './pages/WakeUpSummary.jsx'

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<SleepDashboard />} />
        <Route path="/sleep-setup" element={<SleepSetup />} />
        <Route path="/sleep-measuring" element={<SleepMeasuring />} />
        <Route path="/wakeup" element={<WakeUp />} />
        <Route path="/wake-up-summary" element={<WakeUpSummary />} />
      </Routes>
    </Router>
  )
}
