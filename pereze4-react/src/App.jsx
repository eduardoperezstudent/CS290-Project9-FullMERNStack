import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { ExerciseProvider } from './context/ExerciseContext'
import HomePage from './pages/HomePage'
import AddExercisePage from './pages/AddExercisePage'
import EditExercisePage from './pages/EditExercisePage'

function App() {
  return (
    <ExerciseProvider>
      <div className="App">
        {/* --- Header with White Cat image & Title/Subtitle --- */}
        <header className="app-header">
          <div className="header-content">
            {/* Replace "/white-cat.png" with whatever your actual file is in public/ */}
            <img src="/white-cat.png" alt="White Cat Logo" className="white-cat-image" />
            <div className="header-text">
              <h1>White Cat Exercise Tracker</h1>
              <p>Keep track of all your workouts in one place</p>
            </div>
          </div>

          {/* --- Navigation Bar (shared on all pages) --- */}
          <nav>
            <Link to="/">Home</Link>
            <Link to="/add">Add Exercise</Link>
          </nav>
        </header>

        {/* --- Main Content: Router Outlet --- */}
        <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/add" element={<AddExercisePage />} />
              <Route path="/edit" element={<EditExercisePage />} />
            </Routes>
        </main>

        {/* --- Footer (shared on all pages) --- */}
        <footer className="app-footer">
          © 2025 Eduardo Perez
        </footer>
      </div>
    </ExerciseProvider>
  )
}

export default App