
const express = require('express');
const app = express();
const port = 3000;

app.get('/', (_req, res) => res.sendFile(__dirname + '/client/dist/index.html'));
app.use(express.static(__dirname + '/client/dist'));

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));
