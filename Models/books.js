const mongoose = require('mongoose')

const bookSchema =new mongoose.Schema({

    title: {
        type: String,
        required: true,
        unique: true,
    },
    author: {
        type: String,
        required: true,

    },
    category: {
        type: String,
        required: true,

    },
    description: {
        type: String,
        required: true,

    },
    price: {
        type: Number,
        required: true,


    },
    stock_quantity: {
        type: Number,
        required: true,


    },
    // createdDate:{
    //     type:Date,
    //     default:Date.now //if this field is empty then it will auto add date
    // }

},{timestamps:true} //This adds createdAt & updatedAt automatically

)
module.exports=mongoose.model('books',bookSchema)