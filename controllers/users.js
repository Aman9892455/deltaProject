const User=require("../models/user.js");


module.exports.renderSignupForm=(req,res)=>{
    res.render("signup.ejs")
}

module.exports.signup=async(req,res)=>{

    try{
       let {username,email,password}=req.body;
    const newUser=new User({email,username}) 
   const registeruser= await User.register(newUser,password)
   console.log(registeruser)

   req.login(registeruser,(err)=>{
      if(err){
          return next(err)
      }
      req.flash("success","Welcome to WonderLust")
     res.redirect("/listings")
   })

   
    }

    catch(e){
      console.log(e)
      req.flash("error",e.message)
       res.redirect("/signup")
    }

}


module.exports.renderLoginForm=(req,res)=>{

    res.render("login.ejs")
}


module.exports. login=async(req,res)=>{
    req.flash("success","Weclcome back to WonderLust , you are logged in!");
    let redirectUrl=res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
}


module.exports.logout=(req, res,next) => {
    req.logout((err) => {
        if(err) {
            return next(err); 
        }
        req.flash("success", "you are logged out now");
        res.redirect("/listings")
    })
}