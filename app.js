const express = require('express');
const app = express();

// Establish routes
require('./routes/geopoints')(app);

// Establish middleware for static files
app.use(express.static('public'));



// app.get('/api/geodata/:orderid/:timestamp', (req, res) => {
//     res.json({
//         msg: 'You have reached the order tracking application',
//         orderid: req.params.orderid,
//         timestamp: req.params.timestamp
//     });


// });


let port = 5000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});