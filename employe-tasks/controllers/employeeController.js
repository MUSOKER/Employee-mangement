const catchAsync = require("../utils/catchAsync");
const Employee = require("../model/employee");
const AppError = require("../utils/appError");
const factory = require("./handlerFactory");

//Employee registration
exports.registerEmployee = factory.creatOne(Employee);

exports.deleteEmployee = factory.deleteOne(Employee);
exports.getEmployee = factory.getOne(Employee);
exports.getAllEmployess = factory.getAll(Employee);

exports.updateEmployee = factory.updateOne(Employee);
