const express =require('express')
const app=express();
const bodyParser = require('body-parser')
const userRoute=require('./Routes/userRoute')
const bookRoute=require('./Routes/bookRoute')

app.use(bodyParser.json()) //used for reading data from the body;


app.get('/',(req,res)=>{
    res.status(300).json({message:"hello i am working"})
});

//--user_Route--
app.get('/user',userRoute)

//--book_Route--
app.get('/book',bookRoute);


const PORT=process.env.PORT || 3000;
app.listen(PORT,()=>{
console.log(`the server is listening on Port http://localhost:${PORT}`)
})

