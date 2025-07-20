const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");
const User = require("./user.js");
const { required } = require("joi");
const listingSchema = new Schema({
    title:{
        type:String,
        required:true},
    description: String,    
    image: {
    url:String,
    filename:String,
    },
    price: Number,
    location: String,
    country :String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ],
    owner : {
        type:Schema.Types.ObjectId,
        ref:"User",
    },
    geometry: {
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ['Point'], // 'location.type' must be 'Point'
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
   category: {
  type: String,
  enum: [
    'trending',
    'rooms',
    'iconic cities',
    'mountains',
    'desert',
    'beach',
    'castles',
    'amazing pool',
    'camping',
    'farms',
    'arctic'
  ],
  required: true,
  trim: true
}
    }
);

listingSchema.post("findOneAndDelete",async(doc)=>{
    if(doc){
    await Review.deleteMany({_id :{$in: doc.reviews}});
    console.log("Review deleted");
    }
})
const Listing = mongoose.model("Listing", listingSchema);
module.exports =Listing; 