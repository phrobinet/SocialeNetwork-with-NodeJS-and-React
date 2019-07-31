const express = require("express");
const {
    signup,
    signin,
    signout,
    forgotPassword,
    resetPassword
} = require("../controllers/auth");

// import password / reset / validator
const { userSignupValidator, passwordResetValidator } = require("../validator");
const { userById } = require("../controllers/user");

const router = express.Router();

router.post("/signup", userSignupValidator, signup);
router.post("/signin", signin);
router.get("/signout", signout);

router.put("/forgot-password", forgotPassword);
router.put("/reset-password", passwordResetValidator, resetPassword);

// toute route contenant :userId, notre application exécutera d'abord userByID()
router.param("userId", userById);

module.exports = router;