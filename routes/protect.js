var express = require('express');
var router = express.Router(),
    mongoose = require("mongoose"),
    passport = require("passport"),
    bodyParser = require("body-parser"),
    localStrategy = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose"),
    User = require("../models/user"),
    Notes = require("../models/notes"),
    Objective = require("../models/objective"),
    ejs = require("ejs");

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
router.use(bodyParser.urlencoded({ extended: true }));

router.get("/", isLoggedIn, (req, res) => {
    res.render("secret")
})

router.get("/notes/:username",isLoggedIn, (req, res) => {
    var name = req.params.username;
    Notes.findOne({ 'username': name }, (err, notes) => {
        if (err) {
            console.log(error);
        }
        else {
            res.render('notes.ejs',{notes:notes});
        }
    })
})

// router.get("/notes/:username", (req, res) => {
//     res.render("addnotes");
// })

router.post("/notes/:username/push",isLoggedIn, (req, res) => {
    console.log("fejgewhg");
    var name = req.params.username;
    var msg = req.body.note;
    var obj = {'note':msg,'date_added':Date.now()};
    Notes.update({ 'username': name },{ $push: { notes: [obj] } }, (err, note) => {
        if (err) {
            console.log(error);
        }
        else {
            // res.send(note);
            res.redirect("/Protected/notes/"+req.params.username);
        }
    })
})

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

module.exports = router;