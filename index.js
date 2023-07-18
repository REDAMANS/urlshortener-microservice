require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const connectDb = require('./config/connectDb');
const Url = require('./model/Url');
const isValidUrl = require('./validate');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

connectDb();

app.use(cors());

app.use(express.urlencoded({ extended: false }));

app.use('/public', express.static(`${process.cwd()}/public`));

app.use(express.json());

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/shorturl', (req, res, next) => {
  res.status(400).send('Not found');
})

app.post('/api/shorturl', async function(req, res) {
  let url = req.body.url;
  if(isValidUrl(url) === false) {
    res.json({ error: 'invalid url' })
  }else {
    if (url[url.length - 1] === '/') {
      let temp = url.split('');
      temp.pop();
      url = temp.join('');
    }
    try {
      const foundUrl = await Url.findOne({ original_url: url}).exec();
      if(foundUrl) {
        res.json({ original_url: foundUrl.original_url, short_url: foundUrl.short_url });
      }else {
        const urlArray = await Url.find();
        urlArray.length && urlArray.sort((a, b) => a.short_url < b.short_url);
        const nextShortUrl = urlArray.length ? urlArray.pop().short_url + 1 : 1;
        await Url.create({
          original_url: url,
          short_url: nextShortUrl
        });
        res.json({ original_url: url, short_url: nextShortUrl });
      }
    }catch(err) {
      console.error(err);
    }
  }
});

app.get('/api/shorturl/:short_url', async (req, res, next) => {
  const { short_url } = req.params;
  try {
    const foundUrl = await Url.findOne({ short_url }).exec();
    if (!foundUrl) {
      res.json({ error: "The requested url doesn't exist, please post it before using it" });
    } else {
      res.redirect(foundUrl.original_url);
    }
  } catch (err) {
    console.error(err);
  }
})

mongoose.connection.once('open', () => {
  console.log("Connected to MongoDB")
  app.listen(port, function() {
    console.log(`Listening on port ${port}`);
  });
})