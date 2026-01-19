const mongoose = require("mongoose");

const partSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});

const aircraftSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    parts: [partSchema]
});

module.exports = mongoose.model("Aircraft", aircraftSchema);
