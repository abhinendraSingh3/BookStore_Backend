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

books:[{
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

status:{
    type:String,
    enum: ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"],
    default: "PENDING",
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
