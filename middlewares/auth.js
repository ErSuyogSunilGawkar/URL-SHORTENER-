const {getUser} = require("../service/auth");

async function restrictToLoggedinUserOnly(req, res, next) {
    const userUid = req.cookies?.uid;

    if(!userUid) return res.redirect("/login");

    const user = getUser(userUid);

    if(!user) return res.redirect("/login");

    req.user = user;
    next();
}


//function to restrict views of created urls to itself
//i.e only i can see how many short urls i have created.
/*async function checkAuth(req, res, next) {
    const userUid = req.cookies?.uid;

    const user = getUser(userUid);

    req.user = user;
}*/


module.exports = {
    restrictToLoggedinUserOnly,
    //checkAuth
}