const express = require('express');

const adminAuth = (role) => {
    return (req,res,next)=>{
        if(!req.data){
            return res.status(401).json({message:"unauthorized"});
        }

        if(req.data.role!==role){ // req.data is coming from jwt middle ware as req can travel independtly between middleware
            return res.status(403).json({message:"the user is not admin"});
        }
        next();

    }

    

module.exports = adminAuth;
