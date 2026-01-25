const express=require('express');
const adminRoute=express.Router;
const user=require('./../Models/users');
const jwtAuthMiddleWare=require('./../jwtAuthMiddleWare')

adminRoute.post('/login',jwtAuthMiddleWare,async(req,res)=>{



})