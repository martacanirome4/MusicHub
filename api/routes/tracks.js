require('dotenv').config();
const express = require('express');
const router = express.Router();
const dbo = require('../db/conn');
const ObjectId = require('mongodb').ObjectId;
const MAX_RESULTS = parseInt(process.env.MAX_RESULTS);


router.get('/', async (req, res) => {
  let limit = MAX_RESULTS;
  if (req.query.limit){
    limit =  Math.min(parseInt(req.query.limit), MAX_RESULTS);
  }
  let next = req.query.next;
  let query = {}
  if (next){
    query = {_id: {$lt: new ObjectId}}
  }
  const options = {
    projection: {_id: 0}
  }
  const dbConnect = dbo.getDb();
  let results = await dbConnect
    .collection('music')
    .find(query, options)
    .sort({_id: -1})
    .limit(limit)
    .toArray()
    .catch(err => res.status(400).send('Error al buscar las canciones'));
  next = results.length == limit ? results[results.length - 1]._id : null;
  res.json({results, next}).status(200);
});

router.get('/:id', async (req, res) => {
  const dbConnect = dbo.getDb();
  let query = {track_uri: {$eq: decodeURIComponent(req.params.id)}};
  let projection = {_id: 0} 
  let result = await dbConnect
    .collection('music')
    .find(query)
    .project(projection)
    .toArray();
  if (!result){
    res.send("Not found").status(404);
  } else {
    res.status(200).send(result);
  }
});

router.post('/', async (req, res) => {
  const dbConnect = dbo.getDb();
  let result = await dbConnect
    .collection('music')
    .insertOne(req.body);
  res.status(201).send(result);
});

router.put('/:id', async (req, res) => {
  const query = {track_uri: {$eq: (decodeURIComponent(req.params.id))}};
  const update = {$set:{
    track_name: req.body.track_name,
  }};
  const dbConnect = dbo.getDb();
  let result = await dbConnect
    .collection('music')
    .updateOne(query, update);
  res.status(200).send(result);
});

router.delete('/:id', async (req, res) => {
  const query = {track_uri: {$eq: decodeURIComponent(req.params.id)}};
  const dbConnect = dbo.getDb();
  let result = await dbConnect
    .collection('music')
    .deleteOne(query);
  res.status(200).send(result);
});

module.exports = router;