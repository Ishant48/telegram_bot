const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    frequency: Number,
    telegramKey: String,
    weatherKey: String,
});

module.exports = mongoose.model('Admin', adminSchema);
