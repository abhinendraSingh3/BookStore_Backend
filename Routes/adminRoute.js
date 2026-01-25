const express=require('express');
const adminRoute=express.Router;
const user=require('./../Models/users');
const jwtAuthMiddleWare=require('./../jwtAuthMiddleWare');
const adminAuth = require('../adminAuth');

adminRoute.post('/login',async(req,res)=>{

//checks in db
//checks role
//generate jwt tokens




})