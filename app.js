
const express = require("express");
const app = express();
const http = require("http").Server(app);
const path = require("path");
const cheerio = require('cheerio');
const axios = require('axios');


const port = 3001;
http.listen(port, function () {
    console.log("listening on *:" + port);
});

app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: false }));

app.use(
    "/",
    express.static(path.join(__dirname, "public/"), {
        index: "index.html",
    })
)

app.get("/api/includes", async (req, res) => {
    try {
        let site = await axios.get(req.query.url);

        var $ = cheerio.load(site.data);

        var links = $('link').map(function (i) {
            return $(this).attr('href');
        }).get();
        var scripts = $('script').map(function (i) {
            return $(this).attr('src');
        }).get();

        res.status(200).json({ success: true, data: { links, scripts } });
    } catch (e) {
        res.status(500).json({ success: false });
    }
});


app.use(function (req, res, next) {
    res.status(404).send("404 page");
});

module.exports = app;
