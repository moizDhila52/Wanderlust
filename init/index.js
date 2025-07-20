const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

main()
.then(()=>{
    console.log("Connection establised!!");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

const initDB = async ()=>{
 await Listing.deleteMany({});
 initData.data = initData.data.map((obj)=>({...obj, owner:"68754a52d4dc5b857cc2f156"}));
 await Listing.insertMany(initData.data);
console.log("data was initialized");
}

initDB();   