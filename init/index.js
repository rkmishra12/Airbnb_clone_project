const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");


main()
    .then(()=>{
        console.log("DB connected")
    }).catch((err)=>{
        console.log(err);
    });


async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/airbnb");
}


const initDB = async () =>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj)=>(
        {
            ...obj,
            owner : "68043040022b6c64ca30959e",
        }
    ));
    await Listing.insertMany(initData.data);
    console.log("Data saved");
};

initDB();