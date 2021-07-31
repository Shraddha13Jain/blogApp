const { findByIdAndDelete, findByIdAndUpdate } = require('../model/model');
const Blog=require('../model/model');

// get all blogs
exports.getall=async(req,res)=>{
    //Blog.find()
    //   .then((data)=>{
    //       res.status(200).json(data);
    //   })
    //   .catch((err)=>{
    //       if(err)  return res.status(500).json(err);
     //  });

     let data;
     try {
         data = await Blog.find().sort({updateAt:'desc'});

     } catch (err) {
         if(err) return res.status(500).json(err);
     }
     res.status(200).json(data);
}

//find by author
exports.getonebyauthor=async(req,res)=>{
   // Blog.findOne({author : req.params.blogAuthor})
   // .then((data)=>{
   //     if(!data) return res.status(404).json({"msg":"blog not found"});
   //     res.status(200).json(data);
   // })
   // .catch((err)=>{
   //     if(err) return res.status(500).json(err);
   // })
    let data;
    try{
        data= await Blog.findOne({author : req.params.blogAuthor});
        if(!data) return res.status(404).json({"msg":"blog not found"});
     }
     catch(err){
          if(err) return res.status(500).json(err);  
     }
     res.status(200).json(data);

}

////find by title
exports.getonebytitle=async(req,res)=>{
   Blog.findOne({title : req.params.blogTitle})
   .then((data)=>{
       if(!data) return res.status(404).json({"msg":"blog not found"});
       res.status(200).json(data);
   })
   .catch((err)=>{
       if(err) return res.status(500).json(err);
   })
}

//find by desc
exports.getonebydesc=async(req,res)=>{
   Blog.findOne({desc : req.params.blogDesc})
   .then((data)=>{
       if(!data) return res.status(404).json({"msg":"blog not found"});
       res.status(200).json(data);
   })
   .catch((err)=>{
       if(err) return res.status(500).json(err);
   })
}


//find a blog 
exports.getone=async(req,res)=>{
      Blog.findById(req.params.blogID)
          .then((data)=>{
              if(!data) return res.status(404).json({"msg":"blog not found"});
              res.status(200).json(data);
          })
          .catch((err)=>{
               if(err) return  res.status(500).json(err);
          })
}

//create new blog
exports.create=async(req,res)=>{

    const newBlog=new Blog({
    title:req.body.title,
    author:req.body.author,
       desc:req.body.desc
    })

    newBlog.save()
       .then((blog)=>{
           res.status(201).json({
                "msg":"blog created",
               "doc":blog
           });
       })
       .catch((err)=>{
           if(err)  return res.status(500).json(err);
       });
}

//update the blog
exports.updateone=async(req,res)=>{

    if(!req.body.title||!req.body.desc||!req.body.author)
       return res.status(500).json({"msg":"fill all the fields"});
    
    Blog.findByIdAndUpdate(req.params.blogID,{
       title: req.body.title,
       author:req.body.author,
       desc:req.body.desc
    },{new: true})
       .then((data)=>{
           if(!data) return res.status(404).json({"msg":"Not found"});
           res.status(202).json({
               "msg":"updated",
               "doc":data
           });
       })
       .catch((err)=>{
           if(err) res.status(500).json(err)
     })
    
};


//delete a blog
exports.deleteone=async(req,res)=>{

    Blog.findByIdAndDelete(req.params.blogID)
     .then((data)=>{
         if(!data) return res.status(404).json({"msg":"blog not fount"})
         res.status(200).json({
             "msg":"deleted",
             "doc":data
         })
     })
     .catch((err)=>{
         if(err) return res.status(500).json(err);
     })
}

