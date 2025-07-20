const Joi = require("joi");
const review = require("./models/review");

module.exports.listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
        price: Joi.number().required().min(0),
        country: Joi.string().required(),
        image: Joi.string().allow("",null),
         category: Joi.string().valid(
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
  ).required(),
        
    }).required()
})

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().min(1).max(5).required(),
        comment: Joi.string().required(),
        createdAt: Joi.date().default(Date.now()),
    }).required(),
});
    