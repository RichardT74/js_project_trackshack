const express = require ('express');
const app = express();
const parser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const createRouter = require('./helpers/create_router.js');
const fetch = require('node-fetch');
require('dotenv').config();

app.use(cors());
app.use(parser.json());

MongoClient.connect('mongodb://localhost:27017')
  .then((client) => {
    const db = client.db('trackshack');
    const foodsCollection = db.collection('foods');
    const foodsRouter = createRouter(foodsCollection);
    app.use('/', foodsRouter);
  })
  .catch(console.error);
//fetch
  app.post('/search', (req, res) => {
    const query = req.body;
    fetch("https://trackapi.nutritionix.com/v2/natural/nutrients", {
      method: 'POST',
      body: JSON.stringify(query),
      headers: {
        "Content-Type": "application/json",
        "x-app-id" : process.env.API_ID,
        "x-app-key" : process.env.API_KEY
      }
    })
    .then(res => res.json())//original response into json
    .then(data => {//return, still as json, and return it to the frontend
      res.json(data);
    })
    .catch((err) => {
      console.error(err);
      res.status(500);
      res.json({
        status: 500,
        error: err
      });
    });
  })

app.listen(3000, function () {
  console.log(`Listening on port ${ this.address().port }`);
});
