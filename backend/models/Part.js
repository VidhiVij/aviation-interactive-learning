const mongoose = require('mongoose');
const PartSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});
module.exports = mongoose.model('Part', PartSchema);
