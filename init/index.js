const mongoose=require("mongoose");
const initdata=require("./data.js")

const Listing=require("../models/listing.js");





async function main(){
   mongoose.connect("mongodb://127.0.0.1:27017/wonderlust")
}

main().then(res=>{
    console.log(res);
})
.catch(err=>{
    console.log(err);
})



const initDB= async()=>{
await Listing.deleteMany({})
initdata.data=initdata.data.map((obj)=>({...obj,owner:"687b90de01be4a76e5f84644"}))
await Listing.insertMany(initdata.data);
console.log("data was initialized");


}

initDB();