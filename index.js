// =============
// Set up
// =============
const express = require('express');
const app = express();
const port = 3000;

// put the css, js, img folder into reach
app.use(express.static("public"));


// =============
// Routes
// =============

app.get("/", function (req, res) {
    res.render("index.html");
});

app.post("/", function (req, res) {
    res.redirect("/");
});

app.listen(port, function () {
    console.log(`Running at http://localhost:${port}`);
});