const express = require('express');
const router = express.Router();
const user = require('./../Models/users');
const bcrypt = require('bcrypt');
require('dotenv').config();

//---------------SINGNUP NEW USER--------------------------//
router.post('/signup', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        //if any required field is missing them=n
        if (!name || !email || !password || !role) {
            return res.status(501).json({ message: "Please fill all the required fields" })
        }

        // check if the admin already exists in the system or not
        const checkAdmin = await user.find({ role: admin }) //find return an array whereas findOne return null or an object
        if (checkAdmin.length > 0) {
            return res.status(409).json({ message: "Admin already registered" })
        }

        //checking if the user is existing or not
        const checkUser = await user.findOne({ email: email });
        if (checkUser) {
            return res.status(400).json({ message: "user already existed" })
        }

        //generating hashed password
        const saltRounds = 5;
        const hashedPass = await bcrypt.hash(password, saltRounds);

        //saving the new data in db
        const newUser = await new user({
            ...req.body,
            password: hashedPass// overwriting the hasepass in db

        })

        newUser.save()
        console.log("data saved in db")
        return req.status(200).json({ message: "Data saved successfully" })

    }
    catch (error) {
        console.log("this is the error", err)
        return req.status(500).json({ message: "Internal Server Error" })
    }
})

//-------------------------USER LOGIN--------------------------------//

post('/login', async (req, res) => {
    try {








        //payload only expects object and userId is the id which db creates so that it can later be used to identify the user.
        const payload = {
            userId: user._id,
            emailId: user.email
        }
        //creating token using .sign which accepts 2 parameters (payload and the secrete key)
        const token = jwt.sign(payload, process.env.SECRET, {
            expiresIn: '1h'
        });

        res.status(201).send({
            token,
            message: "login Successful"
        })

    }
    catch (error) {
        console.log("this is the error", err)
        return req.status(500).json({ message: "Internal Server Error" })
    }


})

