const mongoose = require('mongoose')

// order total amount,
// status,
// payment method,
// paymentStatus,
// shipping address- full name, pgone,addressLine, city, state, pincode,
// ordertime
// timestamps-createdAt, updatedAt
 


const orderSchema=new mongoose.Schema({

user: {
    type: mongoose.Schema.Types.ObjectId,
    ref:"user",
    required:true
},

items:[{
    book:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"books",
        required:true
    },
    quantity:{
        type:Number,
        required:true,
    },
    price:{
       type:Number,
       required:true 
    },

}],

order_total:{
    type:Number,
    required:true
},

order_status:{
    type:String,
    enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
    default: "pending",
},

address:{
    type:String,
    required:true
},

payment_method:{
    type:String,
    enum:['COD','UPI','Internet Banking'],
    required:true
},

orderTime:{
    type:Date,
    default:Date.now

}
},
{timestamps:true}

)

module.exports=mongoose.model('orders',orderSchema)
