const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
main().then(()=>{
    console.log("Connected to DB");
})
.catch((err)=>{
    console.log(err);
});

async function main() {
    await mongoose.connect(MONGO_URL);
    
}

const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj)=>({...obj,owner:"6935c16dd6a83dfe9f8439f7"}));
    await Listing.insertMany(initData.data);
    console.log("data was Initialized");
};

initDB();


// use only once to initialize DB with geo coded data according to location as geometry and category field is missing in init/data.js
/* ---------------- GEO CODING FUNCTION ----------------  */ 
// async function forwardGeocodeGeoJSON(query) {
//   const url = `https://nominatim.openstreetmap.org/search?format=geojson&q=${encodeURIComponent(
//     query
//   )}&limit=1`;

//   const res = await fetch(url, {
//     headers: {
//       "User-Agent": "WanderlustSeed/1.0"
//     }
//   });

//   const geojson = await res.json();
//   return geojson;
// }

// /* ---------------- INIT DB ---------------- */
// const initDB = async () => {
//   await Listing.deleteMany({});

//   const listingsWithGeo = [];

//   for (let obj of initData.data) {
//     const geoData = await forwardGeocodeGeoJSON(obj.location);

//     if (!geoData.features.length) {
//       console.log(`Geocoding failed for ${obj.location}`);
//       continue;
//     }

//     listingsWithGeo.push({
//       ...obj,
//       owner: "6935c16dd6a83dfe9f8439f7",
//       geometry: geoData.features[0].geometry
//     });
//   }

//   await Listing.insertMany(listingsWithGeo);
//   console.log(" Database initialized with geocoded listings");
// };

// initDB();
