const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
    user: {// saves the user that the particular cart belongs to the specific user only 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
        unique:true
    },

    items: [
        {
        book: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'books',
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1

        },
        price:{
            type:Number,
            required:true
        }
    }
]


     
       


}, { timestamps: true }
);

//indexing 
//user:1 and item.book:1 is just for ascending
cartSchema.index({user:1,'items.book':1})

module.exports=mongoose.model('cart',cartSchema)