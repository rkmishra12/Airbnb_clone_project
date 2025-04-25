const express = require("express");
const router = express.Router({mergeParams : true});
const wrapAsync = require("../utilis/wrapAsync.js");
const searchController = require("../controllers/search.js");


router.route("/")
    .get(searchController.search);

module.exports = router;