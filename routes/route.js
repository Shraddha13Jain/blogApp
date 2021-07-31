const middleware=require('../middleware/requireLogin')
require('dotenv').config();

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const blog=require('../model/usermodel')

module.exports=(app)=>{
    const blog=require('../controllers/controllers');

    app.get('/api/blogs',blog.getall);

    app.get('/api/blog/findbyauthor/:blogAuthor',blog.getonebyauthor);
    app.get('/api/blog/findbytitle/:blogTitle',blog.getonebytitle);
    app.get('/api/blog/findbydesc/:blogDesc',blog.getonebydesc);
    
    app.get('/api/blog/:blogID',blog.getone);
   
    app.post('/api/create',blog.create);
    app.put('/api/update/:blogID',blog.updateone);
    app.delete('/api/delete/:blogID',blog.deleteone);
}
