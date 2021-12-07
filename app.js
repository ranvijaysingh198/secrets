//jshint esversion:6
require('dotenv').config();
const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;


const app = express();

// console.log(process.env.API_KEY);

app.use(express.static("public"));
app.set("view engine","ejs");
app.use(express.urlencoded({extended:true}));

mongoose.connect("mongodb://localhost:27017/userDB");
const userSchema = new mongoose.Schema({
    email:String,
    password:String
});

// process.env.SECRET will fetch the value of SECRET from .env file
// secret = process.env.SECRET;
// userSchema.plugin(encrypt,{secret:secret, encryptedFields:["password"]});

const User = new mongoose.model("User",userSchema);




app.get("/", function(req,res){
    res.render("home");
});

app.get("/login",function(req,res){
    res.render("login");
});

app.get("/register",function(req,res){
    res.render("register");
});


app.post("/register",(req,res)=>{
    bcrypt.hash(req.body.password,saltRounds,function(err,hash){
        const newUser = new User({
            email:req.body.username,
            password:hash
        });
        newUser.save(function(err){
            if(err){
                console.log(err)
            }
            else{
                res.render("secrets")
            }
        });
    })
   
});

app.post("/login",(req,res)=>{
    username = req.body.username;
    password = req.body.password;
    User.findOne({email:username},(err,foundUser)=>{
        if(err){
            console.log(err);
        }else{
            if(foundUser){
                bcrypt.compare(password,foundUser.password,function(err,result){
                    if(result === true){
                        res.render("secrets");
                    }
                });
                }else{
                    res.send("The entered password is wrong. Try Again ");
                }
            }
        });
});





app.listen(3000, function(){
    console.log("Server started on port 3000");
});
