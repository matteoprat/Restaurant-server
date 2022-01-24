'use strict';
require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const apiRoutes = require('./routes/api.js');
const runner = require('./test-runner');

app.use(cors());
app.use(express.json());

app.route('/')
    .get(function (req, res) {
        res.send("I will send a file");
    });

// ROUTING FOR API
apiRoutes(app);

const listener = app.listen(5000, () => {
    console.log('Your app is listening on port ' + listener.address().port);
    if(process.env.NODE_ENV==='test') {
      console.log('Running Tests...');
      setTimeout(function () {
        try {
          runner.run();
        } catch(e) {
          console.log('Tests are not valid:');
          console.error(e);
        }
      }, 1500);
    }
  });

  module.exports = app; //for testing