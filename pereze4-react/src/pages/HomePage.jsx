import React, { useState, useEffect } from 'react';
import ExerciseTable from '../components/ExerciseTable';

export default function HomePage() {
  const [exercises, setExercises] = useState([]);
  const [error, setError] = useState(null);
  const [toastClass, setToastClass] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    async function loadExercises() {
      try {
        const res = await fetch('/exercises');
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        const data = await res.json();
        setExercises(data);
      } catch (err) {
        console.error(err);
        setError('Failed to load exercises.');
      }
    }
    loadExercises();
  }, []);

  const showToast = (message) => {
    setToastMessage(message);
    setToastClass('');
    setTimeout(() => setToastClass('hide'), 1000);
    setTimeout(() => setToastMessage(''), 2000);
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/exercises/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setExercises(prev => prev.filter(ex => ex._id !== id));
        showToast('\u274C Exercise Deleted');
      } else {
        alert('Failed to delete');
      }
    } catch (err) {
      console.error(err);
      alert('Error deleting exercise.');
    }
  };

  return (
    <div className="home-page">
      <h2>All Exercises</h2>
      {error && <p className="error-msg">{error}</p>}
      <ExerciseTable exercises={exercises} onDelete={handleDelete} />
      {toastMessage && <div className={`toast ${toastClass}`}>{toastMessage}</div>}
    </div>
  );
}
