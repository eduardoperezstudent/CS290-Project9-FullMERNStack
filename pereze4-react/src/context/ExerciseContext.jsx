import React, { createContext, useState } from 'react';

/**
 * We will store “exerciseToEdit” (the full object)
 * and a setter, in Context so EditExercisePage
 * can read it without making its own HTTP call.
 */
export const ExerciseContext = createContext({
  exerciseToEdit: null,
  setExerciseToEdit: () => {}
});

export function ExerciseProvider({ children }) {
  const [exerciseToEdit, setExerciseToEdit] = useState(null);

  return (
    <ExerciseContext.Provider value={{ exerciseToEdit, setExerciseToEdit }}>
      {children}
    </ExerciseContext.Provider>
  );
}