const Listing = require("../models/listing.js");
const NodeGeocoder = require('node-geocoder');

const geocoder = NodeGeocoder({
    provider: 'opencage',
    apiKey: '750eea8fba4f4fca973f47691029ebae'
  });


module.exports.index = async(req,res)=>{
    let allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});
};

module.exports.renderNewForm = (req,res)=>{
    res.render("listings/new.ejs");
};

module.exports.showListing =async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id)
    .populate({path :"reviews",
        populate : {
            path : "author",
        },
    })
    .populate("owner");
    if(!listing){
        req.flash("error","The Listing you requested for does not exists !");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing});
};


module.exports.createListing = async(req,res,next)=>{
    console.log(req.body);
    const geoRes = await geocoder.geocode(req.body.listing.location);
    const geometry = [geoRes[0].longitude, geoRes[0].latitude];
    let url = req.file.path ;
    let filename = req.file.filename;
    const newListing = new Listing (req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url , filename};
    newListing.geometry = {
        type: "Point",
        coordinates: geometry  // [lng, lat]
      };
    let savedListing = await newListing.save();
    console.log(savedListing);
    req.flash("success","New listing created !");
    res.redirect("/listings");
};



module.exports.renderEditForm = async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","The Listing you requested for does not exists !");
        return res.redirect("/listings");
    }
    res.render("listings/edit.ejs",{listing});
};


module.exports.updateListing = async(req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("success","Listing Updated !");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async(req,res)=>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log("DELETED Item = ",deletedListing);
    req.flash("success","Listing deleted !");
    res.redirect("/listings");
};