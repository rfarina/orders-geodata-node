const express = require('express');
const app = express();

// Establish middleware for static files
app.use(express.static('public'));

// Establish routes
require('./routes/geopoints.js')(app);



let port = 5001;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});