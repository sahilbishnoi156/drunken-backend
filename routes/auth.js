const express = require("express");
const Admin = require("../models/admin");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
var authenticateAdmin = require("../middleware/fetcher");

const JWT_SECRET = "#%&EJN#%W#@J&$ARHR$HEFR@$@&GJDN%$&#I!NEB$&";

// ROUTE 1: Create a Admin using: POST "/api/auth/createAdmin". No login required
router.post(
  "/createAdmin",
  [
    body("username", "Enter a valid name").isLength({ min: 3 }),
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password must be at least 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    let success = false;

    // If there are errors, return Bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array(), success });
    }

    try {
      // Check whether the Admin with this email exists already
      let admin = await Admin.findOne({ email: req.body.email });
      if (admin) {
        success = false;
        return res.status(400).json({ error: "Admin already exists", success });
      }

      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);

      // Create a new Admin
      admin = await Admin.create({
        username: req.body.username,
        password: secPass,
        email: req.body.email,
      });
      const data = {
        admin: {
          id: admin.id,
        },
      };

      // Creating authentication token
      const authToken = jwt.sign(data, JWT_SECRET);

      success = true;
      res.json({
        success,
        authToken,
        username: req.body.username,
        email: req.body.email,
      });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

// ROUTE 2: Authenticate a Admin using: POST "/api/auth/login". No login required
router.post(
  "/login",
  [
    body("username", "Enter a valid username").exists(),
    body("password", "Password cannot be blank").exists(),
  ],
  async (req, res) => {
    let success = false;
    // If there are errors, return Bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      success = false;
      return res.status(400).json({ errors: errors.array(), success });
    }

    const { username, password } = req.body;
    try {
      let admin = await Admin.findOne({ username });
      if (!admin) {
        success = false;
        return res.status(404).json({
          success,
          error: "Invalid Username",
        });
      }

      // comparing database password and password that is coming
      const passwordMatched = await bcrypt.compare(password, admin.password);
      if (!passwordMatched) {
        success = false;
        return res.status(400).json({
          success,
          error: "Invalid Password",
        });
      }

      const data = {
        admin: {
          id: admin.id,
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET);
      success = true;
      res.json({
        success,
        authToken,
        admin,
      });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

// ROUTE 3: Get logged in Admin Details using: POST "/api/auth/getAdmin". Login required
router.post("/getAdminDetails", authenticateAdmin, async (req, res) => {
  try {
    const adminId = req.admin.id;
    const admin = await Admin.findById(adminId);
    if(admin){
      res.send(admin);
    }else{
      res.status(404).send("Admin not found");
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});
module.exports = router;
