const mongoose = require("mongoose"); // ✅ सही require




const reviewSchema=new  mongoose.Schema({
      
    comment:{
        type:String,
        
    },

rating:{
    type:Number,
    min:0,
    max:5
},

  createdAt: {
    type: Date,
    default:Date.now()

  },
 author: {
  type:mongoose.Schema.Types.ObjectId,
   ref:"User"
  }
})



module.exports=mongoose.model("Review",reviewSchema);