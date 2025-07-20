if(process.env.NODE_ENV != "production"){
require('dotenv').config();
}
const express= require("express");
const app = express();
const port  =process.env.PORT;
const mongoose  = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");


const url = process.env.ATLASDB_URL;

const store = MongoStore.create({
    mongoUrl:url ,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter: 24*3600,
})

const sessionOption= {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized:true,
}
app.set('view engine', "ejs");
app.set("views", path.join(__dirname,"views"));
app.engine("ejs", ejsMate);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname,"public")));
app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");


app.use((req,res,next)=>{
    res.locals.success= req.flash("success");
    res.locals.error= req.flash("error");
    res.locals.currUser= req.user;
    next();
})
app.use("/listings", listingRouter);
app.use("/listings/:id/review", reviewRouter);
app.use("/", userRouter);

main()
.then(()=>{
    console.log("Connection establised!!");
})
.catch(err => console.log(err));

async function main() {
await mongoose.connect(url);
}

app.listen(port, ()=>{
    console.log(`Listening on ${port}.`);
})

// app.get("/demouser",async(req,res)=>{
//     let fakeUser = new User({
//         email:"student@gmail.com",
//         username:"deltaStudent",
//     });
//     let registeredUser = await User.register(fakeUser, "helloWorld");
//     res.send(registeredUser);
// })

// app.get("/testListing", async (req,res)=>{
//    const t1 = new Listing({
//     title: "Harry Poter",
//     descirption: "It is a sci fi film having a total of eight parts", 
//     price: 231,
//     location: "Delhi-NCR",
//     country :"India"
//    })
//    await t1.save()
//    .then ((res)=>{
//     console.log(res)
//    })
//    .catch((err) => {
//     console.log(err);
//    })
//    res.send("Site is working.");
// })
app.all(/.*/, (req, res, next) => {
next(new ExpressError(404, "Page not found!"));
});

app.use((err,req,res,next)=>{
    let {status = 500, message="Internal Server Error"} = err;
    res.render("listings/error.ejs",{err,status});
})
