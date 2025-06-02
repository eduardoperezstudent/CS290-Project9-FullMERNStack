import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ExerciseContext } from '../context/ExerciseContext';

/**
 * Controlled form for updating an existing exercise.
 * Fields are pre‐filled via the context value “exerciseToEdit”.
 *
 * On load, if context is empty, redirect back to Home (no data to edit).
 * Otherwise, populate local fields with that object’s values.
 */
export default function EditExercisePage() {
  const { exerciseToEdit } = useContext(ExerciseContext);
  const [name, setName] = useState('');
  const [reps, setReps] = useState('');
  const [weight, setWeight] = useState('');
  const [unit, setUnit] = useState('kgs');
  const [date, setDate] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // If context is null, we have nothing to edit → bounce to Home
    if (!exerciseToEdit) {
      navigate('/');
      return;
    }
    // Otherwise, fill in the form fields:
    setName(exerciseToEdit.name);
    setReps(exerciseToEdit.reps);
    setWeight(exerciseToEdit.weight);
    setUnit(exerciseToEdit.unit);
    setDate(exerciseToEdit.date);
  }, [exerciseToEdit, navigate]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!exerciseToEdit) return;

    const payload = {
      name: name.trim(),
      reps: parseInt(reps, 10),
      weight: parseInt(weight, 10),
      unit: unit.toLowerCase(),
      date: date.trim()
    };

    try {
      const res = await fetch(`/exercises/${exerciseToEdit._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.status === 200) {
        alert('Exercise updated successfully!');
      } else {
        alert(`Failed to update (${res.status})`);
      }
    } catch (err) {
      console.error(err);
      alert('Error updating exercise.');
    } finally {
      navigate('/');
    }
  };

  return (
    <div className="form-page">
      <h2>Edit Exercise</h2>
      <form onSubmit={handleSave} className="exercise-form">
        <label>
          Name:
          <input
            type="text"
            value={name}
            required
            onChange={(e) => setName(e.target.value)}
          />
        </label>

        <label>
          Reps:
          <input
            type="number"
            value={reps}
            required
            min="1"
            onChange={(e) => setReps(e.target.value)}
          />
        </label>

        <label>
          Weight:
          <input
            type="number"
            value={weight}
            required
            min="1"
            onChange={(e) => setWeight(e.target.value)}
          />
        </label>

        <label>
          Unit:
          <select
            value={unit}
            required
            onChange={(e) => setUnit(e.target.value)}
          >
            <option value="kgs">kgs</option>
            <option value="lbs">lbs</option>
          </select>
        </label>

        <label>
          Date (MM-DD-YY):
          <input
            type="text"
            value={date}
            required
            placeholder="06-01-25"
            onChange={(e) => setDate(e.target.value)}
          />
        </label>

        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
}