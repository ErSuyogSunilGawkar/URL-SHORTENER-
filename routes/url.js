const express = require("express");
const { handlegenerateNewShortURL, handleGetAnalytics } = require("../controllers/url");//importing two functions from controllers.js for making their routes
const router = express.Router();//instead of app now inbuilt "Router()" is used to handle all routes and stored in "router" variable.

router.post("/", handlegenerateNewShortURL); //created route for post request to store short url data in mongo db.

router.get("/analytics/:shortId", handleGetAnalytics);
module.exports = router;