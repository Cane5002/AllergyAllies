const patient = require('../Models/patient')
const provider = require('../Models/provider')
const jwt = require('jsonwebtoken')
// const asyncHandler = require('express-async-handler')

exports.providerLogin = async(req, res) => {
    const email = req.body.email.toString();
    const password = req.body.password.toString();

    // input verification
    if (!email || !password) {
        console.log("Email or password not correct")
        return res.status(400).json({ message: 'All fields required' });
    }

    // find user in database - update for providers
    const foundProvider = await provider.findOne({ email }).exec();

    if (!foundProvider) { 
        console.log("Provider not found.")
        return res.status(401).json({ message: 'Invalid email or password' });
    }
    console.log("Provider account found")
    let role = 1;

    const match = password == foundProvider.password ? true : false;

    if (!match) {
        console.log("Password doesn't match")
        return res.status(401).json({ message: 'Invalid email or password' });
    }
    let accessToken = jwt.sign(
        {
            "UserInfo": {
                "id": foundProvider.id,
                "role": role,
                "firstName": foundProvider.firstName,
                "lastName": foundProvider.lastName,
                "practiceID": foundProvider.practiceID
            }
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '5m'}
    )

    const refreshToken = jwt.sign(
        { "id": foundProvider.id },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '30m'}
    )

    res.cookie('jwt', refreshToken, {
        httpOnly: false,
        secure: true,
        sameSite: 'None',
        maxAge: 7*24*60*60*1000
    })

    res.json({ accessToken })
}

exports.patientLogin = async(req, res) => {
    const email = req.body.email.toString();
    const password = req.body.password.toString();

    // input verification
    if (!email || !password) {
        console.log("Email or password not correct")
        return res.status(400).json({ message: 'All fields required' });
    }

    // find user in database - update for providers
    const foundPatient = await patient.findOne({ email }).exec();

    if (!foundPatient) { 
        console.log("Patient not found.")
        return res.status(401).json({ message: 'Invalid email or password' });
    }
    console.log("Patient found.")
    role = 2;

    const match = password == foundPatient.password ? true : false;

    if (!match) {
        console.log("Password doesn't match")
        return res.status(401).json({ message: 'Invalid email or password' });
    }
    let accessToken = jwt.sign(
        {
            "UserInfo": {
                "id": foundPatient.id,
                "role": role,
                "firstName": foundPatient.firstName,
                "lastName": foundPatient.lastName,
                "practiceID": foundPatient.practiceID,
                "status": foundPatient.status,
                "email": foundPatient.email
            }
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '5m'}
    )
    

    const refreshToken = jwt.sign(
        { "id": foundPatient.id },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '30m'}
    )

    res.cookie('jwt', refreshToken, {
        httpOnly: false,
        secure: true,
        sameSite: 'None',
        maxAge: 7*24*60*60*1000
    })

    res.json({ accessToken })
}

exports.refresh = async(req, res) => {
    console.log("Refresh auth func triggered");
    const cookies = req.cookies;

    if (!cookies?.jwt) return res.status(401).json({ message: 'Unauthorized_3' });

    const refreshToken = cookies.jwt;

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        async (err, decoded) => {
            if (err) return res.status(403).json({ message: 'Forbidden' })

            let foundUser = await patient.findOne({ id: decoded.id})

            if (!foundUser) {
                foundUser = await provider.findOne({ id: decoded.id });
                if (!foundUser) {
                    return res.status(401).json({ message: 'User not found (Refresh Token)' });
                }
            }

            let accessToken = null
            if (role == 1) {
                accessToken = jwt.sign(
                    {
                        "UserInfo": {
                            "id": foundUser.id,
                            "role": role,
                            "firstName": foundUser.firstName,
                            "lastName": foundUser.lastName,
                            "practiceID": foundUser.practiceID
                        }
                    },
                    process.env.ACCESS_TOKEN_SECRET,
                    { expiresIn: '5m'}
                )
            }
            else {
                accessToken = jwt.sign(
                    {
                        "UserInfo": {
                            "id": foundUser.id,
                            "role": role,
                            "firstName": foundUser.firstName,
                            "lastName": foundUser.lastName,
                            "practiceID": foundUser.practiceID,
                            "status": foundUser.status,
                            "email": foundUser.email
                        }
                    },
                    process.env.ACCESS_TOKEN_SECRET,
                    { expiresIn: '5m'}
                )
            }

            res.json({ accessToken })            
        }
    )
}

exports.logout = async(req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204);
    res.clearCookie('jwt', {httpOnly: false, sameSite: 'None', secure: true });
    res.json({ message: 'Cookie Cleared' });
}
