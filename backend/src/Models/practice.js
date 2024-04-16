const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    practiceName: {
        required: true,
        type: String
    },
    providerNPIs: {
        required: false,
        type: Array
    },
    address: {
        required: true,
        type: String
    },
    phoneNumber: {
        required: true,
        type: String
    },
    email: {
        required: false,
        type: String
    },
    officeHours: {
        required: false,
        type: String
    },
    allergyShotHours: {
        required: true,
        type: String
    },
    practiceCode: {
        required: true,
        type: String
    }
}, { collection: 'Practices' })

module.exports = mongoose.model('practice', dataSchema)