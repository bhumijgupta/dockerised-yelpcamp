var express = require("express"),
  app = express(),
  bodyparser = require("body-parser"),
  mongoose = require("mongoose"),
  passport = require("passport"),
  LocalStrategy = require("passport-local"),
  flash = require("connect-flash"),
  methodOverride = require("method-override"),
  Campground = require("./models/campground"),
  Comment = require("./models/comment"),
  User = require("./models/user"),
  dotenv = require("dotenv").config(),
  port = process.env.PORT || 3000;

var commentRoutes = require("./routes/comments"),
  campgroundRoutes = require("./routes/campgrounds"),
  authRoutes = require("./routes/index");

var db_url = process.env.DB_URL || "mongodb://mongo:27017/yelp_camp";

app.set("view engine", "ejs");
app.use(
  bodyparser.urlencoded({
    extended: true
  })
);
app.use(methodOverride("_method"));
app.use(express.static(__dirname + "/public"));
app.use(flash());
mongoose.connect(db_url, {
  useNewUrlParser: true
}).then((suc) => {
  if (db_url == "mongodb://mongo:27017/yelp_camp") {
    console.log("Connected to dev database");
  } else {
    console.log("Connected to production database");
  }
}).catch((err) => {
  console.log(err);
});

// PASSPORT CONFIG
app.use(
  require("express-session")({
    secret: "Hello this is a secret",
    resave: false,
    saveUninitialized: false
  })
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
// Middleware
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("err");
  res.locals.success = req.flash("suc");
  next();
});

app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/", authRoutes);

app.listen(port, function () {
  console.log("Server listening on port " + port);
});