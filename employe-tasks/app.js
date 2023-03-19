const path = require("path");
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");

const cookieParser = require("cookie-parser");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const { status, json } = require("express/lib/response");

const employeeRouter = require("./routes/employee");
const projectRouter = require("./routes/project");

const app = express();

//cors
app.use(
  cors({
    credentials: true,
  })
);

//defining the folder in which the views are located
app.set("views", path.join(__dirname, "views"));

//GLOBAL MIDDLEWARES
//Accessing statics files
app.use(express.static(path.join(__dirname, "public")));

//for reading JSON data
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "45mb" }));

//secure HTTP headers
app.use(helmet());

if ((process.env.NODE_ENV = "development")) {
  app.use(morgan("dev"));
}

app.use(cookieParser());
app.use(mongoSanitize());
app.use(xss());

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log(req.cookies);
  next();
});

//ROUTES
app.use("/api/v1/employee", employeeRouter);
app.use("/api/v1/project", projectRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find the ${req.originalUrl} on this server!`, 404));
});
app.use(globalErrorHandler);
module.exports = app;
