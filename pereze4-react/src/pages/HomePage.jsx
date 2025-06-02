import React, { useState, useEffect } from 'react';
import ExerciseList from '../components/ExerciseList';

export default function HomePage() {
  const [exercises, setExercises] = useState([]);
  const [error, setError] = useState(null);

  // 1) Fetch all exercises on mount
  useEffect(() => {
    async function loadExercises() {
      try {
        const res = await fetch('/exercises');
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        const data = await res.json();
        setExercises(data);
      } catch (err) {
        console.error(err);
        setError('Failed to load exercises.');
      }
    }
    loadExercises();
  }, []);

  // 2) Handler to delete one exercise by ID
  const handleDelete = async (_id) => {
    try {
      const res = await fetch(`/exercises/${_id}`, {
        method: 'DELETE'
      });
      if (res.status === 204) {
        // Remove it from local state so table updates immediately:
        setExercises((prev) => prev.filter((ex) => ex._id !== _id));
      } else {
        // Could show an error message here:
        alert(`Failed to delete (status ${res.status})`);
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
      <ExerciseList
        exercises={exercises}
        onDelete={handleDelete}
      />
    </div>
  );
}
