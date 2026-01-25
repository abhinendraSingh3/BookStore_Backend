const express=require('express');
const adminRoute=express.Router;
const jwtAuthMiddleWare=require('./../jwtAuthMiddleWare');
const adminAuth = require('../adminAuth');
const users = require('./../Models/users');

adminRoute.post('/login',async(req,res)=>{

    const {email,password}=req.body;

//checks in db
const checkUser=users.findOne({email:email})
if(!checkUser){
    return res.status(401).json({message:"user not valid"})
}

//checks role
//generate jwt tokens




})