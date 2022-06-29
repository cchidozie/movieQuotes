const express = require('express'),
  app = express(),
  MongoClient = require('mongodb').MongoClient,
  PORT = 2022,
  cors = require('cors')
require('dotenv').config()

let db,
  dbConnectionStr = process.env.DB_STRING,
  dbName = 'movieQuotes'

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }).then(
  (client) => {
    console.log(`Connected to ${dbName} Database`)
    db = client.db(dbName)
  }
)

//MIDDLEWARES
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())

//GET /movieQuotes
app.get('/', (req, res) => {
  db.collection('savedQuotes')
    .find()
    .toArray()
    .then((data) => res.render('index.ejs', { info: data }))
})

//POST
app.post('/addQuotes', (req, res) => {
  db.collection('savedQuotes')
    .insertOne({
      mCharacter: req.body.mCharacter,
      mQuote: req.body.mQuote,
    })
    .then((result) => {
      console.log('Quote added successfully')
      res.redirect('/')
    })
    .catch((err) => console.error(err))
})

app.listen(PORT || PORT, () => {
  console.log('server is listening on port ' + PORT)
})
