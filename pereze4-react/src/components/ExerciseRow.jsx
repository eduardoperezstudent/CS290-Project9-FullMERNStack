import React, { useContext } from 'react';
import { FaTrashAlt, FaEdit } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { ExerciseContext } from '../context/ExerciseContext';

export default function ExerciseRow({ exercise, onDelete }) {
  const navigate = useNavigate();
  const { setExerciseToEdit } = useContext(ExerciseContext);

  const handleEditClick = () => {
    setExerciseToEdit(exercise);
    navigate('/edit');
  };

  const handleDeleteClick = () => {
    onDelete(exercise._id);
  };

  return (
    <tr className="exercise-row">
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
