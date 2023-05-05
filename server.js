const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const http = require("http");
const dotenv = require("dotenv");

const { API_VERSION, PORT } = require("./config/general");
const ENV = require("./static");

const app = express();
const server = http.createServer(app);
const { connectDatabase } = require("./config/db");

dotenv.config();
connectDatabase();

//Init Middlewares
app.use(logger("dev"));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: false }));
app.use(express.static(ENV.MEDIA.DIRECTORY));
app.use("/public", express.static("public"));

app.use(cors());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With, Authorization, Content-Type"
  );
  res.setHeader("Access-Control-Allow-Credentials", "true");
  next();
});

app.get("/", (req, res) => {
  res.send(`Welcome to Halalz Backend ${API_VERSION}`);
});
//
/**
 * Admin API Routes
 */
app.use(`/admin-api/${API_VERSION}/admin`, require("./routes/admin-api/admin"));

// app.use(`/admin-api/${API_VERSION}/brand`, require('./routes/admin-api/brand'));*
// app.use(`/admin-api/${API_VERSION}/report`, require('./routes/admin-api/report'));
// app.use(`/admin-api/${API_VERSION}/report-reason`, require('./routes/admin-api/report-reason'));
/////////////////////////////////////////////////
// End Admin API Routes

/**
 * Restaurant API Routes
 */

/////////////////////////////////////////////////
// End Restaurant API Routes

/**
 * Driver API Routes
 */

/////////////////////////////////////////////////
// End Driver API Routes

/**
 * Client API Routes
 */

/////////////////////////////////////////////////
// End Client API Routes

server.listen(PORT, () => console.log(`Server started on port ${PORT}`));
