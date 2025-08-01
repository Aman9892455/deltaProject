if(process.env.NODE_ENV != "production"){
require('dotenv').config()
}



const express = require("express");
const mongoose = require("mongoose");
const wrapAsync = require('./utils/wrapAsync.js');
const path = require("path");
const ExpressError = require('./utils/ExpressError.js');
const methodOverride = require('method-override');
const ejsMate = require("ejs-mate");
const { listingSchema,reviewSchema } = require('./schema.js');
const Listing = require('./models/listing.js');
const flash=require("connect-flash")
const {isLoggedIn}=require("./middleware.js")



const session=require("express-session")
const MongoStore = require('connect-mongo');


const reviewRouter=require('./routes/review.js')
const listingRouter=require("./routes/listing.js");
const userRouter=require("./routes/user.js");

///const cookie = require("express-session/session/cookie.js");


const passport=require("passport")
const LocaleStrategy=require("passport-local")
const User=require("./models/user.js")

 

const app = express();

app.engine('ejs', ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

const port = 3000;

const dbUrl=process.env.ATLASDB_URL;

async function main() {
    // await mongoose.connect(MONGO_URL);
    await mongoose.connect(dbUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        ssl: true,
        // If still failing, try this (temporary for debugging):
        // sslValidate: false // Disables SSL certificate validation (not recommended for production)
    }); 

}

main()
    .then(res => {
        console.log("connected to db");
    })
    .catch(err => {
        console.log(err);
    });


const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET
    },
    touchAfter: 24 * 3600
});

store.on("error", (err) => {  // Added err parameter here
    console.log("Error in mongo session store", err);
});

const sessionOptions = {
    store,
    secret:process.env.SECRET ,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),  // Fixed Date object creation
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
};


app.use(session(sessionOptions))
app.use(flash())

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocaleStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// app.get("/", (req, res) => {
//     res.send("server is working");
// });


app.use((req, res, next) => {
    res.locals.success = req.flash("success")[0]; // Get first message
    res.locals.error = req.flash("error")[0];    // Get first message
    res.locals.currUser=req.user;
    next();
});

// app.get("/demouser",async(req,res)=>{
   
//     let fakeUser=new User({
//         email:"student@gmail.com",
//         username:"delta-students"
//     })
//    let registereduser= await User.register(fakeUser,"helloworld")
//   res.send(registereduser);
// })

app.use("/listings",listingRouter)
app.use("/listings/:id/reviews",reviewRouter)
app.use("/",userRouter)

















// 1. 404 Not Found Handler (must come after all routes)
app.all('*', (req, res, next) => {
    next(new ExpressError(404, 'Page Not Found'));
});

// 2. Central Error Handler (must come last)
app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something went wrong!" } = err;
    
    // For API requests
    if (req.originalUrl.startsWith('/api')) {
        return res.status(statusCode).json({
            error: true,
            status: statusCode,
            message: message
        });
    }
    
    // For regular views 
    res.status(statusCode).render('error', {  statusCode, message });
});


app.listen(port, () => {
    console.log(`app is listening on port ${port}`);
});


