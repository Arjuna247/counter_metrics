const express = require('express');
const app = express();

app.get('http://localhost:3000/api/data', (req, res) => {
    res.json({ message: 'Hello from the backend!' });
})

app.listen(3000, () => {
    console.log('Backend server is running on http://localhost:3000');
});