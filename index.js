const path = require('path');
const express = require('express');
const userRouter = require("./routes/user");
const connectDB = require("./mongodb.js");
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const blogRouter = require("./routes/blog");
const { checkForAuthenticationCookie } = require("./middlewares/authentication");
connectDB();

const app = express()
app.use(cookieParser());

app.use( checkForAuthenticationCookie("token"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const PORT = 3001; 

app.set("view engine", 'ejs' )
app.set( "views", path.resolve("./views"))

 
app.get("/", (req, res) => {
    res.render("home" ,{user: req.user});
}) 

app.use('/user', userRouter);
app.use('/blog', blogRouter);



app.listen(PORT , ()=> 
    console.log(`Server Started at PORT: ${PORT}`)
)

