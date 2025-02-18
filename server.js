const express = require('express');
const fs = require('fs').promises; // Use promises version of fs for async handling
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 1313;

// Use bodyParser to parse JSON bodies into JS objects
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Enable all CORS requests
app.use(cors());

// Function to append data to submissions.txt
async function appendToFile(data) {
    try {
        await fs.appendFile('submissions.txt', data + '\n');
        console.log('Data appended to file successfully');
    } catch (err) {
        console.error('Failed to write to file:', err);
        throw err;
    }
}

app.post('/submit', async (req, res) => {
    const { firstName, lastName, researchArea, courses } = req.body;
    const content = `First Name: ${firstName}, Last Name: ${lastName}, Research Area: ${researchArea}, Courses: ${courses}`;

    try {
        await appendToFile(content);
        res.status(200).send('Data received and written to file successfully');
    } catch (error) {
        res.status(500).send('Failed to write data to file');
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
