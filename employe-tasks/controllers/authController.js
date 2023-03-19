const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const catchAsync = require("../utils/catchAsync");
const Employee = require("../model/employee");
const AppError = require("../utils/appError");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  //This enables user log in by sending the JWT
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;
  res.cookie("jwt", token, cookieOptions);

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};
//Employee login
exports.login = catchAsync(async (req, res, next) => {
  const { email, name } = req.body;
  if (!email || !name)
    return next(new AppError("Please provide your email and password"));
  const user = await Employee.findOne({ email: email });

  if (!user) {
    return next(new AppError("Incorrect email or password", 401));
  }

  createSendToken(user, 201, res); // logs in the user
  next();
});
exports.logout = (req, res) => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({
    status: "success",
  });
};

exports.restrictTo = (roles) => {
  return (req, res, next) => {
    //req.user is the current user
    console.log(`current user is ${req.user}`);
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }
    next();
  };
};

exports.protect = catchAsync(async (req, res, next) => {
  // 1.getting the token
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  //token sent through cookie
  else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  if (!token) {
    next(
      new AppError("You are not logged in! Please log in to get access", 401)
    );
  }
  //2. Verification of the token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  console.log(decoded);
  // 3. check if the user still exist
  const currentUser = await Employee.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError("The user belonging to this token does nolonger exist", 401)
    );
  }

  //GRANT ACCESS TO PROTECTED ROUTES
  req.user = currentUser;
  res.locals.user = currentUser; //getting access to the user in the pug template
  next();
});
