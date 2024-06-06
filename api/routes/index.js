// file: api/routes/index.js
require('dotenv').config();
const express = require('express');
const dbo = require('../db/conn');
const ObjectId = require('mongodb').ObjectId;
const router = express.Router();
const MAX_RESULTS = parseInt(process.env.MAX_RESULTS);

router.get('/', async (req, res) => {
  let limit = MAX_RESULTS;
  if (req.query.limit){
    limit = Math.min(parseInt(req.query.limit), MAX_RESULTS);
  }
  let next = req.query.next;
  let query = {}
  if (next){
    query = {_id: {$lt: new ObjectId(next)}}
  }
  const dbConnect = dbo.getDb();
  let results = await dbConnect
    .collection('music')
    .find(query)
    .sort({_id: -1})
    .limit(limit)
    .toArray()
    .catch(err => res.status(400).send('Error al buscar music'));
  next = results.length == limit ? results[results.length - 1]._id : null;
  res.json({results, next}).status(200);
});

// Route to render weather page
router.get('/api/v1/weather', (req, res) => {
  res.render('weather');
});


module.exports = router;

