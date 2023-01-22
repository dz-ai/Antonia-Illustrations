const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.static(path.join(__dirname, 'frontend', 'dist')));
// app.use(express.json())

app.get('/api', (req, res) => {
    res.json({res: "hello"})
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend', 'dist', 'index.html'));
});

app.listen(PORT, () => console.log(PORT));