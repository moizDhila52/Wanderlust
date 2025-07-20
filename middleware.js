const Listing = require("./models/listing.js")
const {listingSchema,reviewSchema} = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");
const Review = require("./models/review.js")

module.exports.isLoggedin = (req,res,next) =>{
    console.log("Method",req.method,"     Original URL:",req.originalUrl);
    if(!req.isAuthenticated()){
        if(req.method === "GET"){
    req.session.redirectUrl = req.originalUrl;
        } else if (req.method === "POST" || req.method === "DELETE") {
            // Handle review POST separately
            const { id } = req.params;
            req.session.redirectUrl = `/listings/${id}`;
        }
    req.flash("error", "User must be logged in to create,update,delete a Listing.");
    return res.redirect("/login");   
    }
    next();
}

module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
    res.locals.redirectUrl = req.session.redirectUrl;
    console.log("redirect URL: ",res.locals.redirectUrl );

    }
    next();
}

module.exports.isOwner = async (req,res,next) =>{
    const {id} = req.params;
    const listing = await Listing.findById(id);
    if(!(listing.owner._id.equals(res.locals.currUser._id))){
        req.flash("error", "You are not authorized user to make edits!");
        return res.redirect("/listings/"+id);
    }
    next();
}

module.exports.validateListing = (req,res,next) =>{
    const {error}=listingSchema.validate(req.body);
    if(error){
        console.log(error.details);
        errMsg = error.details.map((el)=>el.message).join(", ");
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
}

module.exports.validateReview = (req,res,next) =>{

    const {error}=reviewSchema.validate(req.body);
    if(error){
        console.log(error.details);
        errMsg = error.details.map((el)=>el.message).join(", ");
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
}

module.exports.isReviewAuthor = async(req,res,next)=>{
    const {id,reviewId} = req.params;
    const review = await Review.findById(reviewId);
    if(!(review.author._id.equals(res.locals.currUser._id))){
        req.flash("error", "You are not authorized user to delete review");
        return res.redirect("/listings/"+id);
    }
    next();
}