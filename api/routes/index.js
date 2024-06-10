// file: api/routes/index.js
require('dotenv').config();
const express = require('express');
const dbo = require('../db/conn');
const ObjectId = require('mongodb').ObjectId;
const router = express.Router();
const MAX_RESULTS = parseInt(process.env.MAX_RESULTS);

router.get('/', async (req, res) => {
  res.render('index');
});


module.exports = router;

