if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}


const express = require("express");
const app = express();
const port = 8080;
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utilis/ExpressError.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport")
const localStrategy = require("passport-local");
const User = require("./models/user.js");




const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const searchRouter = require("./routes/search.js");


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended : true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

const DB_URL = process.env.ATLASDB_URL;


main()
    .then(()=>{
        console.log("DB connected")
    }).catch((err)=>{
        console.log(err);
    });


async function main() {
    await mongoose.connect(DB_URL);
}


const store = MongoStore.create({
    mongoUrl : DB_URL,
    crypto : {
        secret : process.env.SECRET
    },
    touchAfter : 24 * 3600 ,
});

store.on("error",()=>{
    console.log("Error in Mongo Session Store " , err);
});


const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie : {
        expires : Date.now() + 7 * 24 * 60 * 60 * 1000 ,
        maxage : 7 * 24 * 60 * 60 * 1000,
        httpOnly : true,
    }
};




app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});


app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);
app.use("/search",searchRouter);



app.all(/(.*)/,(req,res,next)=>{
    next(new ExpressError(404,"Page not found!"));
});

app.use((err,req,res ,next)=>{
    let {statusCode = 500 , message = "Some error  occured"} = err;
    res.status(statusCode).render("error.ejs",{err});
});


app.listen(port,()=>{
    console.log("App is listening on port  : ",port);
});