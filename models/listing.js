const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");


const listingSchema = new Schema({
    title : {
        type : String,
        required : true,
    },
    description : {
        type : String, 
    },
    image : {
        url : String,
        filename : String,
    },
    price : Number,
    location : String,
    country : {
        type:String,
        lowercase : true,
        
    },
    reviews : [
        {
            type : Schema.Types.ObjectId,
            ref : "Review" ,
        }
    ],
    owner : {
        type : Schema.Types.ObjectId,
        ref : "User",
    },
    geometry: {
        type: {
          type: String, // Don't miss this
          enum: ['Point'],
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
      },
    category : {
        type : String,
        enum : ["Rooms","Iconic cities","Mountains","Castles","Amazing pools","Camping","Farms","Arctic","Desert","Beach"],
    },
});

listingSchema.post("findOneAndDelete", async (listing)=>{
    if(listing){
        await Review.deleteMany({_id : {$in : listing.reviews}});  
    }
});

const Listing = mongoose.model("Listing",listingSchema);

module.exports = Listing;

