import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ExerciseContext } from '../context/ExerciseContext';

export default function EditExercisePage() {
  const { exerciseToEdit } = useContext(ExerciseContext);
  const navigate = useNavigate();

  const today = new Date().toLocaleDateString('en-US', {
    year: '2-digit',
    month: '2-digit',
    day: '2-digit'
  });

  const [name, setName] = useState('');
  const [reps, setReps] = useState('1');
  const [weight, setWeight] = useState('1');
  const [unit, setUnit] = useState('kgs');
  const [date, setDate] = useState(today.replace(/\//g, '-'));

  useEffect(() => {
    if (exerciseToEdit) {
      setName(exerciseToEdit.name || '');
      setReps(exerciseToEdit.reps?.toString() || '1');
      setWeight(exerciseToEdit.weight?.toString() || '1');
      setUnit(exerciseToEdit.unit || 'kgs');
      setDate(exerciseToEdit.date || today.replace(/\//g, '-'));
    }
  }, [exerciseToEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
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
        alert(
          `Exercise Updated!\n` +
          `${payload.name}\n` +
          `${payload.reps} x ${payload.weight}${payload.unit} \n` +
          `Date: ${payload.date}`
        );
      } else {
        alert(`Failed to update (status ${res.status})`);
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
      <form onSubmit={handleSubmit} className="exercise-form">

        <div className="inline-field">
          <label htmlFor="name">Name:</label>
          <input
            id="name"
            type="text"
            className="wide-input"
            value={name}
            required
            placeholder="e.g. Push Ups"
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="row-fields">
          <div className="inline-field">
            <label htmlFor="reps">Reps:</label>
            <input
              id="reps"
              type="number"
              className="compact-input"
              value={reps}
              required
              min="1"
              onChange={(e) => setReps(e.target.value)}
            />
          </div>

          <div className="inline-field">
            <label htmlFor="weight">Weight:</label>
            <input
              id="weight"
              type="number"
              className="compact-input"
              value={weight}
              required
              min="1"
              onChange={(e) => setWeight(e.target.value)}
            />
          </div>

          <div className="inline-field">
            <label htmlFor="unit">Unit:</label>
            <select
              id="unit"
              className="compact-input"
              value={unit}
              required
              onChange={(e) => setUnit(e.target.value)}
            >
              <option value="kgs">kgs</option>
              <option value="lbs">lbs</option>
            </select>
          </div>
        </div>

        <div className="inline-field">
          <label htmlFor="date">Date:</label>
          <input
            id="date"
            type="text"
            className="wide-input"
            value={date}
            required
            placeholder={today.replace(/\//g, '-')}
            onChange={(e) => setDate(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const now = new Date();
                const mm = String(now.getMonth() + 1).padStart(2, '0');
                const dd = String(now.getDate()).padStart(2, '0');
                const yy = String(now.getFullYear()).slice(2);
                setDate(`${mm}-${dd}-${yy}`);
                e.preventDefault();
              }
            }}
          />
        </div>

        <div className="form-buttons">
          <button type="submit">Save</button>
          <button type="button" onClick={() => navigate('/')}>Cancel</button>
        </div>

      </form>
    </div>
  );
}
