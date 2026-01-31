const express=require('express');
const jwtAuthMiddleWare = require('../jwtAuthMiddleWare');
const cartRoute=express.Router();
const cart=require('./../Models/cart')
const loggger=require('winston');
const books=require('./../Models/books')

cartRoute.get('/cart',jwtAuthMiddleWare,async(req,res)=>{

    try{

    //userrid extract
    const userId=req?.data?.userId;


    //user cart details nikal ni pdengi 
    const userCart= await cart.findOne(userId).populate(items.book);

    if(!userCart){ //if there is no item in the cart then return null cart
        return res.status(200).json({
            items:[],
            message:"cart is empty",
            totalAmount:0
        })
    }

    //total amount
    const totalAmount=0;

    cart.items.forEach(item=>{
        totalAmount+=item.price*item.quantity;
    })

    return res.status(200).json({
        message:"books fetched successfully",
        totalAmount,
        items:userCart.items


    })
}
catch(err){
    return res.status(501).json({
        message:"Internal Server error",
        error:err.message
    })

}


})

//----add book to cart-------//

cartRoute.post('/cart',jwtAuthMiddleWare,async(req,res)=>{
    try{

        //check if the item is already in cart
            //first get the data from body
            const {bookTitle}=req.body;

            //check if the book exist in the records

            const book=books.findOne({Title:bookTitle})

            if(!book){
                return res.status(404).json({
                    message:"book not found",
                })
            }
            
            const bookId=book._id;

            //for this we need to extract which user's cart we want to see. that we will get from jwt
            const userId=req.data.userId;
            const cartData=cart.findOne({user:userId}).
            )

            //if cart not then create cart
            if(!cartData){
                cartData.create({
                    
                })



            }

        // if its already in cart then increase quantity

        

    }
    catch(err){
        return res.status(500).json({
            error:err.message,
            message:"internal Server error"

        })


    }
})



module.exports=cartRoute;