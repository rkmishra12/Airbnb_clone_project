const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const { listingSchema, reviewSchema } = require("./schema.js");
const ExpressError = require("./utilis/ExpressError.js");


module.exports.validateListing = (req,res,next) =>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errorMessage = error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400,errorMessage);
    }else{
        next();
    }
};

module.exports.validateReview = (req,res,next) =>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errorMessage = error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400,errorMessage);
    }else{
        next();
    }
};




module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        // redirect url save
        req.session.redirectUrl = req.originalUrl ;
        req.flash("error","You have to login first to this !");
        return res.redirect("/login");
    }
    next();
};


module.exports.saveRedirectUrl = (req,res,next) =>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};


module.exports.isOwner = async (req,res,next)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(res.locals.currUser &&!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","Only owner can access this !");
        return res.redirect(`/listings/${id}`);
    }
    next();
};



module.exports.isReviewAuthor = async (req,res,next)=>{
    let {reviewId,id} = req.params;
    let review = await Review.findById(reviewId);
    if(res.locals.currUser && !review.author._id.equals(res.locals.currUser._id)){
        req.flash("error","Only review author can access this !");
        return res.redirect(`/listings/${id}`);
    }
    next();
};



