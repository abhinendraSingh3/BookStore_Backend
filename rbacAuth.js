const checkUser=(role)=>{

    return(req,res,next)=>{
        if(!req.data){
            return role.status(401).json({message:"invalid user"})
        }
        if(req.data.role!="role"){
            return res.status(501).json({message:`access denied`})
        }
        next();
    }




}

module.exports=checkUser