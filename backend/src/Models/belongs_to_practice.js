const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    practiceID: {
        required: true,
        type: String
    },
    providerNPI: {
        required: true,
        type: Number
    }
}, { collection: 'Practices' })

module.exports = mongoose.model('belongs_to_practice', dataSchema)