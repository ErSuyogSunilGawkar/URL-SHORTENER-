const express = require("express"); //imported express
const { connectToMongoDB } = require("./connect"); //imported connection function (connectToMongoDB) from connect.js for mongoose connection with mongoDB
const URLN = require("./models/url");//imported schema from url.js(models) and stored it in "URLN" variable.
const app = express();//making "app" as instance of express class.
const PORT = 8001;
const path = require('path');//importing path module for ejs engine.
const {restrictToLoggedinUserOnly} = require("./middlewares/auth");
const cookieParser = require("cookie-parser");//importing cookie parser to generate unique cookie for each logged in user

const staticRouter = require("./routes/staticRouter");
const urlRoute = require("./routes/url");//importing router and entire data from url.js(routes) and storing in "urlRoute" variable.
const userRoute = require("./routes/user");

connectToMongoDB("mongodb://localhost:27017/short-url")//using function (connectToMongoDB) from connect.js for mongoose connection with mongoDB
.then(() => console.log("Mongodb connected"));

//engine for server side rendering
app.set("view engine", "ejs")//ejs are simple html files.
app.set("views", path.resolve("./views"));//all the ejs files are placed inside this path

//middleware
app.use(express.urlencoded( {extended: false })); //middleware to convert form input into express.json.
app.use(express.json());//middleware to convert postman input into express.json for working in nodejs.
app.use(cookieParser());//middleware to check whether the user has login cookie or not if first time signup then will be rejected.

app.use("/url",restrictToLoggedinUserOnly, urlRoute);//middleware to redirect if any link start's with /url and presses "/" after "/url" to "urlRoute" i.e url.js(routes) which contains the route
//restrictToLoggedinUserOnly - denotes that if u want to use url service than u should be logged in.
app.use("/user", userRoute);//middleware to redirect if any link start's with /user and presses "/" after "/user" to "userRoute" i.e user.js(routes) which contains the route
app.use("/", staticRouter);//middleware to redirect if any link start's with "/" to staticRouter.

//get request for visit history and analytics
app.get("/url/:shortId", async (req, res) => {          //when get request with short url is sent to db the short id is searched in db and the visit history key/array is updated with analytics.
    const shortId = req.params.shortId;
    const entry = await URLN.findOneAndUpdate(
    {
        shortId
    },
    {
        $push: {
        visitHistory: {
            timestamp: Date.now(),
                    }
                }
    }
    );
    res.redirect(entry.redirectURL);  //now the shortened url redirects it to the original large url using .redirect() fn and (refers the redirect url from object)
});

app.listen(PORT, () => console.log(`Server started at port ${PORT}`));