var express = require("express"),
    router = express.Router(),
    Campground = require("../models/campground"),
    // When we require a directory, automatically index.js file is imported
    middleware = require("../middleware");

// INDEX - Display list of campgrounds
router.get("/", (req, res) => {
    Campground.find({}, function (err, allCampgrounds) {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/index", {
                campgrounds: allCampgrounds
            });
        }
    });
});

// CREATE - add new campground to the database
router.post("/", middleware.isLoggedIn, (req, res) => {
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCampground = {
        name,
        image,
        description,
        author
    };
    Campground.create(newCampground, function (err, newlyCreated) {
        if (err) {
            console.log(err);
        } else {
            // console.log(newlyCreated);
            req.flash("suc", "Successfully added campground");
            res.redirect("/campgrounds");
        }
    });
});

// NEW - Display forms to add new campground
router.get("/new", middleware.isLoggedIn, (req, res) => {
    res.render("campgrounds/new");
});

// SHOW - Display the info about one campground
router.get("/:id", (req, res) => {
    Campground.findById(req.params.id)
        .populate("comments")
        .exec((err, foundCampground) => {
            if (err) {
                console.log(err);
                req.flash("err", "Campground not found");
                res.redirect("/campgrounds");
            } else {
                // console.log(foundCampground.comments);
                res.render("campgrounds/show", {
                    campground: foundCampground
                });
            }
        });
});

// EDIT - Displays form to edit campground
router.get("/:id/edit", middleware.checkCampgroundOwner, (req, res) => {
    Campground.findById(req.params.id, (err, foundCampground) => {
        res.render("campgrounds/edit", {
            campground: foundCampground
        });
    })

});

// UPDATE - Updates the campground
router.put("/:id", middleware.checkCampgroundOwner, (req, res) => {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground) => {
        if (err) {
            req.flash("err", "Something went wrong");
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
});

// DESTROY - Deletes a campground
router.delete("/:id", middleware.checkCampgroundOwner, (req, res) => {
    Campground.findByIdAndRemove(req.params.id, (err, deleted) => {
        if (err) {
            req.flash("err", "Something went wrong");
            res.redirect("/campgrounds/" + req.params.id);
        } else {
            req.flash("suc", "Successfully deleted campground");
            res.redirect("/campgrounds");
        }
    });
});


module.exports = router;