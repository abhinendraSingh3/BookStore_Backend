const express = require('express');
const adminRoute = express.Router;
const jwtAuthMiddleWare = require('./../jwtAuthMiddleWare');
const adminAuth = require('../adminAuth');
const users = require('./../Models/users');
const bcrypt = require('bcrypt');
const adminAuth = require('./../adminAuth')

adminRoute.post('/login', async (req, res) => {
try{
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
    if(checkUser.role!=='admin'){
        return res.status(403).json({message:"only admins are allowed to login"})
    }

    //generate jwt tokens
        //generate payload
        //generate token=jwtsignin

    




}
catch(err){


}
})