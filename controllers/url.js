const {nanoid} = require("nanoid");//imported nanoid builtin library to convert our url into shorturl.
//const shortid = require("nanoid")
const URL2 = require("../models/url");//imported schema from url.js(models) and stored it in "URL2" variable to do create operation on db.

async function handlegenerateNewShortURL(req, res){//created this function to convert url store into db.
    const body = req.body;//received json data(link) from postman and storing in body variable.
    if(!body.url) {
        return res.status(400).json({ error: req.body});
    }//if no body in json data sent by postman return an error.
    const shortID = nanoid(8);//converted short url into 8 characters and storing in "shortID" variable.
    await URL2.create({//creating db entry of url using mongoose schema stored in "URL2"
        shortId: shortID,
        redirectURL: body.url,
        visitHistory: [],
        createdBy: req.user._id
    });
   //displaying shortened url on postman response bar
    return res.render("home", { id: shortID });
    
}

async function handleGetAnalytics(req, res) {// displaying the analytics of shortened url.
    const shortId = req.params.shortId;
    const result = await URL2.findOne({ shortId});
    return res.json({
        totalClicks: result.visitHistory.length,
        analytics: result.visitHistory
    })
}

module.exports = {
    handlegenerateNewShortURL,
    handleGetAnalytics
};