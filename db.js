const mongoose=require('mongoose');
require('dotenv').config();


const dbUrl=process.env.mongoUrl;


const dbConnection=async()=>{
    try{
        
        await mongoose.connect(dbUrl);
        console.log('DB connection successfull')

    }
    catch(err){
        console.log('mongodb Connection error: ',err.message);
        process.exit(1);
    }

}

//events
mongoose.connection.on('disconnected',()=>{
    console.log("Connection disconnected")
})

mongoose.connection.on('error',(err)=>{console.error("MongoDb error event : ",err)})

module.exports=dbConnection