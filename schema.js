// schema.js फाइल में यह होना चाहिए:
const Joi = require('joi');
const review = require('./models/review');

const listingSchema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string(),
    price: Joi.number().min(0),
    image: Joi.object({
        filename: Joi.string(),
        url: Joi.string().uri()
    }),
    location: Joi.string(),
    country: Joi.string()
});

module.exports = { listingSchema }; // सही export


 module.exports.reviewSchema = Joi.object({
    
   review:Joi.object(
    {
          rating:Joi.number().required().min(1).max(5),
          comment:Joi.string().required(),
    }
   ).required()

});