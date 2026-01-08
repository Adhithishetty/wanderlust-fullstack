const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js")
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn,isOwner,validatelisting} = require("../middleware.js");

const listingController = require("../controllers/listings.js");
//image file saving 
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });

//validation middleware in middleware.js

router
    .route("/")
    //Index Route
    .get(wrapAsync(listingController.index))
    //create route
    .post(isLoggedIn,
        upload.single('listing[image]'),
        validatelisting,
        wrapAsync(listingController.createListing)
    );
    

    
//new route
router.get("/new",isLoggedIn,listingController.renderNewForm);

router
    .route("/:id")
    //show route
    .get(wrapAsync(listingController.showListing))
    //update
    .put(isLoggedIn,
        isOwner,
        upload.single('listing[image]'),
        validatelisting,
        wrapAsync(listingController.updateListing)
    )
    //delete
    .delete(isLoggedIn,isOwner,wrapAsync(listingController.deleteListing))


//edit
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));


module.exports = router;