const express = require('express');
const axios = require('axios');
const app =express();
const path = require('path');
var bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const cors = require('cors');

// const base_url="http://localhost:3000";
// const base_url="http://node56943-titiwat28-noderest.proen.app.ruk-com.cloud";
const base_url="https://back-end-node-jspxx-1.onrender.com";

app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static(path.join(__dirname, "/public")));
app.use(cors());

app.use(cookieParser());
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true
}));

app.get("/",(req,res)=>{

    res.render('nonelogin');
});
app.get("/index", (req, res, ) => {
     const username = req.session.username;
     const userid = req.session.userid
     res.render('index',{ username: username ,userid:userid});
     
});
app.get("/login",(req,res)=>{
    res.render('login');
});

app.post("/login", async (req, res) => {
    try {
        const data = {
            username: req.body.username,
            password: req.body.password
        };

        const response = await axios.post(base_url + '/login', data);
        const { username, userid, email } = response.data; 
        
      
        req.session.email = email;
        req.session.userid = userid;
        req.session.username = username;
        console.log("session:", username, userid, email);

        res.redirect('/index');
    } catch (err) {
        console.error(err);
        res.render('login', { error: "Invalid username or password" });

    }
});

app.post("/logout", async(req, res) => {
    try {
        await axios.post(base_url + '/logout');
        console.log('Logout successful');
        res.redirect('/');
    } catch (error) {
        console.error('Error:', error);
        console.log('Failed to logout');
    }
});
app.get("/register",(req,res)=>{
    res.render("register")
});
app.post("/register",async (req,res)=>{
    try{
        const data = {username:req.body.username,email:req.body.email,password:req.body.password};
        await axios.post(base_url+'/register',data);
        res.redirect('/login');
    }catch(err){
        console.error(err);
        res.render('register', { error: "Username is already in use. Or you did not fill in complete information." });
    }
});
app.get("/book", async (req, res) => {
    try {

        if (req.session.username) {
            const booksResponse = await axios.get(base_url + '/book');
            const typesResponse = await axios.get(base_url + '/type');

            const books = booksResponse.data;
            const types = typesResponse.data;
            const username = req.session.username;
            const userid = req.session.userid;

            res.render("book", { books: books, types: types, username: username ,userid: userid});
        } else {

            res.redirect("/login");
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Error');
    }
});


app.get("/comment/:bookid",async(req,res)=>{
    try{
        const booksresponse= await axios.get(base_url+'/comment/'+req.params.bookid);
        const typesresponse = await axios.get(base_url+'/type');
        const commentresponse =await axios.get(base_url+'/review/'+req.params.bookid)
        const username = req.session.username;
        const books= booksresponse.data
        const types = typesresponse.data
        const comments = commentresponse.data
        //console.log(books);
        //console.log(types);
        console.log('///////////////',comments);
        res.render("comment",{books: books,types: types,username:username,comments:comments});
    }catch(err){
        console.error(err);
        res.status(500).send('Error');
    }
});
app.post("/comment/:bookid", async (req, res) => {
    try {
        const data = {
            comment: req.body.comment,
            bookid: req.params.bookid,
            username: req.session.username
        };
        console.log(data);

        await axios.post(base_url + '/comment/' + req.params.bookid, data);
        res.redirect('/comment/' + req.params.bookid); 
    } catch (err) {
        console.error(err);
        res.status(500).send('Error');
    }
});

app.get("/profile/:userid",async (req,res)=>{
    const username = req.session.username;
    const userid = req.session.userid
    const userdataresponse =await axios.get(base_url+'/profile/'+req.params.userid);
    const userdata = userdataresponse.data
    res.render('profile',{ username: username ,userid:userid, userdata:userdata});
    
    
})
app.get("/update/:userid",(req,res)=>{
    const username = req.session.username;
    const userid = req.session.userid
    res.render('update',{ username: username ,userid:userid});
})
app.post("/update/:userid", async(req,res)=>{
    try{
        
        const data = {username: req.body.updatename};
        await axios.put(base_url+'/update/'+req.params.userid,data);
        res.redirect("/");
    } catch(err){
        console.log(err);
        res.status(500).send('Error');
    }
});

app.get("/delete/:userid",async(req,res)=>{
    try{
     
        await axios.delete(base_url+'/profile/'+req.params.userid);
        res.redirect("/");
    }catch(err){
        console.log(err);
        res.status(500).send('Error');
    }
});

app.get("/contact",(req,res)=>{
    const username = req.session.username;
    const userid = req.session.userid;
        res.render("contact",{userid:userid,username:username});
});

app.get("/news",async(req,res)=>{
    try {
        
        if (req.session.username) {
            const booksResponse = await axios.get(base_url + '/book');
            const typesResponse = await axios.get(base_url + '/type');

            const books = booksResponse.data;
            const types = typesResponse.data;
            const username = req.session.username;
            const userid = req.session.userid;
            console.log("/////////////",books);
            res.render("news", { books: books, types: types, username: username ,userid: userid});
        } else {

            res.redirect("/login");
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Error');
    }

});

app.get("/Webadmin",async(req,res)=>{
    try{
        
        const booksResponse = await axios.get(base_url + '/book');
        const typesResponse = await axios.get(base_url + '/type');
        const books = booksResponse.data;
        const types = typesResponse.data
        console.log(types);
        res.render("Webadmin",{ books: books, types:types});
    }catch(err){
        console.log(err);
        res.status(500).send('Error');
    }
});

app.post('/Webadmin',async(req,res)=>{
    try{
        const data = req.body;
        await axios.post(base_url + '/Webadmin', data);
        res.redirect('/Webadmin');
    }catch(err){
        console.log(err);
        res.status(500).send('Error');
    }
});

app.get('/deletebook/:bookid', async (req, res) => {
    try {
        const bookId = req.params.bookid;
        await axios.delete(base_url+'/deletebook/'+bookId);
        console.log('////////////////////', bookId);
        res.redirect('/Webadmin');
    } catch (err) {
        console.log(err);
        res.status(500).send('Error');
    }
});

app.listen(5000,()=>{
        console.log(`Sever start on port 5000`);
});
