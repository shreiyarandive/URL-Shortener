const express = require('express');
const mongoose = require('mongoose');
const ShortUrl = require('./models/shortUrl');
const app = express();

mongoose.connect('mongodb+srv://new-user:test123@cluster0.gfwfb.mongodb.net/UrlShortener?retryWrites=true&w=majority',
    { useNewUrlParser: true });
mongoose.Promise = global.Promise;

app.use(express.json());
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
        return res.status(200).json({});
    }
    next();
})

app.get('/getUrls', async (req, res, next) => {
    const url = await ShortUrl.find();

    if (url.length < 1) {
        res.status(401).json({
            error: "No Data"
        });
    }
    res.status(200).json(url);
})

app.get('/:shortUrl', async (req, res) => {

    console.log(req.params.shortUrl)
    const shortUrl = await ShortUrl.findOne({short: req.params.shortUrl});
    if(shortUrl == null){
        res.status(404).json({
            error: "No data"
        })
    }
    shortUrl.clicks++;
    shortUrl.save();
    res.status(200).json({
        fullUrl: shortUrl.full
    });
})
app.post('/shortUrls', async (req, res) => {

    const shortUrl = new ShortUrl({
        full: req.body.url
    })
    const result = await shortUrl.save();
    res.status(200).json({
        message: "Done"
    })

})
module.exports = app;