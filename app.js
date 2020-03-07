var express = require("express"),
    app = express(),
    mongoose = require('mongoose'),
    dotenv = require("dotenv").config(),
    bodyParser = require("body-parser"),
    passport = require("passport"),
    localStrategy = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose"),
    User = require("./models/user"),
    registerRoute = require('./routes/register'),
    loginRoute = require('./routes/login'),
    protectRoute = require('./routes/protect'),
    ejs = require("ejs");
    
mongoose.connect(process.env.LOCALDB,{ useNewUrlParser: true, useUnifiedTopology: true },()=>{
    console.log("db connected")
});

app.use(require("express-session")({
    secret: "secret!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(express.static(__dirname + '/public'));
app.set("view engine", "ejs");
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.methodOverride());
app.use('/Login', loginRoute);
app.use('/Signup', registerRoute);
app.use('/Protected', protectRoute);

app.get("/",(req,res)=>{
    res.render("index");
})

app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
});

app.listen(process.env.PORT || 3000, function() {
    console.log("Server started!!!");
});