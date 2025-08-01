const mongoose = require("mongoose"); // ✅ सही require
const review = require("./review");
const { ref } = require("joi");

const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    price: Number,
    image: {  
        filename: String,
        url: String
    },
    location: String,
    country: String,
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review"

        }
    ],

    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    }
});


listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
 await review.deleteMany({_id:{$in:listing.reviews}});}

})

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing; 

//"https://unsplash.com/photos/silhouette-photography-of-palm-trees-2PgWjPc_c_0"