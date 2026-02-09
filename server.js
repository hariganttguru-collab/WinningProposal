/**
 * Production server for Azure Web App.
 * Serves the built Vite/React app from frontend/dist with SPA fallback.
 */
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;
const DIST = path.join(__dirname, 'frontend', 'dist');

app.use(express.static(DIST));

// SPA fallback: all routes serve index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(DIST, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Serving app on port ${PORT}`);
});
