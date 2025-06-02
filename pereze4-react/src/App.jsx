import { useState } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ExerciseProvider } from './context/ExerciseContext'
import HomePage from './pages/HomePage'
import CreateExercisePage from './pages/CreateExercisePage'
import EditExercisePage from './pages/EditExercisePage'
import Header from './components/Header'
import Footer from './components/Footer'

function App() {
  return (
    <ExerciseProvider>
      <div className="App">
        <Header />

        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/add" element={<CreateExercisePage />} />
            <Route path="/edit" element={<EditExercisePage />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </ExerciseProvider>
  )
}

export default App
