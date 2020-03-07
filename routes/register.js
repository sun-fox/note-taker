var express = require('express');
var router = express.Router(),
    mongoose = require("mongoose"),
    passport = require("passport"),
    bodyParser = require("body-parser"),
    localStrategy = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose"),
    User = require("../models/user"),
    Notes = require("../models/notes");

router.use(require("express-session")({
    secret: "secret!",
    resave: false,
    saveUninitialized: false
}));


router.use(passport.initialize());
router.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.get('/', async function (req, res) {
    try {
        res.render('signup.ejs');
    } catch (err) {
        res.send(err);
    }
});

router.post('/new_user', (req, res) => {
    try {
        console.log("hello " + req.body);
        User.register(new User({ username: req.body.username, email: req.body.email, phoneno: req.body.phoneno, aadharno: req.body.aadharno }), req.body.password, function (err, user) {
            if (err) {
                console.log("error in user registering!")
                console.log(err);
                return res.render("signup");
            }
            passport.authenticate("local")(req, res, () => {
                console.log("User Authenticated")
                var obj = new Notes({'username':req.body.username,'email': req.body.email,'notes':[]});
                obj.save((err,note)=>{
                    if(err){
                        console.log(err);
                    }
                    else{
                        console.log("initialization note added");
                        res.redirect("/");
                    }
                });
            })
        })
    }
    catch (err) {
        res.send(err);
    }
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    console.log("Access Denied!!")
    res.redirect("/login");
}
module.exports = router;