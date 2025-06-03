import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Controlled form for creating a new exercise.
 *
 * Fields: name, reps, weight, unit (select), date (text).
 * On success (201), show alert, then navigate to Home.
 * On failure, show alert and still navigate Home.
 */
export default function AddExercisePage() {
  const [name, setName] = useState('');
  const [reps, setReps] = useState('1');
  const [weight, setWeight] = useState('1');
  const [unit, setUnit] = useState('kgs');
  const navigate = useNavigate();
 
  const today = new Date().toLocaleDateString('en-US', {
    year: '2-digit',
    month: '2-digit',
    day: '2-digit'
  });

  const [date, setDate] = useState(today.replace(/\//g, '-'));


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
    const res = await fetch('/exercises', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (res.status === 201) {
      alert(
        `Exercise created successfully:\n` +
        `Name: ${payload.name}\n` +
        `Reps: ${payload.reps}\n` +
        `Weight: ${payload.weight} ${payload.unit}\n` +
        `Date: ${payload.date}`
      );
    } else {
      alert(`Failed to create exercise (status ${res.status})`);
    }
  } catch (err) {
    console.error(err);
    alert('Error creating exercise.');
  } finally {
    navigate('/');
  }
};

  return (
    <div className="form-page">
      <h2>Log New Exercise</h2>
      <form onSubmit={handleSubmit} className="exercise-form">
        <label>
          Name:
          <input
            type="text"
            value={name}
            required
            placeholder="e.g. Push Ups"
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
            placeholder="e.g. 20"
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
            placeholder="e.g. 50"
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
            placeholder={today.replace(/\//g, '-')}
            onChange={(e) => setDate(e.target.value)}
          />
        </label>

        <div className="form-buttons">
          <button type="submit">
            Add
          </button>
          
          <button type="button" onClick={() => navigate('/')}>
            Cancel
          </button>
        </div>


      </form>
    </div>
  );
}
