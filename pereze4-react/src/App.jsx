import { Routes, Route, Link } from 'react-router-dom'
import './App.css'
import { ExerciseProvider } from './context/ExerciseContext'
import HomePage from './pages/HomePage'
import CreateExercisePage from './pages/CreateExercisePage'
import EditExercisePage from './pages/EditExercisePage'

function App() {
  return (
    <ExerciseProvider>
      <div className="App">

        <header className="app-header">
          <div className="header-content">
            <Link to="/">
              <img src="/white-cat.png" alt="White Cat Logo" className="white-cat-image" />
            </Link>
            <div className="header-text">
              <h1>White Cat Workout Tracker</h1>
              <p>Flex Like a Feline</p>
            </div>
          </div>

          <nav>
            <Link to="/">Home</Link>
            <Link to="/add">Add Exercise</Link>
          </nav>
        </header>

        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/add" element={<CreateExercisePage />} />
            <Route path="/edit" element={<EditExercisePage />} />
          </Routes>
        </main>

        <footer className="app-footer">
          © 2025 Eduardo Perez
        </footer>
        
      </div>
    </ExerciseProvider>
  )
}

export default App
