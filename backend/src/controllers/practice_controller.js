const { resolveSoa } = require('dns');
const practice = require('../Models/practice');
const multer = require('multer');
const path = require('path');

exports.addPractice = async (req, res) => {
    try {
        const { practiceName, providerNPIs, phoneNumber, email, address, officeHours, allergyShotHours, practiceCode } = req.body;
        const data = new practice({
            practiceName, providerNPIs, phoneNumber, email, address, officeHours, allergyShotHours, practiceCode
        });
        // PREVENT DUPLICATES
        console.log(req.body);
        const dataToSave = await data.save();
        return res.status(200).json(dataToSave);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

exports.getAllPractices = async (req, res) => {
    try {
        const practices = await practice.find();
        res.json(practices);
        console.log('200');
    }
    catch (e) {
        return res.status(400).json({message: 'Error retrieving practices'});
    }
}

exports.getPractice = async (req, res) => {
    // get all practice data from db
    try {
        const id = req.params.id;
        const practiceAcc = await practice.findById(id);
        if (!practiceAcc) {
            return res.status(404).json({ message: "Practice not found" });
        }

        return res.status(200).json(practiceAcc);
    } catch (err) {
        return res.status(400).json({ message: "Error retrieving practice" });
    }
}

exports.getPracticeByName = async (req, res) => {
    // get all practice data from db
    try {
        const name = req.params.name;
        const practiceAcc = await practice.findOne({practiceName: name});
        if (!practiceAcc) {
            return res.status(201).json({ message: "Practice not found" });
        }

        return res.status(200).json(practiceAcc);
    } catch (err) {
        return res.status(400).json({ message: "Error retrieving practice" });
    }
}

exports.getPracticeByCode = async (req, res) => {
    // get all practice data from db
    try {
        const pC = req.params.code;
        const practiceAcc = await practice.findOne({practiceCode: pC});
        if (!practiceAcc) {
            return res.status(201).json({ message: "Practice not found" });
        }

        return res.status(200).json(practiceAcc);
    } catch (err) {
        return res.status(400).json({ message: "Error retrieving practice" });
    }
}

exports.deletePractice = async (req, res) => {
    try {
        const id = req.params.id;
        const practiceToDelete = await practice.findById(id);
        if (!practiceToDelete) {
            res.status(404).json({ message: "Practice not found" });
        }
        const practiceName = practiceToDelete.practiceName;

        await practice.findByIdAndDelete(id);
        return res.status(200).json({ message: `Document with ${practiceName} has been deleted..` });
    }
    catch (error) {
        return res.status(400).json({ message: error.message })
    }
}

exports.getLocation = async (req, res) => {
    try {
        const practiceID = req.params.id;
        const practiceExtract = await practice.findById(practiceID);

        if (!practiceExtract) {
            return res.status(404).json({message: "Practice not found."});
        } 

        return res.json(practiceExtract.practiceAddress);

    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

// images can be compressed in the future to reduce storage size
exports.uploadLogo = async (req, res) => {
    // get practice id
    const id = req.params.id;
    const practiceToUpload = await practice.findById(id);
    if (!practiceToUpload) {
        res.status(404).json({ message: "Practice not found: ${id}" });
    }
    
    try {
        // store image locally
        const storage = multer.diskStorage({
            destination: (req, file, cb) => {
                const uploadPath = path.join(__dirname, '../images')
                cb(null, uploadPath);
            },
            filename: (req, file, cb) => {
                cb(null, id + "_logo.png");
            },
            limits: {
                fileSize: 8000000 // Compliant: 8MB
            }
        });

        // "image" name needs to match the key in postman when uploading:
        const upload = multer({ storage, limits: {fileSize: 500*1024} }).single('image');

        upload(req, res, (err) => {
            if (err) {
                if (err.code === 'LIMIT_FILE_SIZE') {
                    return res.status(400).json({ message: `File is too large`});
                } else {
                    return res.status(400).json({ message: `Error: ${err.message}` });
                }
            }

            console.log(req.file);

            // saves image path to document in collection
            practiceToUpload.logo = req.file.filename;
            practiceToUpload.save();

            return res.status(200).json({ message: "Image uploaded."});
        });
    } catch (error) {
        return res.status(400).json({ message: `Error w/ multer: ${error}`})
    }
}

// images can be decompressed in the future 
exports.getLogo = async (req, res) => {
    // get practice id
    const id = req.params.id;
    const practiceAcc = await practice.findById(id);
    if (!practiceAcc) {
        res.status(404).json({ message: "Practice not found: ${id}" });
    }

    // get file name
    const imagePath = path.join(__dirname, '../images/' + practiceAcc.logo);

    res.sendFile(imagePath);
}

exports.getScrollingAds = async (req, res) => {
    /*
        Needs more information. Should it be pictures uploaded, text generated 
        by program, self generated by program after gathering parameters, etc. 
    */
}

exports.getAntigensTested = async (req, res) => {
    try {
        const practiceID = req.params.id;
        const practiceExtract = await practice.findById(practiceID);

        if (!practiceExtract) {
            return res.status(404).json({message: "Practice not found."});
        } 

        return res.json(practiceExtract.antigensTested);

    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}