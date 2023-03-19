const express = require("express");
const router = express.Router();
const employeeController = require("../controllers/employeeController");
const authController = require("../controllers/authController");

router.route("/login").post(authController.login); //Employee can log in to see incase they are given a project
router.route("/logout").post(authController.logout);
router.use(authController.protect);
router.route("/get/:id").get(employeeController.getEmployee);
router.use(authController.restrictTo(["manager"]));
router.route("/register").post(employeeController.registerEmployee);
router.route("/delete/:id").delete(employeeController.deleteEmployee);
router.route("/getAll").get(employeeController.getAllEmployess);

module.exports = router;
