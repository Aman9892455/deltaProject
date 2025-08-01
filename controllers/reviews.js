const Listing = require('../models/listing.js');
const Review = require('../models/review.js');

module.exports.createReview=async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id);
        const newReview = new Review(req.body.review);
        
        // Correct way to assign author (using the logged-in user)
        newReview.author = req.user._id;
        
        listing.reviews.push(newReview);
        
        // Save operations should be in proper order
        await newReview.save();
        await listing.save();
        
        req.flash("success", "New review added!");
        res.redirect(`/listings/${listing._id}`);
    } catch (err) {
        console.error(err);
        req.flash("error", "Failed to add review");
        res.redirect(`/listings/${req.params.id}`);
    }
}


module.exports.destroyReview=async (req, res) => {
    const { id, reviewId } = req.params;
    
    // 1. Remove review reference from listing
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    
    // 2. Delete actual review
    await Review.findByIdAndDelete(reviewId);
     req.flash("success", "review Deleted successfully!"); 
    res.redirect(`/listings/${id}`);
}