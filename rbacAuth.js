const checkUser=(role)=>{

    return(req,res,next)=>{
        if(!req.data){
            return res.status(401).json({message:"invalid user"})
        }
        if(!role.includes(req.data.role)){
            return res.status(403).json({message:`access denied`})
        }
        next();
    }



}

module.exports=checkUser