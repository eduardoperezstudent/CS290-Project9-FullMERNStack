import React from 'react';
import ExerciseRow from './ExerciseRow';

/**
 * Renders an HTML table of *all* exercises.
 *
 * Props:
 *   - exercises: array of exercise‐objects fetched from backend
 *   - onDelete: function to delete by id
 *
 * Will map each exercise → <ExerciseRow />
 */
export default function ExerciseList({ exercises, onDelete }) {
  return (
    <table className="exercise-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Reps</th>
          <th>Weight</th>
          <th>Unit</th>
          <th>Date</th>
          <th>Edit</th>
          <th>Delete</th>
        </tr>
      </thead>
      <tbody>
        {exercises.map((ex) => (
          <ExerciseRow
            key={ex._id}
            exercise={ex}
            onDelete={onDelete}
          />
        ))}
      </tbody>
    </table>
  );
}
