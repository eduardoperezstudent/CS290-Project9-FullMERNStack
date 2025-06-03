import React from 'react';
import ExerciseRow from './ExerciseRow';
import { useNavigate } from 'react-router-dom';

export default function ExerciseList({ exercises, onDelete }) {
  const navigate = useNavigate();

  if (!exercises || exercises.length === 0) {
    return (
      <div className="empty-message">
        <p>You have no logged exercise.<br />Start by creating your first one!</p>
        <button onClick={() => navigate('/add')} className="add-exercise-btn">
          🐱 Add Your First Exercise
        </button>
      </div>
    );
  }

  return (
    <table className="exercise-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Reps</th>
          <th>Weight</th>
          <th>Unit</th>
          <th>Date</th>
          <th colSpan="2">Actions</th>
        </tr>
      </thead>
      <tbody>
        {exercises.map((ex) => (
          <ExerciseRow key={ex._id} exercise={ex} onDelete={onDelete} />
        ))}
      </tbody>
    </table>
  );
}
