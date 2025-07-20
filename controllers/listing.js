const Listing = require("../models/listing.js");

const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_BOX_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });
 


module.exports.index = async (req, res) => {
  const { category } = req.query;

  let allListings;
  if (category) {
    allListings = await Listing.find({ category });
  } else {
    allListings = await Listing.find({});
  }

  res.render("listings/index", { allListings, category });
};

module.exports.renderNewForm = (req,res)=>{
res.render("listings/new");
};

module.exports.postNewListing = async (req,res,next)=>{
    // let {title, description,location,country,price,image} = req.body; 
    let response = await geocodingClient.forwardGeocode({
             query: req.body.listing.location,
            limit: 1
            })
  .send()

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image.url = req.file.path;
    newListing.image.filename = req.file.filename;

    newListing.geometry =   response.body.features[0].geometry;

    let savedListing =await newListing.save();
    console.log(savedListing);
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
    
    // const newListing = new Listing({
    //     title: title,
    //     descirption: description,
    //     image: {
    //   url: image,
    //   filename: "newData"
    // },
    //     price: price,
    //     country:country,
    //     location:location
    // })
    // newListing.save()
    // .then(()=>{
    //     res.redirect("/listings");
    // })
    // .catch((err)=>{
    //     console.log(err);
    // })
};

module.exports.renderEditForm = async (req,res)=>{
    const {id} = req.params;    
    const listing = await Listing.findById(id);
    if(!listing){
    req.flash("error","The listing you requested for does not exists.");
    res.redirect("/listings");
    return
    }
    let originalUrl = listing.image.url;
    originalUrl = originalUrl.replace("/upload", "/upload/h_250,w_300,c_fill,g_auto");
    res.render("listings/edit", {listing, originalUrl});
};

module.exports.updateListing = async(req,res)=>{
    const {id} = req.params;
    const listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});
    if(req.file){
        listing.image.url = req.file.path;
        listing.image.filename = req.file.filename;
        await listing.save();    
}
    req.flash("success", "Listing Updated!");
    res.redirect("/listings/"+id);
};

module.exports.destroyListing = async (req,res)=>{
    const {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
};

module.exports.showListing = async(req,res)=>{
const {id} = req.params;
const listing = await Listing.findById(id)
                .populate({
                    path: "reviews",
                    populate:"author"})
                .populate("owner");
if(!listing){
    req.flash("error","The listing you requested for does not exists.");
    res.redirect("/listings");
    return
}
res.render("listings/show", {listing});
}