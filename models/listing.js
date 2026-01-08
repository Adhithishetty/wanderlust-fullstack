const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");


const listingSchema = new Schema({
    title:{
        type: String,
        required: true
    },
    description: String,
    image:{
        // type:String,
        // default: "https://images.unsplash.com/photo-1520406153111-4d1d4cfd3684?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxjb2xsZWN0aW9uLXBhZ2V8MXw5NTY0ODYzfHxlbnwwfHx8fHw%3D",  
        // set: (v)=>
        //     v === "" ? "https://images.unsplash.com/photo-1520406153111-4d1d4cfd3684?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxjb2xsZWN0aW9uLXBhZ2V8MXw5NTY0ODYzfHxlbnwwfHx8fHw%3D"
        //     : v
        url : String,
        filename : String,  
    },
    price: Number,
    location:String,

    country:String,
    reviews : [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        }
    ],
    owner : {
            type: Schema.Types.ObjectId,
            ref: "User",
    },
    geometry: {
        type: {
        type: String, // Don't do `{ location: { type: String } }`
        enum: ['Point'], // 'location.type' must be 'Point'
        required: true,
        default: "Point"
        },
        coordinates: {
        type: [Number],
        required: true,
        default: [77.2090, 28.6139] // Default to coordinates of New Delhi
        }
    },
    category: {
        type: String,
        required: true,
        enum: [
            "Trending",
            "Rooms",
            "Iconic cities",
            "Mountain",
            "Castles",
            "Amazing pool",
            "Camping",
            "Farms",
            "Arctic",
            "Domes",
            "Boats"
        ],
         default: "Trending"
    },

});

//post middleware to be triggerred when delete route of listing is called 
listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await Review.deleteMany({_id:{$in: listing.reviews}});
    }
})

const Listing = mongoose.model("Listing",listingSchema);
module.exports = Listing;