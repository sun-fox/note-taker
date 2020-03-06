var express = require("express"),
    app = express(),
    mongoose = require('mongoose'),
    bodyParser = require("body-parser"),
    passport = require("passport"),
    localStrategy = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose"),
    User = require("./models/user"),
    registerRoute = require('./routes/register'),
    loginRoute = require('./routes/login'),
    protectRoute = require('./routes/protect'),
    ejs = require("ejs");
    
mongoose.connect("mongodb://localhost/Notes",{ useNewUrlParser: true, useUnifiedTopology: true },()=>{
    console.log("db connected")
});

app.use(require("express-session")({
    secret: "secret!",
    resave: false,
    saveUninitialized: false
}));
app.set("view engine", "ejs");
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(express.static(__dirname + '/public'));
app.set("view engine", "ejs");
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/Login', loginRoute);
app.use('/Signup', registerRoute);
app.use('/Protected', protectRoute);

app.get("/",(req,res)=>{
    res.send("Hello");
})

app.listen(process.env.PORT || 3000, function() {
    console.log("Server started!!!");
});