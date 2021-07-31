const jwt=require("jsonwebtoken")

function middleware(req,res,next){
    const token=req.header('x-auth-token')
    if(!token){
        return res.status(401).json({msg:"no token authorization failed"})
    }
    try{
        const decoded=jwt.verify(token,process.env.jwtsecret)
        req.user=decoded
        next();
    }
    catch(e)
    {
        res.status(400).json({msg:"token is not valid"})
    }

}

module.exports=middleware;