const express = require("express");
const app = express();
const port = 8000;
const expressLayouts = require("express-ejs-layouts");
const db = require("./config/mongoose");
const cookieParser = require("cookie-parser");

// used for session cookie
const session = require("express-session");
const passport = require("passport");
const passportLocal = require("./config/passport-local-strategy");
const MongoStore = require("connect-mongo");

//node sass
// const sass = require("sass");

// app.use(
//   sass({
//     src: "/assets/scss",
//     dest,
//   })
// );

app.use(express.static("./assets"));
app.use(express.urlencoded());
app.use(cookieParser());

app.use(expressLayouts);

//extract style and scripts from sub pages into the layout
app.set("layout extractStyles", true);
app.set("layout extractScripts", true);

//setting up view engine
app.set("view engine", "ejs");
app.set("views", "./views");

//mongo store is used to store session cookie in the db
app.use(
  session({
    name: "codeial",
    // TODO change secret before deployment in production mode
    secret: "blahblah",
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 1000 * 60 * 100,
    },
    store: MongoStore.create(
      {
        mongoUrl:
          // "mongodb+srv://pyogi37:9928890454@cluster0.az667sk.mongodb.net/test",
          "mongodb://0.0.0.0:27017/codeial_development",
        autoRemove: "disabled",
      },
      function (err) {
        console.log(err || "connect-mongodb setup ok");
      }
    ),
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);

// use express router
app.use("/", require("./routes"));

app.listen(port, function (err) {
  if (err) {
    console.log(`Error in running the server: ${err}`);
  }
  console.log(`Server running on port ${port}`);
});
