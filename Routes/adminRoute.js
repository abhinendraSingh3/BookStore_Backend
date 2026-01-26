const express = require('express');
const adminRoute = express.Router;
const jwtAuthMiddleWare = require('./../jwtAuthMiddleWare');
const adminAuth = require('../adminAuth');
const users = require('./../Models/users');
const bcrypt = require('bcrypt');
const adminAuth = require('./../adminAuth')
const jwt = require('jsonwebtoken')
require('dotenv').config()



//----------------login--------------------//

adminRoute.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        //checks in db
        const checkUser = users.findOne({ email: email })
        if (!checkUser) {
            return res.status(401).json({ message: "User not valid" })
        }

        //password is correct or not 
        const checkPass = bcrypt.compare(password, checkUser.password)
        if (!checkPass) {
            res.status(401).json({ message: "Invalid User Password" })
        }

        //checks role
        if (checkUser.role !== 'admin') {
            return res.status(403).json({ message: "only admins are allowed to login" })
        }

        //--generate jwt tokens--
        //generate payload
        const payload = {
            id: checkUser._id,
            email: checkUser.email,
            role: checkUser.role
        }
        //generate token=jwtsignin
        const token = jwt.sign(payload, process.env.SECRET, {
            expiresIn: '1h'
        })

        return res.status(201).json({
            token,
            message: 'login successfull'
        })
        console.log("token send successfully")

    }
    catch (err) {
        console.log(err)
        res.status(501).json({ message: "Internal Server Error" })
    }
})


//--------------------profile--------------------//

adminRoute.get('/profile', jwtAuthMiddleWare, adminAuth, async (req, res) => {
    try {

        const bData = req.data.userId;
        const veriUser = await users.findById( bData );
        if (!veriUser) {
            return res.status(501).json({ message: "user not found" })
        }
        return res.status(203).json({
            veriUser,
            message:"view Profile successfull"

        })
    }
    catch (err) {
        console.log(err);
        return res.status(501).json({
            error:err,
            message:"Internal server error"
        })
    }


})

//-----------------logout-----------------//

adminRoute.post('/logout',(req,res)=>{

    return res.status(200).json({
        message:"logged out Successfully"
    })

})