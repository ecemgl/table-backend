const express = require('express');
const bodyParser = require('body-parser');
const { google } = require('googleapis');

const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use(bodyParser.json());

const credentials = require('./path-to-your-credentials-file.json');
const { client_email, private_key } = credentials;

const sheets = google.sheets({
  version: 'v4',
  auth: new google.auth.JWT({
    email: client_email,
    key: private_key,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  }),
});

const SPREADSHEET_ID = '1OuAOYaDVJOdHc1m9CyTHJ5skmynrhosl1CSxStlH5s8';

app.post('/api/feedback', async (req, res) => { 
  const { feedback } = req.body;
  try {
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: 'A:A', 
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [[feedback]],
      },
    });

    res.json({ success: true, message: 'Feedback saved successfully' });
  } catch (error) {
    console.error('Error saving feedback:', error);
    res.status(500).json({ success: false, message: 'Error saving feedback' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});



