const middleware=require('../middleware/auth')

module.exports=(app)=>{
    const blog=require('../controllers/controllers');

    app.get('/api/blogs',middleware,blog.getall);

    app.get('/api/blog/findbyauthor/:blogAuthor',middleware,blog.getonebyauthor);
    app.get('/api/blog/findbytitle/:blogTitle',middleware,blog.getonebytitle);
    app.get('/api/blog/findbydesc/:blogDesc',middleware,blog.getonebydesc);
    
    app.get('/api/blog/:blogID',middleware,blog.getone);
   
    app.post('/api/create',middleware,blog.create);
    app.put('/api/update/:blogID',middleware,blog.updateone);
    app.delete('/api/delete/:blogID',middleware,blog.deleteone);
}
