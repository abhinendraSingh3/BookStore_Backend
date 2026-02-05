const express =require('express')
const app=express();
const bodyParser = require('body-parser')
const userRoute=require('./Routes/userRoute')
const bookRoute=require('./Routes/bookRoute')
const adminRoute=require('./Routes/adminRoute')
const cartRoute=require('./Routes/cartRoute')
const db=require('./db');


app.use(bodyParser.json()) //used for reading data from the body;


app.get('/',(req,res)=>{
    res.status(300).json({message:"helli am working"})
});

//--user_Route--
app.use('/user',userRoute)

//--book_Route--
app.use('/book',bookRoute);

//--admin_Route
app.use('/admin',adminRoute);

//--cart_Route
app.use('/cart',cartRoute);

db();

const PORT=process.env.PORT || 3000;
app.listen(PORT,()=>{
console.log(`the server is listening on Port http://localhost:${PORT}`)
})



