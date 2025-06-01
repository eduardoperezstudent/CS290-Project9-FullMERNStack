/**
 * Eduardo Perez
 */
import mongoose from 'mongoose';
import 'dotenv/config';

const EXERCISE_DB_NAME = 'exercise_db';
let connection = undefined;

/**
 * This function connects to the MongoDB server and to the database
 *  'exercise_db' in that server.
 */
async function connect() {
  try {
    connection = await mongoose.connect(process.env.MONGODB_CONNECT_STRING, {
      dbName: EXERCISE_DB_NAME
    });
    console.log("Successfully connected to MongoDB using Mongoose!");
  } catch (err) {
    console.log(err);
    throw Error(`Could not connect to MongoDB: ${err.message}`);
  }
}

/**
 * Define the Mongoose schema for the "exercises" collection.
 * Each document must have the following properties:
 *  - name:     String, required, at least one character
 *  - reps:     Number, required, integer > 0
 *  - weight:   Number, required, integer > 0
 *  - unit:     String, required, either "kgs" or "lbs"
 *  - date:     String, required, format "MM-DD-YY"
 */
const exerciseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 1
  },
  reps: {
    type: Number,
    required: true,
    min: 1,
    validate: {
      validator: Number.isInteger,
      message: 'reps must be an integer'
    }
  },
  weight: {
    type: Number,
    required: true,
    min: 1,
    validate: {
      validator: Number.isInteger,
      message: 'weight must be an integer'
    }
  },
  unit: {
    type: String,
    required: true,
    enum: ['kgs', 'lbs']
  },
  date: {
    type: String,
    required: true,
    match: [/^\d\d-\d\d-\d\d$/, 'date must be in MM-DD-YY format']
  }
});

// Create the model class from the schema
const Exercise = mongoose.model('Exercise', exerciseSchema);

/**
 * Creates a new Exercise document in the database.
 *
 * @param {Object} data
 *   An object containing exactly these properties:
 *     - name   (string)
 *     - reps   (number)
 *     - weight (number)
 *     - unit   (string, already lowercase "kgs" or "lbs")
 *     - date   (string in "MM-DD-YY" format)
 *
 * @returns {Promise<Object>}
 *   Resolves to the newly created document (including its _id).
 */
async function createExercise(data) {
  const exercise = new Exercise({
    name: data.name,
    reps: data.reps,
    weight: data.weight,
    unit: data.unit,
    date: data.date
  });
  const saved = await exercise.save();
  return saved.toObject();
}

/**
 * Retrieves all Exercise documents from the collection.
 *
 * @returns {Promise<Array<Object>>}
 *   Resolves to an array of exercise objects (each includes _id).
 */
async function findAllExercises() {
  const docs = await Exercise.find({}).lean().exec();
  return docs;
}

/**
 * Finds a single Exercise document by its MongoDB _id.
 *
 * @param {string} id
 *   The string representation of the ObjectId to look up.
 *
 * @returns {Promise<Object|null>}
 *   Resolves to the document object (including _id) if found, or null if not found.
 */
async function findExerciseById(id) {
  const doc = await Exercise.findById(id).lean().exec();
  return doc;
}

/**
 * Updates one Exercise document by its _id. Returns the updated document.
 *
 * @param {string} id
 *   The string representation of the ObjectId to update.
 * @param {Object} data
 *   An object containing exactly these five properties to overwrite:
 *     - name   (string)
 *     - reps   (number)
 *     - weight (number)
 *     - unit   (string, lowercase "kgs" or "lbs")
 *     - date   (string in "MM-DD-YY" format)
 *
 * @returns {Promise<Object|null>}
 *   Resolves to the updated document (including _id) if it existed; or null if no document matched.
 */
async function updateExerciseById(id, data) {
  const updated = await Exercise.findByIdAndUpdate(
    id,
    {
      name: data.name,
      reps: data.reps,
      weight: data.weight,
      unit: data.unit,
      date: data.date
    },
    {
      new: true,
      runValidators: true
    }
  )
    .lean()
    .exec();
  return updated;
}

/**
 * Deletes one Exercise document by its _id.
 *
 * @param {string} id
 *   The string representation of the ObjectId to delete.
 *
 * @returns {Promise<boolean>}
 *   Resolves to true if a document was deleted, or false if no document matched.
 */
async function deleteExerciseById(id) {
  const result = await Exercise.deleteOne({ _id: id }).exec();
  return result.deletedCount === 1;
}

// Export only the functions (do not export the Exercise model class)
export {
  connect,
  createExercise,
  findAllExercises,
  findExerciseById,
  updateExerciseById,
  deleteExerciseById
};