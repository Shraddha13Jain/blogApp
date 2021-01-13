require('dotenv').config();

const express=require('express');
const mongoose=require('mongoose');
const bodyparser=require('body-parser');
mongoose.set('useFindAndModify', false);
const app=express();

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:true}));

mongoose.Promise=global.Promise;

mongoose.connect(process.env.MONGO_URL,{
           useNewUrlParser:true,
           useUnifiedTopology: true 
        }).then(()=>{
           console.log("DB is connected");
        })
        .catch((err)=>{
            console.log(err);
            process.exit();
        }) 
app.get('/',(req,res)=>{
    res.send("welcome to blog app");
});


app.use('*',(req,res,next)=>{
 res.status(404).json({"msg":"NOT FOUND"});
});

require('./routes/route')(app);

const port=process.env.PORT || 3000;
app.listen(port,(err)=>{
    if(err) console.log(err);
    else console.log(`post is live at ${port}`);
});
