const mongoose = require('mongoose');
const { database } = require("../config/config.js");

mongoose.set('strictQuery', true);
mongoose.connect(database, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});