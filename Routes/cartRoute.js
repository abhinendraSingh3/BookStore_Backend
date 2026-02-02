const express = require('express');
const jwtAuthMiddleWare = require('../jwtAuthMiddleWare');
const cartRoute = express.Router();
const cart = require('./../Models/cart')
const loggger = require('winston');
const books = require('./../Models/books')
const orders=require('./../Models/order');


//-------viewCart-------//
cartRoute.get('/cart', jwtAuthMiddleWare, async (req, res) => {

    try {

        //userrid extract
        const userId = req?.data?.userId;


        //user cart details nikal ni pdengi 
        const userCart = await cart.findOne({ user: userId }).populate(items.book);

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

        const book = await books.findOne({ Title: bookTitle })

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
            const bookIndex = cartData.items.findIndex(item =>//.findIndex will return index (position) where the data is there and 1 if found .if not then -1
                item.book.toString() === bookId.toString()
            )
            //book is present
            if (bookIndex !== -1) {
                cartData.items[bookIndex].quantity += 1;
            }
            //book not present
            else {
                cartData.items.push({ book: bookId, quantity: 1 })
            }
            await cartData.save();

        }
        //Populate to return book details if needed
        await cartData.populate('items.book', 'title price')

        return res.status(201).json({ message: 'Book added to cart', cart: cartData })

    }
    catch (err) {
        return res.status(500).json({
            error: err.message,
            message: "internal Server error"

        })


    }
})

//-----------update quantity of a book------------//
cartRoute.put('/:bookName', jwtAuthMiddleWare, async (req, res) => {

    //check if the book is in db
    //user cart is present or not if not then create cart
    //increase
    //decrease
    //set quantity
    //if quantity is 0 then remove it
    //if >0 then uopdate quantity



    try {
        const bookName = req.params.bookName;
        const userId = req.data.userId
        const { action, quantity } = req.body;

        //check if the book is in db
        const dbBook = await books.findOne({ Title: bookName });
        if (!dbBook) {
            return res.status(404).json({ message: "Book not found" });
        }
        const bookId = dbBook._id;

        const userCart = await cart.findOne({ user: userId });

        if (!userCart) {// if there is no cart of user then create one
            userCart = await cart.create({
                user: userId,
                items: []
            })
        }

        const item = userCart.find(i => i.book.toString() == bookId.toString())// here i is iterating in every element of items
        if (!item) {
            return res.status(404).json({ message: "Book not found" });
        }


        //increase
        if (action == "increase") {
            item.quantity += quantity;
        }
        //decrease
        if (action = "decrease") {
            item.quantity -= quantity;
            if (quantity <= 0) {
                cart.items = cart.items.find(i => i.book.toString() !== bookId.toString())// if the book is not matching in cart then remove it
            }
            else {
                item.quantity = quantity;
            }
        }
        //set quantity
        //if quantity <=0 then remove it from cart
        //else items.quantity =quantity
        if (action = "set") {
            if (quantity <= 0) {
                cart.items = cart.items.find(i => i.book.toString() !== bookId.toString())// if the book is not matching in cart then remove it
            }
            else {
                item.quantity = quantity;
            }
        }

        await userCart.save();
        res.json(userCart);




    }
    catch (err) {

    }
})

//--------------single book delete--------------//

cartRoute.delete('/remove/:bookName', jwtAuthMiddleWare, async (req, res) => {
    try{
    const bookName = req.params.bookName;
    const userId = req.data.userId; //coming from jwt

    //checking book exist in database
    const book = await books.findOne({ Title: bookName })
    if (!book) {
        return res.status(404).json({ message: "book not found in dataBase" });
    }
    const bookId = book._id;

    //finding user cart
    let userCart = await cart.findOne({ user: userId })
    if (!userCart) {
        userCart = await cart.create({
            user: userId,
            items: [],
            message: "user cart is empty"
        })
    }

    const desiredBook = userCart.items.find(i => i.book.toString() === bookId.toString())
    if (!desiredBook) {
        return res.status(404).json({ message: "Book not in cart", items: [] });
    }

    userCart.items=userCart.items.filter(
        i=>i.book.toString()!==bookId.toString()
    );

    await userCart.save();

    res.json({message:"Book Saved", cart:userCart});
}
catch(err){
    return res.status(500).json({message:"Internal Server Error"})

}
})


cartRoute.post('/cart/checkout',jwtAuthMiddleWare,async(req,res)=>{
 try{
    const userId=req.data.userId;
    const userCart=await cart.findOne({user:userId});

    //if cart does'nt exist or it exist but has zero items then
    if(!userCart|| userCart.items.length===0){
        return res.status(404).json({message:"User cart is empty"})
    }

    let totalAmount=0;

    //for loop to access each price and quantity
    for(let item of userCart.items){
        totalAmount+=item.price*item.quantity;
    }

    //create order cart once user clicks checkout 
    const order=await orders.create({
        user:userId,
        items:userCart.items,
        order_total:totalAmount
    })

    //after transferring orders then the cart is set to be emptied
    userCart.items=[];
    await userCart.save() //here save the changes.

    return res.status(200).json({order,message:"Checkout Successful"})
}
catch(err){
    return res.status(500).json({message:"Internal server error"})
}


})



module.exports = cartRoute;