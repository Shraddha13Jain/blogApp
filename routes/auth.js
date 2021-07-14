const User=require('../model/usermodel')
const jwt=require('jsonwebtoken')
const middleware = require('../middleware/auth')

module.exports=(app)=>{
    app.post('/api/auth',(req,res)=>{
        const {email,password}=req.body
        if(!email||!password)
        {
            return res.status(400).json({msg:"Please enter both email and password"})
        }
        User.findOne({email})
            .then(user=>{
                if(!user){
                    return res.status(400).json({msg:"Please enter valid email"})
                }
                else{
                    if(user.password!==password){
                        return res.status(400).json({msg:"Please enter valid password"})
                    }
                    else
                    {
                        jwt.sign({id:user.id},process.env.jwtsecret,{expiresIn:3600},(err,token)=>{
                                if(err) 
                                   throw err;
                                res.json({token,user:{id:user.id,name:user.name,email:user.email} })
                            }
                        )
                    }
                }

            })

    })

    app.get('/api/auth/user',middleware,(req,res)=>{
        User.findById(req.user.id)
            .select('-password')
            .then(user=>res.json(user))
    })

}