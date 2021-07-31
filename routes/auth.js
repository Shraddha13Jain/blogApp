require('dotenv').config();

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User= mongoose.model("User");
const bcrypt = require('bcryptjs');
const jwt= require('jsonwebtoken');
const requireLogin=require('../middleware/requireLogin')
const nodemailer=require('nodemailer');
const sendgridTransport=require('nodemailer-sendgrid-transport');
const crypto = require('crypto');

const transporter = nodemailer.createTransport(sendgridTransport({
    auth:{
        api_key:process.env.API_KEY
    }
}))

router.post('/signup',(req,res)=>{
    const{name,email,password}=req.body;
    if(!email || !password || !name){
       return res.status(422).json({error:"please add all the fields"})
    }
    User.findOne({email:email})
      .then((savedUser)=>{
          if(savedUser){
            return res.status(422).json({error:"user already exist with that email"})
          }

          bcrypt.hash(password,12).then(hashedpassword=>{
            const user=new User({
                email,
                password:hashedpassword,
                name,
            })
            user.save().then(user=>{
                transporter.sendMail({
                    to:user.email,
                    from:"shraddhaj829@gmail.com",
                    subject:"signup success",
                    html:"<h1>WELCOME TO INSTAGRAM </h1>"
                })
                res.json({messgae:"succusfully asded"})
            })
            .catch(err=>{
                console.log(err);
            })
          })
          .catch(err=>{
              console.log(err);
          })
          
      })
})

router.post('/signin',(req,res)=>{
    const {email,password} =req.body

    if(!email || !password){
       return res.status(422).json({error : "please add email or password"})
    }
    User.findOne({email:email})
      .then(savedUser=>{
          if(!savedUser){
              return res.status(422).json({error:"invalid email or pasword"})
          }
          bcrypt.compare(password,savedUser.password)
          .then(doMatch=>{
              if(doMatch){
                  //res.json({message : "successfully signed in "});
                  const token = jwt.sign({_id:savedUser._id},process.env.jwtsecret);
                  const {_id,name,email}=savedUser;
                  res.json({token,user:{_id,name,email}});
                }
              else {
                return res.status(422).json({error:"invalid email or pasword"})
              }
          })
          .catch(err=>{
              console.log(err);
          })
      })
   .catch(err=>{
       console.log(err);
   })

})

router.post('/reset-password',(req,res)=>{
     crypto.randomBytes(32,(err,buffer)=>{
         if(err){
             console.log(err);
         }
         const token = buffer.toString("hex")
         User.findOne({email:req.body.email})
         .then(user=>{
             if(!user){
                 return res.status(422).json({error:"user don't exists with that email"})
             }
             user.resetToken=token;
             user.expireToken=Date.now() + 3600000
             user.save().then((result)=>{
                 transporter.sendMail({
                     to:user.email,
                     from:"shraddhaj829@gmail.com",
                     subject:"password reset",
                     html:`
                       <p>You are requested for password reset</p>
                       <h5> click on this<a href="http://localhost:3000/reset/${token}"> link</a> to reset password</h5>
                       `
                 })
                 res.json({message:"check your email"})
             })
         })
     })
})

router.post('/new-password',(req,res)=>{
    const newPassword=req.body.password;
    const senttoken=req.body.token
    User.findOne({resetToken:senttoken,expireToken:{$gt:Date.now()}})
    .then(user=>{
        if(!user){
            return res.status(422).json({error:"try again session expired"})
        }
        bcrypt.hash(newPassword,12).then(hashedpassword=>{
               user.password=hashedpassword
               user.resetToken=undefined
               user.expireToken=undefined,
               user.save().then((saveduser)=>{
                   res.json({message:"password updated success"})
               })
        })
    }).catch(err=>{
        console.log(err);
    })
})

module.exports= router;