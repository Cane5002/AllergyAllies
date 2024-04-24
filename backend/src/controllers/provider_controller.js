const practice = require('../Models/practice');
const provider = require('../Models/provider');
const crypto = require('crypto');

// Function to generate a random code
function generateRandomCode() {
    const length = 6;
    return crypto.randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length);
}

// Post method - TEST CRYPTO, TEST USAGE OF PRACTICE ID, GENERATE PRACTICE ID
exports.addProvider = async (req, res) => {
    try {
        const { firstName, lastName, email, password, NPI, practiceCode} = req.body;

        // Validate New Provider
            //Practice Code
        let codeResponse = await practice.findOne({practiceCode});
        if (!codeResponse) return res.status(200).json({message: 'Incorrect practice code!'});
        console.log(codeResponse);
            //NPI
        // Used to check if provider has a valid NPI, WIP
        //const NPIreigstryURI = `https://npiregistry.cms.hhs.gov/api/?number=${NPI}&pretty=&version=2.1`
        // const NPIreigstryURI = `https://clinicaltables.nlm.nih.gov/api/npi_org/v3/search?terms=${NPI}`
        //const NPIexists = await axios.get(NPIreigstryURI);
        if (!codeResponse.providerNPIs) return res.status(200).json({message: 'Error accessing your practice'});
        if (!codeResponse.providerNPIs.includes(NPI)) return res.status(200).json({message: 'This NPI has not been approved by your practice!'});
        // Check if npi is already in use
        let npiResponse = await provider.findOne({NPI});
        if (npiResponse) return res.status(200).json({message: 'Please confirm that this is your NPI'});
        // Check if the email already has an associated account
        let emailResponse = await provider.findOne({email})
        if (emailResponse) return res.status(200).json({message: 'This email is already associated with an account!'});
        
        /*"Cannot read properties of undefined (reading 'ProviderNPIs')"*/

        const providerCode = generateRandomCode();
        const newProvider = new provider({
            firstName, lastName, email, password, NPI, practiceID: codeResponse._id, providerCode
        });

        let savedProvider = await newProvider.save();
        res.status(201).json(savedProvider);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Get all method
exports.getAllProviders = async (req, res) => {
    try {
        const data = await provider.find();
        res.json(data)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Get provider by email
exports.getProviderEmail = async (req, res) => {
    try {
        const email = req.body.email.toString();
        const NPI = req.body.NPI.toString();
        const data = await provider.findOne({ email: email });
        const data2 = await provider.findOne({ NPI: NPI});
        if (data === null) {
            if(data2 === null){
                res.sendStatus(200);
            }
            else{
                res.sendStatus(208);
            }
        }
        else {
            res.sendStatus(201);
        }
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
}

// Delete by ID method
exports.deleteProvider = async (req, res) => {
    try {
        const id = req.params.id;
        const providerToDelete = await provider.findById(id);
        if (!providerToDelete) {
            res.status(404).json({ message: "Provider not found" });
        }
        const firstname = providerToDelete.firstName;

        await provider.findByIdAndDelete(id);
        res.status(200).json({ message: `Document with ${firstname} has been deleted..` });
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
}

// Get provider by id
exports.getProvider = async (req, res) => {
    try {
        const id = req.params.id;
        const foundProvider = await provider.findById(id);
        if (foundProvider) {
            return res.status(200).json(foundProvider);
        } else {
            return res.status(404).json({ message: `Provider not found: ${id}` });
        }
    }
    catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

