const { listingSchema,reviewSchema } = require('./schema.js');
const ExpressError = require('./utils/ExpressError.js');
const Review=require("./models/review")
const Listing=require("./models/listing")
module.exports.isLoggedIn=(req,res,next)=>{
   
   if(!req.isAuthenticated()){
       req.session.redirectUrl=req.originalUrl;
         req.flash("error","you must be logged in!");
        return  res.redirect("/login")
        
    }
    next();
}



// Middleware to save redirect URL
module.exports.saveRedirectUrl = (req, res, next) => {
    // Store original URL if not login/signup page
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;  // Correctly store in session
    }
    next();
};



module.exports.isOwner=async (req,res,next)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id)

     if (!listing.owner.equals(res.locals.currUser._id)) {
     req.flash("error", "You don't have permission to edit this listing");
        return res.redirect(`/listings/${id}`);
    }

    next()
 
}



module.exports.validateListing = (req, res, next) => {
    // req.body.listing को validate करें, न कि पूरे req.body को
    const { error } = listingSchema.validate(req.body.listing); 
    
    if (error) { // 'result.error' की जगह सीधे 'error' चेक करें
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(400, msg);
    } else {
        next();
    }
};



module.exports. validateReview = (req, res, next) => {
    // req.body.listing को validate करें, न कि पूरे req.body को
    const { error } = reviewSchema.validate(req.body); 
    
    if (error) { // 'result.error' की जगह सीधे 'error' चेक करें
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(400, msg);
    } else {
        next();
    }
};




module.exports.isReviewAuthor=async (req,res,next)=>{
    let {id,reviewId}=req.params;
    let review=await Review.findById(reviewId)

     if (!review.author.equals(res.locals.currUser._id)) {
     req.flash("error", "You did not create this review");
        return res.redirect(`/listings/${id}`);
    }

    next()
 
}