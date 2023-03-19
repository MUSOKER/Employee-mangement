const express = require("express");
const projectController = require("../controllers/projectController");
const router = express.Router();
const authController = require("../controllers/authController");

router.use(authController.protect);
router.use(authController.restrictTo(["manager"]));
router.route("/project").post(projectController.createProject);
router.route("/assign/:id").patch(projectController.assignProject);
router.route("/remove/:id").delete(projectController.deleteProject);
router.route("/get/:id").get(projectController.getProject);
router.route("/getAll").get(projectController.getAllProjects);

module.exports = router;
