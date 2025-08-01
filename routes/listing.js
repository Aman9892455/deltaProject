const express = require("express");
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const Listing = require('../models/listing.js');
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer  = require('multer')

const { upload } = require('../cloudConfig');

// Index Route (standalone as it doesn't share path with others)
router.get("/", wrapAsync(listingController.index));

// New Route (standalone)
router.get("/new", isLoggedIn, wrapAsync(listingController.renderNewForm));





// // Create Route (standalone POST to /)
// router.post("/", 
//     isLoggedIn, 
//     validateListing, 
//     wrapAsync(listingController.newListing)
// );



router.post("/", 
    isLoggedIn, 
    upload.single('listing[image]'), 
    validateListing, 
    wrapAsync(listingController.newListing)
);









// Routes for /:id operations
router.route("/:id")
    // Show listing
    .get(wrapAsync(listingController.showListing))
    // Update listing
    .put(
        isLoggedIn,
        isOwner,
       upload.single('listing[image]'), 
        validateListing,
        wrapAsync(listingController.updateListing)
    )
    // Delete listing
    .delete(
        isLoggedIn,
        isOwner,
        wrapAsync(listingController.destroyListing)
    );

// Edit form route (standalone as it has /edit suffix)
router.get("/:id/edit", 
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.editListing)
);

module.exports = router;