const mongoose = require('mongoose');

const nextDoseAdjustments = new mongoose.Schema({
    startingInjectionVol: {
        required: true,
        type: Number,
    },
    maxInjectionVol: {
        required: true,
        type: Number,
    },
    injectionVolumeIncreaseInterval: { // Injection increase interval
        required: true,
        type: Number,
    },
})

// may need multiple of these, for different missedDays values
const missedDoseAdjustments = new mongoose.Schema ({
    daysMissed: {
        required: true,
        type: Number,
    },
    action: {
        required: true,
        type: String
    },
    injectionVolumeDecrease: {
        required: true,
        type: Number,
    },
    decreaseVialConcentration: {
        required: true,
        type: Number,
    },
    decreaseBottleNumber: {
        required: true,
        type: Number,
    },
})

// dose adjustments for skin reactions to medicine
const largeReactionsDoseAdjustments = new mongoose.Schema({
    whealLevelForAdjustment: {
        required: true,
        type: Number,
    },
    action: {
        required: true,
        type: String
    },
    decreaseInjectionVol: {
        required: true,
        type: Number,
    },
    adjustVialConcentration: {
        required: true,
        type: Number,
    },
    adjustBottleNumber: {
        required: true,
        type: Number,
    }
})

const vialTestReactionAdjustments = new mongoose.Schema({
    whealLevelForAdjustment: {
        required: true,
        type: Number,
    },
    action: {
        required: true,
        type: String
    },
    decreaseInjectionVol: {
        required: true,
        type: Number,
    },
    adjustVialConcentration: {
        required: true,
        type: Number,
    },
    adjustBottleNumber: {
        required: true,
        type: Number,
    }
})

const bottleSchema = new mongoose.Schema({
    bottleName: {
        require: true,
        type: String,
    },
    // months
    shelfLife: {
        require: true,
        type: Number
    },
})

const injectionFrequency = new mongoose.Schema({
    freq: {
        require: true,
        type: Number
    },
    interval: {
        require: true,
        type: String
    }
})

// we need default values 
const dataSchema = new mongoose.Schema({
    practiceID: {
        required: true,
        type: String
    },
    nextDoseAdjustment: nextDoseAdjustments,
    largeReactionsDoseAdjustment: largeReactionsDoseAdjustments,
    bottles: [bottleSchema],
    vialTestReactionAdjustment: vialTestReactionAdjustments,
    triggers: Array,
    missedDoseAdjustment: [missedDoseAdjustments],
    largeReactionsDoseAdjustment: largeReactionsDoseAdjustments,
    injectionFrequency: injectionFrequency  
}, { collection: 'Protocols' })

module.exports = mongoose.model('protocol', dataSchema)