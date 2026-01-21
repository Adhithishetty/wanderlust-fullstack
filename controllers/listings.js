const Listing = require("../models/listing");


// module.exports.index = async (req,res,next)=>{
//     const allListings = await Listing.find({});
//     res.render("listings/index.ejs",{allListings});
// };

module.exports.index = async (req, res, next) => {
    const { category, q } = req.query;

    let filter = {};
    // category filter
    if (category) {
        filter.category = category;
    }
    // search filter
    if (q) {
        filter.$or = [
        { title: { $regex: q, $options: "i" } },
        { location: { $regex: q, $options: "i" } }
        ];
    }

    const allListings = await Listing.find(filter);
    res.render("listings/index.ejs", {allListings,category,q});
};


module.exports.renderNewForm = (req,res)=>{
    res.render("listings/new.ejs");
};

module.exports.showListing = async (req,res,next)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({path:"reviews",populate:{path:"author"},}).populate("owner");
    if(!listing){
       req.flash("error","Listing You Requested For Does Not Exist..."); 
       return res.redirect("/listings");
    }
    res.render("listings/show.ejs",{ listing });
};

module.exports.createListing =async (req,res,next)=>{

    // if(!req.body.listing) {//this was not tackling validation errors properly
    //     throw new ExpressError(400,"Send Valid Listing Data");
    // }

    async function forwardGeocodeGeoJSON(query) {
        const url = `https://nominatim.openstreetmap.org/search?format=geojson&q=${encodeURIComponent(query)}&limit=1`;

        const res = await fetch(url, {
            headers: {
            "User-Agent": "CollegeProject/1.0"
            }
        });
        const geojson = await res.json();
        return geojson;
        }
        // usage
        let response = await forwardGeocodeGeoJSON(req.body.listing.location);


        let url = req.file.path;
        let filename = req.file.filename;

        const newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id;
        newListing.image = {url,filename};

        newListing.geometry = response.features[0].geometry;

        let savelist = await newListing.save();
        console.log(savelist);
        req.flash("success","New Listing Created!");
        res.redirect("/listings");
} ;

module.exports.renderEditForm = async (req,res,next)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
       req.flash("error","Listing You Requested For Does Not Exist..."); 
       return res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload","/upload/w_250");
    res.render("listings/edit.ejs",{ listing,originalImageUrl });
};

module.exports.updateListing = async (req,res,next)=>{
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});

    if(typeof req.file !== 'undefined'){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {url,filename};
    await listing.save();
    }

    req.flash("success","Listing Updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async (req,res,next)=>{
    let {id} = req.params;
    const deletedlisting = await Listing.findByIdAndDelete(id);
    console.log(deletedlisting);
    req.flash("success","Listing Deleted!");
    res.redirect("/listings");
};