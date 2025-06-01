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
 * Immediately connect to MongoDB before registering any routes.
 */
(async () => {
  try {
    await connect();
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1);
  }
})();

/**
 * POST /exercises
 *
 * Creates a new Exercise document. Expects a JSON body with exactly five properties:
 *   - name   (string, at least one character)
 *   - reps   (integer > 0)
 *   - weight (integer > 0)
 *   - unit   ("kgs" or "lbs", case‐insensitive)
 *   - date   (string matching /^\d\d-\d\d-\d\d$/ and a real calendar date)
 *
 * Success response:
 *   Status: 201
 *   Body: the newly created document (including its _id)
 *   Content-Type: application/json
 *
 * Failure response (invalid request):
 *   Status: 400
 *   Body: { "Error": "Invalid request" }
 *   Content-Type: application/json
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
 * Success response:
 *   Status: 200
 *   Body: [ { … }, { … }, … ]
 *   Content-Type: application/json
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
 *
 * Fetch one Exercise document by its MongoDB _id.
 *
 * Success response (found):
 *   Status: 200
 *   Body: { … }  // a single document object
 *   Content-Type: application/json
 *
 * Failure response (not found):
 *   Status: 404
 *   Body: { "Error": "Not found" }
 *   Content-Type: application/json
 */
app.get(
  '/exercises/:_id',
  asyncHandler(async (req, res) => {
    const { _id } = req.params;
    const doc = await findExerciseById(_id);

    if (!doc) {
      return res.status(404).json({ Error: 'Not found' });
    }
    return res.status(200).json(doc);
  })
);

/**
 * PUT /exercises/:_id
 *
 * Updates a document by its _id. Expects a JSON body with exactly the same five fields
 * (name, reps, weight, unit, date) and identical validation rules to POST.
 *
 * Success response:
 *   Status: 200
 *   Body: the updated document (with all fields and _id)
 *   Content-Type: application/json
 *
 * Failure response (invalid request):
 *   Status: 400
 *   Body: { "Error": "Invalid request" }
 *   Content-Type: application/json
 *
 * Failure response (not found):
 *   Status: 404
 *   Body: { "Error": "Not found" }
 *   Content-Type: application/json
 */
app.put(
  '/exercises/:_id',
  asyncHandler(async (req, res) => {
    const { _id } = req.params;
    const body = req.body;

    // 1) Validate request body
    const { valid } = validateRequestBody(body);
    if (!valid) {
      return res.status(400).json({ Error: 'Invalid request' });
    }

    // 2) Attempt to update the existing document
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

    // 3) Return the updated document
    return res.status(200).json(updated);
  })
);

/**
 * DELETE /exercises/:_id
 *
 * Deletes a document with the given :_id.
 *
 * Success response:
 *   Status: 204
 *   Body: <empty>
 *
 * Failure response (no such _id):
 *   Status: 404
 *   Body: { "Error": "Not found" }
 *   Content-Type: application/json
 */
app.delete(
  '/exercises/:_id',
  asyncHandler(async (req, res) => {
    const { _id } = req.params;
    const deleted = await deleteExerciseById(_id);

    if (!deleted) {
      return res.status(404).json({ Error: 'Not found' });
    }

    // If deletion succeeded, send 204 with no content
    return res.status(204).end();
  })
);

/**
 * Start the Express server on the specified PORT. The connection to MongoDB
 * has already been established in the IIFE above, so we simply log that the
 * server is listening.
 */
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});

/**
 * Helper function to validate the request body for POST and PUT.
 * Now “date” must not only match /\d\d-\d\d-\d\d/ but also be a real MM-DD-YY date.
 */
function validateRequestBody(body) {
  const allowedKeys = ['name', 'reps', 'weight', 'unit', 'date'];
  const keys = Object.keys(body);

  // Must have exactly 5 keys
  if (keys.length !== 5) {
    return { valid: false };
  }
  for (let key of keys) {
    if (!allowedKeys.includes(key)) {
      return { valid: false };
    }
  }

  // name: non-empty string
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

  // unit: string "kgs" or "lbs" (case-insensitive)
  if (typeof body.unit !== 'string') {
    return { valid: false };
  }
  const unitLower = body.unit.toLowerCase();
  if (unitLower !== 'kgs' && unitLower !== 'lbs') {
    return { valid: false };
  }

  // date: must be a real MM-DD-YY date (including leap‐year check)
  if (typeof body.date !== 'string') {
    return { valid: false };
  }
  if (!isValidDateMMDDYY(body.date)) {
    return { valid: false };
  }

  return { valid: true };
}

/**
 * Return true if `dateStr` is in MM-DD-YY format and is a valid calendar date
 * (year = 2000 + YY, with proper month/day/leap logic).
 */
function isValidDateMMDDYY(dateStr) {
  const regex = /^(\d\d)-(\d\d)-(\d\d)$/;
  const m = dateStr.match(regex);
  if (!m) return false;

  const month = Number(m[1]);
  const day   = Number(m[2]);
  const yy    = Number(m[3]);
  const fullYear = 2000 + yy;

  if (month < 1 || month > 12) return false;
  if (day < 1) return false;

  const d = new Date(fullYear, month - 1, day);
  if (
    d.getFullYear() !== fullYear ||
    d.getMonth()    !== (month - 1) ||
    d.getDate()     !== day
  ) {
    return false;
  }
  return true;
}
