const User= require("../models/user.js");

module.exports.renderSignup =  (req,res)=>{
    res.render("users/signup.ejs");
}

module.exports.signUp = async(req,res,next)=>{
    try{
    let {username, email, password}= req.body;
    const newUser = new User({username, email});
    let registeredUser = await User.register(newUser, password);
    req.login(registeredUser,(err)=>{
        if(err){
            return next(err);
        }
    req.flash("success","Welcome to Wanderlust");
    let redirectUrl = res.locals.redirectUrl || "/listings"
    res.redirect(redirectUrl);
    })
    }
    catch(e){
    req.flash("error",e.message);
    res.redirect("/signup");
    }   
}

module.exports.renderLogin = (req,res)=>{
    res.render("users/login.ejs");
};

module.exports.login =  async (req,res)=>{
        req.flash("success",  "Welcome back to Wanderlust");
        let redirectUrl = res.locals.redirectUrl || "/listings";
        res.redirect(redirectUrl);
};

module.exports.logout = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
    req.flash("success" , "You are logged out!");
    res.redirect("/listings");
    })  
};