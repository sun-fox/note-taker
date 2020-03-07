var mongoose = require('mongoose');
const objectiveSchema = new mongoose.Schema({
    note: {
        type: String,
        required: true
    },
    date_added: {
        type: Date
    }
});
module.exports = objectiveSchema;