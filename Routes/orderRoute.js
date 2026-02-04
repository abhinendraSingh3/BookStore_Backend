const express = require('express');
const orderRoute = express.Router();
const jwtAuthMiddleWare = require('./../jwtAuthMiddleWare')
const cart = require('./../Models/cart');
const order = require('./../Models/order')

orderRoute.get('/order', jwtAuthMiddleWare, async (req, res) => {
    try {
        const userId = req.data.userId;
        const userCart = await cart.findOne({ user: userId });
        const {order_status,payment_method,address} =req.body;

        let totalamt=0;

        userCart.items.forEach(i=>(
            totalamt+=i.quantity*i.price
        ))

        //create user order from cart
        const newOrder = await order.create({
            user: userId,
            items:userCart.items(i=>({
                book:i.book,
                quantity:i.quantity,

            })),
            order_total:totalamt,
            order_status:order_status,
            address:address,
            payment_method:payment_method
        })

        if(!newOrder){
            return res.status(401).json({message:"order not palced"})
        }

        await newOrder.save();
        return res.status(200).json({order,message:"Order successfull"})

        //that saves order total
        //status
        //payment details
       
    }
    catch (err) {
        res.status(501).json({ message: "Internal server error" })

    }
})


