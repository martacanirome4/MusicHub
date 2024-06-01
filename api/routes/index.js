require('dotenv').config();
var express = require('express');
const dbo = require('../db/conn');
const ObjectId = require('mongodb').ObjectId;
var router = express.Router();
const MAX_RESULTS = parseInt(process.env.MAX_RESULTS);

/* GET home page. */
/*router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});*/

router.get('/', async (req, res) => {
  let limit = MAX_RESULTS;
  if (req.query.limit){
    limit =  Math.min(parseInt(req.query.limit), MAX_RESULTS);
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


module.exports = router;
