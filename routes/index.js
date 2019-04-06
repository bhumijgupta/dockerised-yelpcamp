var express = require("express"),
    router = express.Router(),
    User = require("../models/user"),
    passport = require("passport");

router.get("/", function (req, res) {
    res.render("landing");
});

// Shows Signup form
router.get("/register", (req, res) => {
    res.render("register");
});

// Creates new user
router.post("/register", (req, res) => {
    var newUser = new User({
        username: req.body.username
    });
    User.register(newUser, req.body.password, (err, user) => {
        if (err) {
            console.log(err);
            req.flash("err", err.message);
            return res.redirect("/register");
        }
        passport.authenticate("local")(req, res, () => {
            req.flash("suc", "Welcome to YelpCamp " + user.username);
            res.redirect("/campgrounds");
        });
    });
});

// shows login form
router.get("/login", (req, res) => {
    res.render("login");
});

// handles login logic
router.post(
    "/login",
    passport.authenticate("local", {
        successRedirect: "/campgrounds",
        failureRedirect: "/register",
        failureFlash: true
    }),
    (req, res) => {}
);

// logs out the user
router.get("/logout", (req, res) => {
    req.logout();
    req.flash("suc", "Logged you out");
    res.redirect("/campgrounds");
});

module.exports = router;