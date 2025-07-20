const express= require("express");
const router = express.Router();
const User = require("../models/user.js"); 
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js");
const userController = require("../controllers/user.js");

// Signup
router.route("/signup")
.get(userController.renderSignup)
.post(saveRedirectUrl, userController.signUp );


//Login
router.route("/login")
.get(userController.renderLogin)
.post(saveRedirectUrl ,passport.authenticate("local", { 
         failureRedirect: '/login',
         failureFlash:true }),
      userController.login);


//Logout
router.get("/logout", userController.logout);

module.exports = router;