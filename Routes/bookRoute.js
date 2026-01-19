const express=require('express')
const bookRoute=express.Router();
const jwtAuthMiddleWare = require('../jwtAuthMiddleWare');
const bookSch=require('./../Models/books')
const userSch=require('./../Routes/userRoute')

//-------list all the books available---
bookRoute.get('/allbooks',async (req,res)=>{
    try{
        
        const bookDetails=await bookSch.find();

        return res.status(201).json(bookDetails);

    }
    catch(err){
        return res.status(501).json({message:"Internal server error"})
    }

})

//--------------Book_Detail-------------------
bookRoute.get('/books/:bookname',async (req,res)=>{
    try{
        const bookName=req.params.bookname;

        const bookDetails=await bookSch.findOne({Title:bookName});
        if(!bookDetails){
            return res.status(401).json({message:"Book not found"})
        }

        return res.status(201).json(bookDetails);

    }
    catch(err){
        return res.status(501).json({message:"Internal server error"})
    }

})

module.exports=bookRoute;