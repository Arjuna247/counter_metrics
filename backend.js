const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());
app.post('/save-count', (req, res) => {
    console.log('Button count:', req.body.count);
    res.json({ success:true, storedCount: req.body.count });
});


app.listen(3000, () => 
    console.log('Backend server is running on 3000'));