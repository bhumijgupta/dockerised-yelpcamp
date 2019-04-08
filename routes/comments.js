var express = require("express"),
    router = express.Router({
        mergeParams: true
    }),
    Campground = require("../models/campground"),
    Comment = require("../models/comment"),
    middleware = require("../middleware");

// NEW - shows form to add new comment
router.get("/new", middleware.isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if (err) {
            req.flash("err", "Something went wrong");
            console.log(err);
        } else {
            // console.log("campground found");
            res.render("comments/new", {
                campground: campground
            });
        }
    });
});

// CREATE - add new comment to db
router.post("/", middleware.isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if (err) {
            console.log(err);
            req.flash("err", "Campground not found");
            res.redirect("/campgrounds");
        } else {
            Comment.create(req.body.comment, (err, comment) => {
                if (err) {
                    console.log(err);
                    req.flash("err", "Something went wrong");
                    res.redirect("/campgrounds/" + req.params.id);
                } else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    campground.comments.push(comment);
                    campground.save().then((suc) => {
                        // console.log("comment added");
                        req.flash("suc", "Comment added");
                        res.redirect("/campgrounds/" + req.params.id);
                    });
                }
            });
        }
    });
});

// Comment Edit route
router.get("/:comment_id/edit", middleware.checkCommentOwner, (req, res) => {
    Comment.findById(req.params.comment_id, (err, foundComment) => {
        if (err) {
            req.flash("err", "Something went wrong");
            res.redirect("back");
        } else {
            res.render("comments/edit", {
                campground_id: req.params.id,
                comment: foundComment
            });
        }
    })
});

// Comment update route
router.put("/:comment_id", middleware.checkCommentOwner, (req, res) => {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) => {
        if (err) {
            req.flash("err", "Something went wrong");
            res.redirect("back");
            console.log(err);
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
});

// Comment Delete route
router.delete("/:comment_id", middleware.checkCommentOwner, (req, res) => {
    Comment.findByIdAndDelete(req.params.comment_id, (err, deleted) => {
        if (err) {
            console.log(err);
            req.flash("err", "Comment not found");
            res.redirect("back");
        } else {
            req.flash("suc", "Comment successfully added");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});


module.exports = router;