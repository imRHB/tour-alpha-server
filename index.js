const express = require('express');
const app = express();
const port = process.env.PORT || 5000;


app.get('/', (req, res) => {
    res.send('Tour Alpha Server is running.');
});

app.listen(port, (req, res) => {
    console.log('Tour Alpha server is running at port', port);
});