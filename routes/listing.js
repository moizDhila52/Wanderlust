const express= require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const {isLoggedin, validateListing, isOwner} = require("../middleware.js");
const listingControllers= require("../controllers/listing.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});

router.use(express.urlencoded({ extended: true }));
router.use(express.json());

router.route("/")
.get(wrapAsync(listingControllers.index))   //INDEX Route
.post(isLoggedin,upload.single("listing[image]"),validateListing,wrapAsync(listingControllers.postNewListing))  //CREATE Route

//NEW Route
router.get("/new",isLoggedin,listingControllers.renderNewForm);

//EDIT route
router.get("/:id/edit", isLoggedin,isOwner,wrapAsync(listingControllers.renderEditForm))

router.route("/:id")
.put(isLoggedin ,isOwner,validateListing,upload.single("listing[image]"), wrapAsync(listingControllers.updateListing))  // EDIT Route
.delete(isLoggedin,isOwner,wrapAsync(listingControllers.destroyListing)) //DELETE Route
.get(wrapAsync(listingControllers.showListing)) // SHOW Route

module.exports = router;