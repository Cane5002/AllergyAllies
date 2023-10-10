const cors = require('cors');

const corsOptions = {
  origin: 'http://localhost:19006', 
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204
};

module.exports = cors(corsOptions);