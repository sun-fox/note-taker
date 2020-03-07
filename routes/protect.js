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

router.get("/notes/:username", (req, res) => {
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

router.put("/notes/:username/push", (req, res) => {
    var name = req.params.username;
    var msg = req.body.note;
    var obj = {'note':msg,'date_added':Date.now()};
    Notes.update({ 'username': name },{ $push: { notes: [obj] } }, (err, note) => {
        if (err) {
            console.log(error);
        }
        else {
            res.send(note);
        }
    })
})

// router.post("/notes/:username/add", (req, res) => {
//     var name = req.parmas.username;
//     var notte = new Notes({})
// })

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

module.exports = router;