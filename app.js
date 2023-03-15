
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

        let $ = cheerio.load(site.data);

        const getExtension = function (url) {
            return url.split(/[#?]/)[0].split('.').pop().trim().toLowerCase();
        }

        let links = $('link').filter(function () { return getExtension($(this).attr('href')) == 'css' }).map(function () {
            return $(this).attr('href');
        }).get();

        let scripts = $('script').map(function () {
            return $(this).attr('src');
        }).get();

        res.status(200).json({ success: true, data: { links, scripts } });
    } catch (e) {
        console.log(e)
        res.status(500).json({ success: false });
    }
});


app.use(function (req, res, next) {
    res.status(404).send("404 page");
});

module.exports = app;
