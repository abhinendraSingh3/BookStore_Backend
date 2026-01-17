const express =require('express')
const app=express();
const bodyParser = require('body-parser')

app.use(bodyParser.json()) //used for reading data from the body;


app.get('/',(req,res)=>{
    res.status(300).json({message:"hello i am working"})
});


const PORT=process.env.PORT || 3000;
app.listen(PORT,()=>{
console.log(`the server is listening on Port http://localhost:${PORT}`)
})

