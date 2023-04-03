const express = require("express");
const config = require("./config/config");
const api = require("./api/api.js");
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// database
require('./database/db');

// body-parser
app.use(bodyParser.json());

// cors
app.use(cors());

// routes
app.use('/api/', api);

app.listen(config.port, function() {
    console.log('[Invoice-API] Database and API have been started.');
})