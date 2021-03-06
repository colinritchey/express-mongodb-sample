const express = require('express');
const app = express();
const bodyParser= require('body-parser');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();

app.set('view engine', 'ejs');

let db;
let user = process.env.MONGODBUSER;
let password = process.env.MONGODBPASSWORD;

app.use(bodyParser.urlencoded({extended: true}));

MongoClient.connect(`mongodb://${user}:${password}@ds129796.mlab.com:29796/express-mongodb-sample`, (err, database) => {
  if (err) return console.log(err)
  db = database;

  app.listen(process.env.PORT || 3000, () => {
    console.log('listening on 3000')
  });

})

app.get('/', (req, res) => {
  db.collection('quotes').find().toArray((err, result) => {
    if (err) return console.log(err)
    res.render('index.ejs', {quotes: result})
  })
});

app.get('/quotes', (req, res) => {
  db.collection('quotes').find().toArray((err, result) => {
    if (err) return console.log(err)

    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({quotes: result}));
  })
});

app.post('/quotes', (req, res) => {
  db.collection('quotes').save(req.body, (err, result) => {
    if (err) return console.log(err)

    console.log('saved to database')
    res.redirect('/')
  })
})
