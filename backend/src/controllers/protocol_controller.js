const protocol = require('../Models/protocols');

const addProtocol = async (req, res) => {
    try {

        const {
            practiceID,
            nextDoseAdjustment,
            bottles,
            vialTestReactionAdjustment,
            missedDoseAdjustment,
            largeReactionsDoseAdjustment,
            injectionFrequency
        } = req.body

        const data = new protocol ({
            practiceID,
            nextDoseAdjustment,
            bottles,
            vialTestReactionAdjustment,
            missedDoseAdjustment,
            largeReactionsDoseAdjustment,
            injectionFrequency
        })
        const dataToSave = await data.save();
        res.status(200).json(dataToSave);
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const updateProtocol = async (req, res) => {
    try {
        let practiceID = req.params.practiceID

        console.log(req.body);
        let query = { practiceID }
        let newProtocol = await protocol.findOneAndUpdate(query, req.body, {new: true});
        //console.log(req.body);

        if (!newProtocol) {
            return res.status(400).json({ message: "Protocol not found"});
        }
        console.log(newProtocol);
        return res.status(200).json({ protocol: newProtocol });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

const getProtocol = async (req, res) => {
    try {
        const practiceID = req.params.practiceID;
        const foundProtocol = await protocol.findOne({ practiceID: practiceID }).exec();

        if (!foundProtocol) {
            return res.status(201).json({ message: "Protocol not found"});
        }

        return res.status(200).json({ protocol: foundProtocol });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

module.exports = {
    addProtocol,
    updateProtocol,
    getProtocol,
}