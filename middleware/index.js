// This file contains all the middlewares required for user auth
var Campground = require("../models/campground"),
    Comment = require("../models/comment");

var middlewareObj = {}

middlewareObj.checkCampgroundOwner = (req, res, next) => {
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, (err, foundCampground) => {
            if (err) {
                req.flash("err", "Campground not found");
                res.redirect("back");
            } else {
                // if(req.user._id == foundCampground.author.id){
                // This will not work cuz author.id is mongoose object not string
                if (foundCampground.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("err", "You don't have permission to do that");
                    res.redirect("back");
                }
            }
        })
    } else {
        req.flash("err", "You need to login first");
        res.redirect("back");
    }
}

middlewareObj.checkCommentOwner = (req, res, next) => {
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, (err, foundComment) => {
            if (err) {
                req.flash("err", "Campground not found");
                res.redirect("back");
            } else {
                // if(req.user._id == foundCampground.author.id){
                // This will not work cuz author.id is mongoose object not string
                if (foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("err", "You don't have permission to do that");
                    res.redirect("back");
                }
            }
        })
    } else {
        req.flash("err", "You need to login first");
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = (req, res, next) => {

    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("err", "You need to login first");
    res.redirect("/login");
};

module.exports = middlewareObj