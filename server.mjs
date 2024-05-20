import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import 'dotenv/config';

const app = express();

mongoose.set('strictQuery', false);

mongoose.connect(
  process.env.MONGODB_CONNECT_STRING,
  { useNewUrlParser: true }
);

const db = mongoose.connection;

db.once('open', () => {   //make sure db connection is good
  console.log('Successfully connected to MongoDB using Mongoose!');
});

app.use(express.json()); // Parse JSON bodies

app.use(cors());  //to allow any browser access

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.listen(3000, () => {        //make sure connection is good
  console.log('Server is running on port 3000');
});

// define the schema
const documentSchema = new mongoose.Schema({
  id: String,
  title: String,
  artist: String,
  genre: String,
  popularity: Number,
  date: Date,
});

// Create the Document using the schema
const Document = mongoose.model('Songs', documentSchema);

// Endpoint to create a song
app.post('/create-song', async (req, res) => {
  const { title, artist, genre, popularity, date } = req.body;    //get in the parameters
  try {
    await createSong(title, artist, genre, popularity, date);   //call the func to upload to database
    res.status(200).send('Song created successfully');
  } catch (error) {
    console.log('Error uploading document:', error);
    res.status(500).send('Internal server error');
  }
});
// Define the asynchronous function
async function createSong(title, artist, genre, popularity, dateString) {
  try {
    const date = new Date(dateString);
    // Create a new document instance
    const document = new Document({ title, artist, genre, popularity, date });
    // Save the document to the database
    await document.save();
  } catch (error) {
    throw error;
  }
}
// Endpoint to delete a song
app.delete('/delete-song', async (req, res) => { // Use app.delete 
  const { id } = req.body; // Access the ID from req.body correctly
  try {
    await deleteSong(id);
    res.status(200).send('Song deleted successfully'); // Update the response message
  } catch (error) {
    console.log('Error deleting document:', error);
    res.status(500).send('Internal server error');
  }
});
async function deleteSong(id) {
    try {
        // Delete the document with the specified id
        await Document.deleteOne({ _id: id });
        console.log('Document deleted successfully!');
    } catch (error) {
        console.error('Error deleting document:', error);
    }
}
app.get('/songs', async (req, res) => {//server endpoint to get all songs
  try {
    const songs = await getAllSongs(); // Call the function to retrieve all songs
    res.status(200).json(songs); // Return the songs as a JSON response
  } catch (error) {
    console.log('Error retrieving songs:', error);
    res.status(500).send('Internal server error');
  }
});
async function getAllSongs() {
    try {
      // Retrieve all documents from the "Music" collection
      console.log("no error")
      const songs = await Document.find({});
      return songs;
    } catch (error) {
      console.log("error")
      return []; // Return an empty array in case of an error
    }
}
app.get('/search', async (req, res) => {
  const { genre } = req.query; // Access the genre from req.query instead of req.body
  try {
    const songs = await songSearch(genre); // Call the function to retrieve all songs
    res.status(200).json(songs); // Return the songs as a JSON response
  } catch (error) {
    console.log('Error retrieving songs:', error);
    res.status(500).send('Internal server error');
  }
});
async function songSearch(genre) {
    try {
      // Search for songs with the specified genre
      const songs = await Document.find({ genre });
      return songs;
    } catch (error) {
      return []; // Return an empty array in case of an error
    }
}
app.put('/update-song', async (req, res) => {
  const { id, title, artist, genre, released, popularity } = req.body; // Get the parameters from req.body
  try {
    await updateSong(id, title, artist, genre, released, popularity); //call the function
    res.status(200).send('Song updated successfully');
  } catch (error) {
    console.log('Error updating song:', error);
    res.status(500).send('Internal server error');
  }
});
async function updateSong(id, title, artist, genre, released, popularity) {
    try {
      const date = new Date(released);
      // Update the document with the specified ID
      await Document.updateOne(
        { _id: id  },
        { $set: { title, artist, genre, date, popularity } }
      );
    } catch (error) {
      console.log("error")
    }
}







