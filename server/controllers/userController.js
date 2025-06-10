const Users = require('../models/userModel');

const bcrypt = require('bcrypt')

const userController = {
    register: async(req,res) => {
        try {
            const {name,email,password} = req.body;

            const user = await Users.findOne({email});
            
            if(user)
                return res.status(400).json({msg:"Email Already Registered"})
            
            if(password.length < 6)
                return res.status(400).json({msg:"Password is Aleast of 6 Characters"})


            //Passwoerd Encryption
            const passwordHash = await bcrypt.hash(password,10);

            const newUser = new Users({
                name,email,password:passwordHash
            })

            //Save on MongoDB
            await newUser.save();  

            res.json({msg:"Successfully Registered!"})
            
        } 
        catch(err){
            return res.status(500).json({msg:err.message})
        }
        
    }
}

module.exports = userController