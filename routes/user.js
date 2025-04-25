const express = require("express");
const router = express.Router();
const wrapAsync = require("../utilis/wrapAsync");
const passport = require("passport");
const { trusted } = require("mongoose");
const { saveRedirectUrl } = require("../middleware.js");

const userController = require("../controllers/user.js");

router.route("/signup")
.get(userController.renderSignupForm)
.post(wrapAsync(userController.signup));


router.route("/login")
    .get(userController.renderLoginForm)
    .post(
        saveRedirectUrl,
        passport.authenticate("local",{
            failureRedirect: "/login", 
            failureFlash: trusted,
        }),
       userController.login
    );
  
    
    
router.get("/logout",userController.logout);


module.exports = router;