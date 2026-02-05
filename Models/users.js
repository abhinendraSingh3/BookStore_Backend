const mongoose=require('mongoose');

const userSch=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        minlength:3
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        select:false // passowrd is never returne whenever someone extracts Data
    },
    role:{
        type:String,
        enum:["admin","user"],
        required:true,
        default:"user"
    },
    // createdDate{
    //     type:Date,
    //     default:Date.now //if this field is empty then it will auto add date 

    // } this method is manually adding so we avoid it

},
{timestamps:true}// This adds createdAt & updatedAt automatically


)

module.exports=mongoose.model('user',userSch)