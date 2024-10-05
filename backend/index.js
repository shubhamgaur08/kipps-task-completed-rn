const { google } = require('googleapis');
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Load credentials
const keyPath = path.join(__dirname, 'service-account-file.json');


// Configure JWT for Google API
const auth = new google.auth.GoogleAuth({
  keyFile: keyPath,
  scopes: ['https://www.googleapis.com/auth/calendar.readonly',
    'https://www.googleapis.com/auth/calendar.events.readonly',
    'https://www.googleapis.com/auth/calendar.events'
  ],
});

const calendar = google.calendar({ version: 'v3', auth });
app.get('/', (req, res) => {
  res.send('Hello World!');
})

// Endpoint to get today's events
app.get('/events', async (req, res) => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    console.log('Time range:', startOfDay.toISOString(), 'to', endOfDay.toISOString());

    const events = await calendar.events.list({
      calendarId: 'supermern13@gmail.com',
      timeMin: startOfDay.toISOString(),
      timeMax: endOfDay.toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
    });

    console.log('Fetched events:', events); // Check the full events object

    res.json(events.data.items);
  } catch (error) {
    console.error('Error fetching events: ', error);
    res.status(500).send('Error fetching events');
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});