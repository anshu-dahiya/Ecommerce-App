const JWT = require('jsonwebtoken');


const auth = (req,res,next) => {
    try {
        const token = req.header('Authorization');
        if(!token)
            return res.status(400).json({msg: "Invalid Authentication"});

        JWT.verify(token, process.env.ACCESS_TOKEN_SECRET, (err,user) => {
            if(err)
                return res.status(400).json({msg: "Invalid Authenticationss"});

            req.user = user;
            next();
        })
    }
    catch (err) {
        return res.status(500).json({msg: err.message})
    }
}

module.exports =  auth;