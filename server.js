const express = require('express');
const multer = require('multer');
const path = require('path');
const app = express();
// const port = 3000;

// Serve static files from the 'public' folder
const staticDir = path.join(__dirname, 'public');
app.use(express.static(staticDir));

// Configure multer for file uploads
const upload = multer({
    dest: 'uploads/', // Destination folder for uploaded files
    limits: { fileSize: 50 * 1024 * 1024 } // Limit file size to 50MB
});

// Endpoint to handle file uploads
app.post('/upload', upload.single('file'), (req, res) => {
    res.send('File uploaded successfully');
});

// Serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(staticDir, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}/`);
});