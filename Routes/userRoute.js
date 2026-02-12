const express = require('express');
const jwt=require('jsonwebtoken')
const userRoute = express.Router();
const user = require('./../Models/users');
const bcrypt = require('bcrypt');
require('dotenv').config();
const jwtAuthMiddleWare=require('./../jwtAuthMiddleWare');

//---------------SINGNUP NEW USER--------------------------//
userRoute.post('/signup', async (req, res) => {
    try {
        const { name, email, password,role} = req.body;
        console.log(req.body)

        //if any required field is missing them=n
        if (!name || !email || !password) {
            return res.status(501).json({ message: "Please Fill all the required fields" })
        }

        // check if the admin already exists in the system or not
        const checkAdmin = await user.find({ role: 'admin' }) //find return an array whereas findOne return null or an object
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
        return res.status(200).json({ message: "Data saved successfully" })

    }
    catch (error) {
        console.log("this is the error", error)
        return res.status(500).json({ message: "Internal Server Error" })
    }
})

//-------------------------USER LOGIN--------------------------------//

userRoute.post('/login', async (req, res) => {
    try {
        // required fields are there
        const { email, password } = req.body;// it is coming form auth middleware

        if (!email || !password) {
            return res.status(401).json({ message: "Fill required fields" })
        }

        //user Exist check
        const userCheck = await user.findOne({email:email}).select('+password') //req.data is coming from jwtAuthMiddleWare and jwt sends userId as userId not as _id and have used .select because we need passwordd for bcrypt and we have done select false in schema thats why
        //or
        //const userCheck= await user.findOne({_id:req.data.userId})
        if (!userCheck) {
            return res.status(401).json({ message: "user not found" })
        }
        //password check
        //compare hashpassword with the existing password

        const comparePass =await bcrypt.compare(password, userCheck.password);
        if (!comparePass) {
            return res.status(401).json({ message: "Password is incorrect" })
        }

        // generating jwt token
        //payload only expects object and userId is the id which db creates so that it can later be used to identify the user.
        const payload = {
            userId: userCheck._id,
            emailId: userCheck.email,
            role:userCheck.role

        }
        //creating token using .sign which accepts 2 parameters (payload and the secrete key)
        const token = jwt.sign(payload, process.env.SECRET, {
            expiresIn: '1h'
        });
      
        res.status(201).json({
            token,
            message: "login Successful"
        })
          console.log("token send successfully")

    }
    catch (error) {
        console.log("this is the error", error)
        return res.status(500).json({ message: "Internal Server Error" })
    }


})

//------------------profile view----------------//

userRoute.get('/profile',jwtAuthMiddleWare,async(req,res)=>{

    try{

        const bodyData=req.data.userId; 

        const checkUser=await user.findById(bodyData)//.select(-password) it excludes the data from returning.

        if(!checkUser){
            return res.status(404).json({message:"user not found"})
        }
        return res.status(200).json({checkUser})

    }
    catch(err){
        return res.status(500).json({message:"internal server erroor"})
    }

})

//-------------------profile update--------------

userRoute.put('/profile',jwtAuthMiddleWare,async(req,res)=>{
    try{
        //data extract
        const userId=req.data.userId;
        console.log("hello")       

        // check user and updating Data 
        const response=await user.findByIdAndUpdate(userId,req.body,{
            new:true,
            runValidators:true
        })

        if(!response){
            return res.status(500).json({message:"User not valid"})
        }

        console.log("Data saved successfully")
        return res.status(200).json(response);
    }
    catch(err){
        return res.status(500).json({message:"Internal Server Error"});
    }
})


module.exports=userRoute;


