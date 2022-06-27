require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { default: mongoose } = require("mongoose");
const formidable = require("express-formidable");
const bodyParser = require("body-parser");
var multer = require("multer");
var upload = multer();
const app = express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(formidable());

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

// parse requests of content-type - application/json
app.use(bodyParser.json());
// app.use(upload.array());
const httpServer = require("http").createServer(app);
let PORT;
process.env.STATUS === "production"
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
require("./app/routes/user.routes")(app);
require("./app/routes/roles.routes")(app);
require("./app/routes/files.routes")(app);
require("./app/routes/class.routes")(app);
require("./app/routes/enrollment.routes")(app);
