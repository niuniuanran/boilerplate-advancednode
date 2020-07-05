"use strict";

const express = require("express");
const fccTesting = require("./freeCodeCamp/fcctesting.js");
const session = require("express-session");
const passport = require("passport");
const mongo = require("mongodb").MongoClient;
require('dotenv').config();

const routes = require('./routes.js');
const auth = require('./auth');
const app = express();

fccTesting(app); //For FCC testing purposes
app.use("/public", express.static(process.cwd() + "/public"));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.set("view engine", "pug");
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: true,
        saveUninitialized: true
    })
);
app.use(passport.initialize());
app.use(passport.session());

app.route("/").get((req, res) => {
    res.render(`./pug/index`, {
        title: "Homepage Home Page Home page",
        message: "Please login",
        showLogin: true,
        showRegistration: true
    });
});

mongo.connect(process.env.DATABASE, (err, client) => {
    if (err) {
        console.log("Database error: " + err);
    } else {
        const db = client.db("auth");
        auth(app,db)
        routes(app, db);

        app.listen(process.env.PORT || 3000, () => {
            console.log("Listening on port " + process.env.PORT);
        });

        //serialization and app.listen
    }
});
