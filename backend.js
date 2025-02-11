// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// Initialize the Express app
const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json()); // Parse JSON request bodies
app.use(cors()); // Enable CORS for all routes

// In-memory storage for events (replace with a database in production)
let events = [];

// Default route to confirm the server is running
app.get('/', (req, res) => {
  res.send('Event Management Backend is running!');
});

// Create a new event
app.post('/events', (req, res) => {
  try {
    const { name, date, time, description, location } = req.body;

    // Validate required fields
    if (!name || !date || !time || !description || !location) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Create a new event
    const newEvent = {
      id: Date.now().toString(), // Generate a unique ID
      name,
      date,
      time,
      description,
      location,
    };

    // Add the event to the in-memory array
    events.push(newEvent);

    // Return the created event with a 201 status code
    res.status(201).json(newEvent);
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update an event
app.put('/events/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { date, time } = req.body;

    // Find the event by ID
    const event = events.find((e) => e.id === id);

    // If the event is not found, return a 404 error
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Update the event's date and time
    if (date) event.date = date;
    if (time) event.time = time;

    // Return the updated event
    res.json(event);
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get all events
app.get('/events', (req, res) => {
  try {
    // Return the list of events
    res.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get timeline events
app.get('/timeline', (req, res) => {
  try {
    // Format events for the timeline
    const timelineEvents = events.map((event) => ({
      id: event.id,
      name: event.name,
      date: event.date,
      time: event.time,
      description: event.description,
      location: event.location,
    }));

    // Return the timeline events
    res.json(timelineEvents);
  } catch (error) {
    console.error('Error fetching timeline events:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});