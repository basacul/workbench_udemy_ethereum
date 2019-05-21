// =============
// Set up
// =============
const express = require('express');
const bodyParser = require('body-parser');
const port = 3000;

const app = express();
// allow to get the body of the requests
app.use(bodyParser.urlencoded({ extended: true }));
// put the css, js, img folder into reach
app.use(express.static("public"));
app.set("view engine", "ejs");

// =============
// Routes
// =============

app.get("/", function (req, res) {
    res.render("index");
});

app.post("/", function (req, res) {
    res.redirect("/");
});

app.listen(port, function () {
    console.log(`Running at http://localhost:${port}`);
});