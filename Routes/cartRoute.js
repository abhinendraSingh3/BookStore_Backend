const express=require('express');
const jwtAuthMiddleWare = require('../jwtAuthMiddleWare');
const cartRoute=express.Router();
const cart=require('./../Models/cart')
const loggger=require('winston');

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
        // if its already in cart then increase quantity

        //if not then add item to cart

    }
    catch(err){
        return res.status(500).json({
            error:err.message,
            message:"internal Server error"

        })


    }
})



module.exports=cartRoute;