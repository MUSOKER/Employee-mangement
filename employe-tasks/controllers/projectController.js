const Project = require("../model/project");
const Employee = require("../model/employee");
const AppError = require("../utils/appError");
const factory = require("./handlerFactory");
const catchAsync = require("../utils/catchAsync");
// Assign employee to a project
//"/api/projects/:id/assign",
exports.assignProject = catchAsync(async (req, res) => {
  const projectId = req.params.id;
  const employeeId = req.body.assignedTo;

  const project = await Project.findByIdAndUpdate(
    projectId,
    { assignedTo: employeeId },
    { new: true }
  );

  if (!project) {
    return next(new AppError("No project found with that id", 404));
  }

  const employee = await Employee.findByIdAndUpdate(
    employeeId,
    { $push: { projects: project._id } },
    { new: true }
  );

  res.status(200).json({
    status: "success",
    project,
    employee,
  });
});

exports.createProject = factory.creatOne(Project);
exports.getAllProjects = factory.getAll(Project);
exports.deleteProject = factory.deleteOne(Project);
exports.getProject = factory.getOne(Project);

exports.updateProject = factory.updateOne(Project);
