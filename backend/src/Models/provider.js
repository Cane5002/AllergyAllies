const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    type: {
        required: true,
        type: String
    },
    dateGenerated: {
        required: true,
        type: Date
    },
    data: {
        required: true,
        type: mongoose.Schema.Types.Mixed
    }
});

const dataSchema = new mongoose.Schema({
    firstName: {
        required: true,
        type: String
    },
    lastName: {
        required: true,
        type: String
    },
    email: {
        required: true,
        type: String
    },
    password: {
        required: true,
        type: String
    },
    NPI: {
        required: true,
        type: String
    },
    practiceID: {
        required: false,
        type: String
    },
    providerCode: {
        required: false,
        type: String
    },
    reports: [reportSchema]
}, { collection: 'Providers' })

module.exports = mongoose.model('provider', dataSchema)