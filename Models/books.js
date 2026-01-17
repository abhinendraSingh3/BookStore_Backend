const mongoose = require('mongoose')

const bookSchema =new mongoose.Schema({

    Title: {
        type: String,
        required: true,
        unique: true,
    },
    Author: {
        type: String,
        required: true,

    },
    Category: {
        type: String,
        required: true,

    },
    Description: {
        type: String,
        required: true,

    },
    Price: {
        type: Number,
        required: true,


    },
    Stock_Quantity: {
        type: Number,
        required: true,


    },
    // createdDate:{
    //     type:Date,
    //     default:Date.now //if this field is empty then it will auto add date
    // }

},{timestamps:true} //This adds createdAt & updatedAt automatically

)