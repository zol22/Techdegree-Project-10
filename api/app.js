/******************************************
Treehouse FSJS Techdegree:
project 10 - Full Stack App using React and a REST API
by Melissa Preece
I am aiming for the grade Exceeds Expectations but will accept Meets Expectations as well.

// Extra Credit:
- See files coursesRoutes.js (#3), userRoutes.js (#2), async-handler.js (#2), user.js (#1), auth-user.js (#3)
******************************************/

'use strict';

// load modules
const express = require('express');
const morgan = require('morgan');
const { sequelize } = require('./models');
const cors = require('cors'); // load CORS module to connect to REACT client

// import route modules
const userRoutes = require('./routes/userRoutes');
const coursesRoutes = require('./routes/coursesRoutes');

// variable to enable global error logging
const enableGlobalErrorLogging = process.env.ENABLE_GLOBAL_ERROR_LOGGING === 'true';

// create the Express app
const app = express();

// setup CORS to connect to REACT client
app.use(cors());

// setup morgan which gives us http request logging
app.use(morgan('dev'));

// json parser
app.use(express.json());

// setup a friendly greeting for the root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the REST API project!',
  });
});

// add routes
app.use('/api', userRoutes, coursesRoutes);

// send 404 if no other route matched
app.use((req, res) => {
  res.status(404).json({
    message: 'Route Not Found',
  });
});

// setup a global error handler
app.use((err, req, res, next) => {
  if (enableGlobalErrorLogging) {
    console.error(`Global error handler: ${JSON.stringify(err.stack)}`);
  }

  res.status(err.status || 500).json({
    message: err.message,
    error: {},
  });
});

// set our port
app.set('port', process.env.PORT || 5000);

// test database connection
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch(error) {
    console.error('Unable to connect to the database:', error);
  }
})();

// start listening on our port
const server = app.listen(app.get('port'), () => {
  console.log(`Express server is listening on port ${server.address().port}`);
});
