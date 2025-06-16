const Users = require('../models/userModel')
const bcrypt = require('bcrypt')
const JWT = require('jsonwebtoken')

const userController = {
    register: async (req, res) => {
        try {
            const { name, email, password } = req.body;

            const user = await Users.findOne({ email });

            if (user)
                return res.status(400).json({ msg: "Email Already Registered" })

            if (password.length < 6)
                return res.status(400).json({ msg: "Password is at least of 6 Characters" })


            //Passwoerd Encryption
            const passwordHash = await bcrypt.hash(password, 10);

            const newUser = new Users({
                name, email, password: passwordHash
            })

            //Save on MongoDB
            await newUser.save();

            //create JWT tokens
            const accessToken = createAccessToken({ id: newUser._id })
            const refreshToken = createRefreshToken({ id: newUser._id })

            // Store refresh token in a secure cookie
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                path: '/user/refresh_token'
            })

            res.json({
                msg: "Successfully Registered!",
                accessToken
            })

        }
        catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    
    refreshToken: async (req, res) => {
        try {
            // 1. Get the refresh token from browser cookies
            const rf_token = req.cookies.refreshToken;

            // 2. Check if refresh token exists
            if (!rf_token)
                return res.status(400).json({ msg: 'Please Login or Registers' }); 

            // 3. Verify if the refresh token is valid and not expired
            JWT.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
                if (err)
                    return res.status(400).json({ msg: 'Please Login or Register' });

                // 4. Create a new access token
                const accessToken = createAccessToken({ id: user.id });
                
                // 5. Send back the new access token
                res.json({user,accessToken});
            })
        }
        catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },

    login: async (req, res) => {
        try {
            const {email, password} = req.body;

            const user = await Users.findOne({email});
            if(!user)
                return res.status(400).json({msg: "User does not exist"});

            const isMatch = await bcrypt.compare(password,user.password);
            if(!isMatch)
                return res.status(400).json({msg: "Incorrect Password"});


            const accessToken = createAccessToken({ id: user._id })
            const refreshToken = createRefreshToken({ id: user._id })

            // Store refresh token in a secure cookie
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                path: '/user/refresh_token'
            })

            res.json({
                msg: "Login Success",
                accessToken
            });
        } 
        catch (err) {
            return res.status(500).json({msg: err.message});
        }
    },

    logout: async (req, res) => {
        try {
            res.clearCookie('refreshtoken',{path: "/user/refresh_token"});

            return res.json({msg: "Logout"})    
        } 
        catch (err) {
            return res.status(500).json({msg: err.message});
        }
    },

    getUser: async (req, res) => {
        try {
            const user = await Users.findById(req.user.id);
            if(!user)
                return res.status(400).json({msg: "User not found"});

            res.json(user);
        } 
        catch (err) {
            return res.status(500).json({msg: err.message});           
        }
    }

}

//JWT tokens define
const createAccessToken = (payload) => {
    return JWT.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' });
}

const createRefreshToken = (payload) => {
    return JWT.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
}



module.exports = userController