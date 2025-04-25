const Listing = require("../models/listing.js");

module.exports.search = async(req,res)=>{
    let {search : searchCountry} = req.query;
    if(searchCountry){
        searchCountry = searchCountry.toLowerCase();
        let foundLocations = await Listing.find({country : searchCountry});
        res.render("listings/search.ejs",{foundLocations});
    }
    let {category:searchCategory} = req.query;
    if(searchCategory){
        let foundLocations = await Listing.find({category : searchCategory});
        res.render("listings/search.ejs",{foundLocations});
    }
};