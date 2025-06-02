/**
 * Eduardo Perez
 */
import 'dotenv/config';
import express from 'express';
import asyncHandler from 'express-async-handler';
import {
  connect,
  createExercise,
  findAllExercises,
  findExerciseById,
  updateExerciseById,
  deleteExerciseById
} from './exercises_model.mjs';

const PORT = process.env.PORT;
const app = express();

app.use(express.json());


/**
 * Start the Express server on the specified PORT.
 */
app.listen(PORT, async () => {
  await connect();
  console.log(`Server listening on port ${PORT}...`);
});



/**
 * Return true if `id` is exactly 24 hexadecimal characters.
 * We use this to short-circuit and return 404 before Mongoose tries to cast.
 */
function isValidHexId(id) {
  return /^[0-9a-fA-F]{24}$/.test(id);
}


/**
 * Helper function to validate the request body for POST and PUT.
 * The body must be an object with exactly these five keys:
 *   - name   (string, at least one character)
 *   - reps   (integer > 0)
 *   - weight (integer > 0)
 *   - unit   ("kgs" or "lbs", case‐insensitive)
 *   - date   (string matching /^\d\d-\d\d-\d\d$/)
 *
 * Returns an object { valid: boolean }.
 */
function validateRequestBody(body) {
  const allowedKeys = ['name', 'reps', 'weight', 'unit', 'date'];
  const keys = Object.keys(body);

  // Must have exactly 5 keys, no extras or missing
  if (keys.length !== 5) {
    return { valid: false };
  }
  for (let key of keys) {
    if (!allowedKeys.includes(key)) {
      return { valid: false };
    }
  }

  // name: non‐empty string
  if (typeof body.name !== 'string' || body.name.trim().length === 0) {
    return { valid: false };
  }

  // reps: integer > 0
  if (
    typeof body.reps !== 'number' ||
    !Number.isInteger(body.reps) ||
    body.reps <= 0
  ) {
    return { valid: false };
  }

  // weight: integer > 0
  if (
    typeof body.weight !== 'number' ||
    !Number.isInteger(body.weight) ||
    body.weight <= 0
  ) {
    return { valid: false };
  }

  // unit: string "kgs" or "lbs" (case‐insensitive)
  if (typeof body.unit !== 'string') {
    return { valid: false };
  }
  const unitLower = body.unit.toLowerCase();
  if (unitLower !== 'kgs' && unitLower !== 'lbs') {
    return { valid: false };
  }

  // date: string matching MM-DD-YY
  if (typeof body.date !== 'string') {
    return { valid: false };
  }
  const format = /^\d\d-\d\d-\d\d$/;
  if (!format.test(body.date)) {
    return { valid: false };
  }

  return { valid: true };
}

/**
 * POST /exercises
 *
 * Creates a new Exercise document. Expects a JSON body with exactly five properties:
 *   - name   (string, at least one character)
 *   - reps   (integer > 0)
 *   - weight (integer > 0)
 *   - unit   ("kgs" or "lbs", case-insensitive)
 *   - date   (string matching /^\d\d-\d\d-\d\d$/)
 *
 */
app.post(
  '/exercises',
  asyncHandler(async (req, res) => {
    const body = req.body;
    const { valid } = validateRequestBody(body);

    if (!valid) {
      return res.status(400).json({ Error: 'Invalid request' });
    }

    // Normalize unit to lowercase before storing
    const exerciseData = {
      name: body.name,
      reps: body.reps,
      weight: body.weight,
      unit: body.unit.toLowerCase(),
      date: body.date
    };

    const created = await createExercise(exerciseData);
    return res.status(201).json(created);
  })
);

/**
 * GET /exercises
 *
 * Returns the entire "exercises" collection as an array.
 *
 */
app.get(
  '/exercises',
  asyncHandler(async (_req, res) => {
    const all = await findAllExercises();
    return res.status(200).json(all);
  })
);

/**
 * GET /exercises/:_id
 * Fetch one Exercise document by its MongoDB _id.
 * First check that req.params._id is exactly 24 hex chars.
 * If not, immediately return 404.
 *
 */
app.get(
  '/exercises/:_id',
  asyncHandler(async (req, res) => {
    const { _id } = req.params;

    if (!isValidHexId(_id)) {
      return res.status(404).json({ Error: 'Not found' });
    }

    const doc = await findExerciseById(_id);
    if (!doc) {
      return res.status(404).json({ Error: 'Not found' });
    }
    return res.status(200).json(doc);
  })
);

/**
 * PUT /exercises/:_id
 * Updates a document by its _id. Expects a JSON body with exactly the same five fields
 * (name, reps, weight, unit, date) and identical validation rules to POST.
 *
 * Request validation order:
 *   1. Verify that :_id is 24‐hex; if not, 404.
 *   2. Verify body is valid (same five fields, correct format); if invalid → 400.
 *   3. Otherwise, attempt to update; if no document existed, return 404.
 *   4. If updated, return 200 + updated doc.
 */
app.put(
  '/exercises/:_id',
  asyncHandler(async (req, res) => {
    const { _id } = req.params;
    const body = req.body;

    // 1) Check id format
    if (!isValidHexId(_id)) {
      return res.status(404).json({ Error: 'Not found' });
    }

    // 2) Validate request body
    const { valid } = validateRequestBody(body);
    if (!valid) {
      return res.status(400).json({ Error: 'Invalid request' });
    }

    // 3) Attempt to update the existing document
    const updated = await updateExerciseById(_id, {
      name: body.name,
      reps: body.reps,
      weight: body.weight,
      unit: body.unit.toLowerCase(),
      date: body.date
    });

    // If no document was found with that _id, updateExerciseById returns null
    if (!updated) {
      return res.status(404).json({ Error: 'Not found' });
    }

    // 4) Return the updated document
    return res.status(200).json(updated);
  })
);

/**
 * DELETE /exercises/:_id
 * Deletes a document with the given :_id.
 *
 */
app.delete(
  '/exercises/:_id',
  asyncHandler(async (req, res) => {
    const { _id } = req.params;

    // 1) If id is not 24 hex characters, return 404
    if (!isValidHexId(_id)) {
      return res.status(404).json({ Error: 'Not found' });
    }

    // 2) Attempt deletion
    const deleted = await deleteExerciseById(_id);
    if (!deleted) {
      return res.status(404).json({ Error: 'Not found' });
    }

    // 3) Return 204 if it was deleted
    return res.status(204).end();
  })
);


