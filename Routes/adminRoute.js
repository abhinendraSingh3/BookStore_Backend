const express = require('express');
const adminRoute = express.Router();
const jwtAuthMiddleWare = require('./../jwtAuthMiddleWare');
const users = require('./../Models/users');
const bcrypt = require('bcrypt');
const adminAuth = require('./../adminAuth')
const jwt = require('jsonwebtoken');
const books = require('../Models/books');
require('dotenv').config()



//----------------login--------------------//

adminRoute.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        //checks in db
        const checkUser = await users.findOne({ email: email }).select('+password')
        
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

adminRoute.get('/profile', jwtAuthMiddleWare, adminAuth('admin'), async (req, res) => {
    try {

        const bData = req.data.userId;
        const veriUser = await users.findById(bData);
        
        
        if (!veriUser) {
            return res.status(501).json({ message: "user not found" })
        }
        return res.status(203).json({
           profile: veriUser,
            message: "view Profile successfull"
        })
    }
    catch (err) {
        console.log(err);
        return res.status(501).json({
            error: err,
            message: "Internal server error"
        })
    }


})

//-----------------logout-----------------//

adminRoute.post('/logout', (req, res) => {

    return res.status(200).json({
        message: "logged out Successfully"
    })

})


//-------Manage Books-----------//

//---view all books//
adminRoute.get('/books', jwtAuthMiddleWare, adminAuth, async (req, res) => {
    try {

        const bookData = await books.find();

        if (bookData.lenght === 0) {
            return res.status(404).json({ message: "No book found" });
        }

        return res.status(200).json({
            bookData,
            messsage: "Data fetched successfully"
        }
        )

    }
    catch (err) {
        return res.status(501).json({ message: "internal server error" })
    }

})

//-----------add book -----------
adminRoute.post('/book', jwtAuthMiddleWare, adminAuth, async (req, res) => {
    try {
        // Admin sends book details → backend validates → saves to DB → returns success.
        const { title, author, category, description, price, stock_quantity } = req.body;

        if (!title || !author || !category || !description || !price || !stock_quantity) {
            return res.status(404).json({ message: "Please fill all the fields" })
        }

        const verifyBook = await books.findOne({ Title: title, Author: author });
        if (verifyBook) {
            return res.status(409).json({ message: "book record already existed" })
        }

        const newData_res = await books.create({
            title,
            author,
            category,
            description,
            price,
            stock_quantity: stock_quantity ?? 0,
        })

        return res.status(201).json({

            book: newData_res,
            message: "Data saved succesfully"
        })




    }
    catch (err) {
        return res.status(501).json({ message: "internal server error at adminRoute.post" })
    }
})

//-------view single book detail----------//
adminRoute.get('/book/search/:bookname', jwtAuthMiddleWare, adminAuth, async (req, res) => {

    try {
        bookName = req.params.bookName;

        const findBook = await books.findOne({ Title: bookName });

        if (!findBook) {
            return res.status(404).json({ message: "Book not found" })
        }

        return res.status(200).json({
            book: findBook,
            message: "Book Details Fetched successfully"

        })
    }
    catch (err) {
        return res.status(501).json({ message: "internal server error" })
    }
})

//-------update book detail----------//
adminRoute.put('/book/update/:bookname', jwtAuthMiddleWare, adminAuth, async (req, res) => {
    try {

        const bookName = req.params.bookname;


        const bookUpdate = await books.findOneAndUpdate({ Title: bookName }, { $set: req.body }, { //$ set operator will update only the fields whose value have been given
            runValidators: true,
            new: true
        })

        if (!bookUpdate) {
            return res.status(404).json({ message: "Book not found" })
        }

        return res.status(201).json({
            bookUpdate: bookUpdate,
            message: "Data updated successfully"
        })

    }
    catch(err){
        return res.status(501).json({message:"Internal server error"})
    }

})

adminRoute.delete('/book/:bookname',jwtAuthMiddleWare,adminAuth,async(req,res)=>{
    try{

        const bookName=req.params.bookname;

        const bookFind=await books.findOneAndDelete({Title:bookName});

        if(!bookFind){
            return res.status(404).json({message:"Book not Found"})
        }

        return res.status(200).json({message:"book data deleted successfully"})

    }
    catch(err){
        return res.status(500).json({message:"Internal server error"})
    }
})

module.exports=adminRoute;

