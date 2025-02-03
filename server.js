const express = require('express');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config(); // Load environment variables from .env if available

const app = express();

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Handle all routes to support SPA-like navigation
app.get('*', (req, res) => {
    console.log('Route accessed:', req.url);
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Use environment port if available, otherwise default (no explicit port specification)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
