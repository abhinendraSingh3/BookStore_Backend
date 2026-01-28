const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
    user: {// saves the user that the particular cart belongs to the specific user only 
        type: mongoose.Schema.types.objectId,
        ref: 'user',
        required: true
    },

    items: [{
        book: {
            type: mongoose.Schema.Types.objectId,
            ref: 'books',
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1

        }
    }]






}, { timestamp: true }
);

module.exports=mongoose.model('cart',cartSchema)