import React, { useContext } from 'react';
import { FaTrashAlt, FaEdit } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { ExerciseContext } from '../context/ExerciseContext';

/**
 * Renders one table row (one exercise). 
 * Columns: name, reps, weight, unit, date.
 * Then Delete icon and Edit icon.
 *
 * Props:
 *   - exercise: { _id, name, reps, weight, unit, date }
 *   - onDelete: function that takes (_id) and deletes it
 */
export default function ExerciseRow({ exercise, onDelete }) {
  const navigate = useNavigate();
  const { setExerciseToEdit } = useContext(ExerciseContext);

  const handleEditClick = () => {
    // 1. Store this exact exercise object in context:
    setExerciseToEdit(exercise);
    // 2. Navigate to /edit 
    navigate('/edit');
  };

  const handleDeleteClick = () => {
    // Immediately call the onDelete callback:
    onDelete(exercise._id);
  };

  return (
    <tr>
      <td>{exercise.name}</td>
      <td>{exercise.reps}</td>
      <td>{exercise.weight}</td>
      <td>{exercise.unit}</td>
      <td>{exercise.date}</td>
      <td className="icon-cell">
        <FaEdit
          className="icon edit-icon"
          title="Edit this exercise"
          onClick={handleEditClick}
        />
      </td>
      <td className="icon-cell">
        <FaTrashAlt
          className="icon delete-icon"
          title="Delete this exercise"
          onClick={handleDeleteClick}
        />
      </td>
    </tr>
  );
}
