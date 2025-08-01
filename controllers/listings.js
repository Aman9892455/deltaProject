const Listing = require('../models/listing.js');



module.exports.index=async (req, res) => {
    const allListings = await Listing.find({});

    res.render("listings/index.ejs", { allListings });
}

module.exports.renderNewForm =async (req, res) => {
    const listing = await Listing.find();
     res.render("listings/new.ejs", { listing });
  
}

module.exports.newListing = async (req, res, next) => {
    try {
        if (!req.file) {
            req.flash("error", "No image uploaded");
            return res.redirect("/listings/new");
        }

        // Create new listing with image URL from Cloudinary
        const newListing = new Listing({
            ...req.body.listing,
            image: {
                url: req.file.path,
                filename: req.file.filename
            },
            owner: req.user._id
        });

        await newListing.save();
        
        req.flash("success", "New listing created successfully!");
        res.redirect("/listings");
    } catch (err) {
        next(err);
    }
};


module.exports.showListing=async (req, res) => {
    let { id } = req.params;
const listing = await Listing.findById(id)
  .populate("reviews")
  .populate({
    path: "reviews",
    populate: {
      path: "author"
    }
  })
  .populate("owner");   
  
   if(!listing){
      req.flash("error", "not found!");
       res.redirect("/listings")
    }
    console.log(listing)
    res.render("listings/show.ejs", { listing });
}


module.exports.editListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    
    if (!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }
    
    res.render("listings/edit.ejs", { listing });
}
module.exports.updateListing = async (req, res) => {
    try {
        const { id } = req.params;
        let listing = await Listing.findById(id);
        
        if (!listing) {
            req.flash("error", "Listing not found!");
            return res.redirect("/listings");
        }
        
        // Log the incoming data for debugging
        console.log("Request body:", req.body);
        console.log("Uploaded file:", req.file);
        
        // Update basic fields
        if (req.body.listing) {
            listing.title = req.body.listing.title;
            listing.description = req.body.listing.description;
            listing.location = req.body.listing.location;
            listing.country = req.body.listing.country;
            listing.price = req.body.listing.price;
        }
        
        // Update image if new one was uploaded
        if (req.file) {
            listing.image = {
                url: req.file.path,
                filename: req.file.filename
            };
        }
        
        await listing.save();
        
        req.flash("success", "Listing updated successfully!");
        res.redirect(`/listings/${id}`);
    } catch (err) {
        console.error("Update error:", err);
        req.flash("error", "Failed to update listing: " + err.message);
        res.redirect(`/listings/${id}/edit`);
    }
}






module.exports.destroyListing=async (req, res) => {
    const { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
     req.flash("success", "listing Deleted!"); 
    res.redirect("/listings");
}