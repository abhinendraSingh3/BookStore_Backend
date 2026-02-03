const express=require('express');
const orderRoute=express.Router();
const jwtAuthMiddleWare=require('./../jwtAuthMiddleWare')
const cart=require('./../Models/cart');
const order=require('./../Models/order')

orderRoute.get('/order',jwtAuthMiddleWare,async(req,res)=>{
    try{
       
        const userId=req.data.userId;
        const userCart=await cart.findOne({user:userId});
        

    //create user order from cart
    const newOrder=await order.create({
        user:userId,
        items:userCart.items(item=>({
            book:item.book,
            quantity:item.quantity,
            price:item.price
        })
    })
            //that saves order total
            //status
            //payment details

    }
    catch(err){
        res.status(501).json({message:"Internal server error"})

    }
})


