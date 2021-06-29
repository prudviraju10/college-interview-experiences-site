require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
var session = require('express-session');
var MongoDBStore = require('connect-mongodb-session')(session);
var nodemailer = require('nodemailer');
var cors = require('cors');
var {Credential, Post, Company} =  require("./schemas/dbschemas");
const { json } = require('express');


mongoose.set('useFindAndModify',false);
mongoose.connect(process.env.DB_URL, {useNewUrlParser:true, useUnifiedTopology:true, useFindAndModify: false});
const app = express();

var store = new MongoDBStore({
    uri: process.env.DB_URL,
    collection: 'mySessions',
    connectionOptions: {
        useNewUrlParser: true,
        useUnifiedTopology: true
      }
  });

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
app.use(cors({
    origin: "http://localhost:3000",
    methods: ['GET','POST','OPTIONS','HEAD'],
    credentials: true,
    exposedHeaders: ['set-cookie']
}));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: store,
    cookie: {
        maxAge: 15 * 24 * 60 * 60 * 1000
      }
  }));

const authmiddleware = (req, res, next) => {
    if(req.session.isAuth){
        next();
    }
    else{
        res.redirect("/");
    }
}





app.get("/", function(req,res){
    // req.session.isAuthfrrstpswd = true;
    if(req.session.isAuth){
        // return res.redirect("/home");
        return res.send({isloggedin:true,name:req.session.username,user_id:req.session.userid});
    }
    // res.render("login");
    res.send({isloggedin:false});
});

app.post("/", function(req, res){
    // console.log(req);
    Credential.findOne({email : req.body.user_mail},  function(err,result){
        console.log(result);
        if(!result){
            res.send({isvaliduser: false});
        }
        else{
            bcrypt.compare(req.body.user_password, result.password, function(err, re){
            // console.log(res);
            if(re){
                req.session.isAuth = true;
                req.session.userid = result._id;
                req.session.username= result.name;
                console.log(req.session);
                // res.redirect("/home");
                res.send(JSON.stringify({isvaliduser:true, name:result.name, user_id:result._id}));
            }
            else{
                // res.send("<h1>Invalid Credentials</h1>")
                res.send({isvaliduser: false});
            }
        });
    }
        // console.log("done");
    });

});

app.get("/register", function(req,res){
    res.render("register");
});

app.post("/register", function(req,res){
    // console.log(req.body);
    Credential.findOne({email : req.body.user_mail})
    .then((result)=>{
        // console.log(result);
        if(result){
            // console.log(result);
            // res.send("<h1>email already registered </h1>");
            res.send({isdone:false,});
        }
        else{
            var hashed_password = bcrypt.hashSync(req.body.user_password, 8);
            console.log(hashed_password);
            const credential = new Credential({name: req.body.user_name, email: req.body.user_mail, password: hashed_password, reset: false });
            credential.save();
            // res.redirect("/");
            res.send({isdone:true,})
        }
    })
});

app.get("/home", authmiddleware, function(req,res){
    // res.redirect("/")
    res.render("home");
});

app.post("/logout", function(req,res){
    req.session.destroy((err) => {
        // res.redirect("/");
        res.send({isloggedout:true});
    })
});

app.get("/resetlinkroute", function(req, res){
    if(req.session.isAuthfrrstpswd){
        req.session.count = 0
        req.session.isAuthfrrstpswd = false;
        res.render("resetlink");
    }
    else{
        // res.send("<h1>You can only come here by clicking forgot password in login page🤣</h1>");
        res.redirect("/");
    }
});

app.post("/resetlinkroute", function(req, res){
    console.log(req.body);
    Credential.findOne({email : req.body.user_mail},  function(err,result){
        if(!result){
            // res.send("<h1>You're not registered</h1>");
            res.send({isvalidmail: false})
        }
        else{
            // res.send("<h1>Check your mail</h1>");
            res.send({isvalidmail: true});
            var transporter = nodemailer.createTransport({
                service: 'gmail',
                // host: 'smtp.gmail.com',
                // port: 587,
                // secure: false,
                requireTLS: true,
                auth: {
                  user: process.env.USER_MAIL,
                  pass: process.env.USER_MAIL_PASSWORD
                }
              });
            
              var mailOptions = {
                from: process.env.USER_MAIL,
                to: req.body.user_mail,
                subject: 'No-reply',
                html: '<h1><a href= "http://localhost:5005/resetpswd">your link</a>Welcome</h1><p>That was easy!</p>'
              }

              Credential.findOneAndUpdate({email: req.body.user_mail},{ $set: {reset: true}},{new: true} , (err, doc) => {
                if(err){
                    console.log("something went wrong");
                }
                else{
                    console.log(doc);
                }
            });
       
            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                  console.log(error);
                } else {
                  console.log('Email sent: ' + info.response);
                }
              });
        }
    });
});

app.get("/resetpswd", function(req,res){
    if(!req.session.count){
        req.session.count = 0
    }
    req.session.count += 1;
    if(req.session.count === 1){
        res.render("resetpassword");
    }
    else{
            res.send("<h1>Link expeired</h1>");
    }
});

app.post("/resetpswd", function(req, res){
    Credential.findOne({email : req.body.user_mail},  function(err,result){
        if(!result){
            res.send("<h1>Give correct mail</h1>");
        }
        else if(result.reset){
            console.log(req.body);
            var hashed_password = bcrypt.hashSync(req.body.new_pswd, 8);
            Credential.findOneAndUpdate({email: req.body.user_mail},{ $set: {password: hashed_password, reset:false}},{new: true} , (err, doc) => {
                if(err){
                    console.log("something went wrong");
                }
                else{
                    console.log(doc);
                }
            });
            res.send("<h1>Password Updated</h1>");
        }
        else{
            res.send("<h1>You've already reset the password,, if forgot goto login page and click forgot password /h1>")
        }
    });

    
});

app.get("/testingreact", function(req,res){
    const ex_data_react = {
        one: "one",
        two: "two"
    }
    res.send(ex_data_react)
});

//this route is for entering post into database
app.post("/testingreact", function(req,res){
    console.log(req.body);
    console.log(new Date());
    const post = new Post({userid: req.body.userid, title:req.body.title,u_name:req.body.u_name,time:Date(), c_name : req.body.c_name, c_role: req.body.c_role, branch: req.body.branch, desc: req.body.desc});
    post.save();
    res.send("done");
});

//this route is for updating the post
app.post("/updatepost", function(req,res){
    // console.log(req.body);
    Post.findByIdAndUpdate(req.body.postid,{title:req.body.title,time:Date(), c_name : req.body.c_name, c_role: req.body.c_role, branch: req.body.branch, desc: req.body.desc},{new:true}, (err,doc) => {
        if(err){
            res.send({updated:false})
        }
        else{
            res.send({updated:true})
        }
    })
})


app.get("/test", function(req,res){
    // const company = new Company({company_name : "Infosys", company_roles : ["se", "ses", "sp"]});
    // company.save();
    // console.log("get requested");
    Post.find({}).sort({time:-1}).then((result) => {
        console.log(result[0].time.getDate());
        res.send(JSON.stringify(result));
    })
})


app.get("/companies", function(req,res) {
    Company.find({}).then((result) => {
        res.send(result);
    })
})

app.listen(5005, function(){
    console.log("server started successfully🤩");
})

// a.sort((a,b)=> (a.name > b.name ? 1 : -1))          for sorting posts array according to the date