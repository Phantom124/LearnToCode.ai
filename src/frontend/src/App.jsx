import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import './App.css'
import './styles/Homepage.css'
import './styles/Typography.css'
import './styles/Login.css'
import './styles/Signup.css'
import './styles/Sidebar.css'
import './styles/Practice.css'
import Homepage from './pages/Homepage'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard';
import Practice from './pages/Practice';
import Leaderboard from './pages/Leaderboard';

function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <>
            <Homepage/>
          </>
        }/>

        <Route path="/login" element={
          <>
            <Login/>
          </>
        }/>

        <Route path="/signup" element={
          <>
            <Signup/>
          </>
        }/>

        <Route path="/dashboard" element={
          <>
            <Dashboard/>
          </>
        }/>

        <Route path="/practice" element={
          <>
            <Practice/>
          </>
        }/>

        <Route path="/leaderboard" element={
          <>
            <Leaderboard/>
          </>
        }/>
    
      </Routes>
    </Router>
  )
}

export default App
