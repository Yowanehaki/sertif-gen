const express = require("express");
const adminAuth = require("../controllers/admin/adminAuthentication.js");

const adminRouter = express.Router();

adminRouter.post("/login", adminAuth);

module.exports = adminRouter;