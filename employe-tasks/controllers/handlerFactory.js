const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
exports.creatOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);
    res.status(200).json({
      status: "success",
      data: doc,
    });
  });

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) return next(new AppError("no employee found with that id", 404));
    res.status(204).json({ status: "success", data: null });
  });
exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.find();
    res.status(200).json({
      status: "success",
      doc,
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(
      req.params.id,

      req.body,
      { new: true }
    );

    if (!doc) {
      return next(new AppError("No employee found with that id", 404));
    }
    res.status(200).json({
      status: "success",
      doc,
    });
  });
exports.getOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findById(req.params.id);
    if (!doc) return next(new AppError("No eemployee found with that id", 404));
    res.status(200).json({
      status: "success",
      doc,
    });
  });
