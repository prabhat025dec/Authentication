//jshint esversion:6
require('dotenv').config();
const express=require("express");
const bodyParser=require("body-parser");
const ejs=require("ejs");
const mongoose=require("mongoose");
// const encrypt=require("mongoose-encryption");

//console.log(process.env.API_KEY);
// const md5=require("md5");
// const bcrypt=require('bcrypt');
// const saltRounds=10;
const session = require('express-session');
const passport=require("passport");
const passportLocalMongoose=require("passport-local-mongoose");
const app=express();

app.use(express.static("public"));
app.set('view engine','ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(session({
  secret: "Our little secret.",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb+srv://prabhat-admin:MPrabhat%401234@cluster0.zi8uqcw.mongodb.net/todolistDB",{useNewUrlParser:true},{useUnifiedTopology: true});

const userSchema= new mongoose.Schema({
  email: String,
  password: String

});
userSchema.plugin(passportLocalMongoose);
// var secret=process.env.SECRET;
// userSchema.plugin(encrypt, { secret: secret,encryptedFields: ['password'] });//Add this plugin to the schema before you create your mongoose model
//                                               //because passing userschema as a parameter in creating model



const User=new mongoose.model("User",userSchema);

passport.use(User.createStrategy());

// use static serialize and deserialize of model for passport session support;
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

app.get("/",function(req,res){
    res.render("home");
});

app.get("/login",function(req,res){
    res.render("login");
});
app.get("/register",function(req,res){
    res.render("register");
});

app.get("/secrets",function(req,res){
      if(req.isAuthenticated()){
        res.render("secrets");
      }
      else{
        res.redirect("/login");
      }
});
app.get("/logout",function(req,res,next){
    req.logout(function(err){
        if(err){return next(err);}
        res.redirect("/");
    });

});

// app.post("/register",function(req,res){
//
//   bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
//     // Store hash in your password DB.
//     const newUser=new User({
//      email: req.body.username,
//      password: hash
//    });
//
//    newUser.save(function(err){
//        if(err){
//          console.log(err);
//        }
//        else{
//          res.render("secrets");
//        }
//    });
// });
//
// });

app.post("/register",function(req,res){
       User.register({username:req.body.username},req.body.password,function(err,user){
         if(err){
             console.log(err);
             res.redirect("/register");
         }
         else{
             passport.authenticate("local")(req,res,function(){
                 res.redirect("/secrets");
             });
         }
       })
});


// app.post("/login",function(req,res){
//
//   const username=req.body.username;
//   const password=req.body.password;
//
//
//
//    User.findOne({email: username},function(err,foundUser){
//         if(err){
//           console.log(err);
//         }
//         else{
//             if(foundUser){
//               bcrypt.compare(password, foundUser.password, function(err, result) {
//                 // result == true
//                 if(result===true){
//                   res.render("secrets");
//                 }
//             });
//
//             }
//         }
//    })
// });

app.post("/login",function(req,res){
      const user=new User({
        username: req.body.usename,
        password: req.body.password
      });
      req.login(user,function(err){
         if(err){
           console.log(err);
         }
         else{
           passport.authenticate("local")(req,res,function(){
               res.redirect("/secrets");
           });
         }
      });
});














let port = process.env.PORT;
if (port == null || port == "") {
 port = 3000;
}
// app.listen(port);
app.listen(port, function() {
  console.log("Server started successfully");
});
