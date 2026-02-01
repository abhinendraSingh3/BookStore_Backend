const express = require('express');
const jwtAuthMiddleWare = require('../jwtAuthMiddleWare');
const cartRoute = express.Router();
const cart = require('./../Models/cart')
const loggger = require('winston');
const books = require('./../Models/books')


//-------viewCart-------//
cartRoute.get('/cart', jwtAuthMiddleWare, async (req, res) => {

    try {

        //userrid extract
        const userId = req?.data?.userId;


        //user cart details nikal ni pdengi 
        const userCart = await cart.findOne({user:userId}).populate(items.book);

        if (!userCart) { //if there is no item in the cart then return null cart
            return res.status(200).json({
                items: [],
                message: "cart is empty",
                totalAmount: 0
            })
        }

        //total amount
        const totalAmount = 0;

        cart.items.forEach(item => {
            totalAmount += item.price * item.quantity;
        })

        return res.status(200).json({
            message: "books fetched successfully",
            totalAmount,
            items: userCart.items


        })
    }
    catch (err) {
        return res.status(501).json({
            message: "Internal Server error",
            error: err.message
        })

    }


})

//----add book to cart-------//

cartRoute.post('/cart', jwtAuthMiddleWare, async (req, res) => {
    try {

        //check if the item is already in cart
        //first get the data from body
        const { bookTitle } = req.body;

        //check if the book exist in the records

        const book =await books.findOne({ Title: bookTitle })

        if (!book) {
            return res.status(404).json({
                message: "book not found",
            })
        }

        const bookId = book._id;

        //for this we need to extract which user's cart we want to see. that we will get from jwt
        const userId = req.data.userId;
        const cartData = await cart.findOne({ user: userId })
        
        //if cartdata not there then create cart

        if (!cartData) {
            cartData = await cart.create({
                user: userId,
                items: [{ book: bookId, quantity: 1 }]
            })
        }

        // if its already in cart then increase quantity
        else {
           const bookIndex= cartData.items.findIndex(item=>//.findIndex will return index (position) where the data is there and 1 if found .if not then -1
                item.book.toString()===bookId.toString()
            )
            //book is present
            if(bookIndex!==-1){
                cartData.items[bookIndex].quantity+=1;
            }
            //book not present
            else{
                cartData.items.push({book:bookId, quantity:1})
            }
            await cartData.save();

        }
         //Populate to return book details if needed
        await cartData.populate('items.book','title price')

        return res.status(201).json({message:'Book added to cart',cart:cartData})

    }
    catch (err) {
        return res.status(500).json({
            error: err.message,
            message: "internal Server error"

        })


    }
})

//-----------update quantity of a book------------//
cartRoute.put('/:bookName',jwtAuthMiddleWare,async(req,res)=>{

    try{
        const bookName= req.params.bookName;

        //check if the book is in the db
        const checkBook=await books.findOne({Title:title});
        if(!checkBook){
            return res.status(404).json({message:"Book Not Found"})
        }

        //check in user cart if book is there or not
        const userId=req.data.userId;

        bookId=checkBook._id;

        const cartData=await cart.findOne({user:userId})

        //if there is no cart then we will create cart
        if(!cartData){
            cartData=await cart.create({
                user:userId,
                items:[{book:bookId,quantity:1}]

        })
        }
        //if cart is present then increase quantity
        else{
            const cIndex=cartData.items.findIndex(item=>item.book.toString()===bookId.toString())

            //index found then increase quantity
            if(cIndex!==-1){
                cartData.items[cIndex].quantity+=1;
            }
            else{//data not found then push data

                cartData.items.push({book:bookId,quantity:1})

            }   
            await cartData.save;
        }

        //populate for user res
        const userR=await cartData.populate('items.book', 'price quantity')



    }
    catch(err){

    }
})



module.exports = cartRoute;