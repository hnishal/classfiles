require('dotenv').config();
const express = require('express');
const cors = require("cors");
const { default: mongoose } = require("mongoose");
const app = express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
const httpServer = require('http').createServer(app);
let PORT;
process.env.STATUS === 'production'
  ? (PORT = process.env.PROD_PORT)
  : (PORT = process.env.DEV_PORT);

const uri = process.env.DB_URL;

mongoose
  .connect(process.env.DB_URL)
  .then(() => {
    console.log("Successfully connected to the database");
  })
  .catch((err) => {
    console.log("Could not connect to the database. Exiting now...", err);
    process.exit();
  });

httpServer.listen(PORT, () => {
  console.log(`Server in ${process.env.STATUS} mode, listening on *:${PORT}`);
});
require('./app/routes/user.routes')(app);
require('./app/routes/roles.routes')(app);
require('./app/routes/files.routes')(app);
