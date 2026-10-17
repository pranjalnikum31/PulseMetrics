const express = require("express");
const { register, login } = require("../controllers/auth.controller");
const router = express.Router();
const { verifyUser } = require("../middleware/auth.middleware");
const authorize = require("../middleware/role.middleware");
const prisma = require("../config/prisma");

router.post("/register", register);
router.post("/login", login);

router.get("/profile", verifyUser, async (req, res) => {
  try {
    const company = await prisma.company.findUnique({
      where: {
        id: req.user.companyId,
      },
      select: {
        id: true,
        name: true,
        plan: true,
      },
    });

    return res.json({
      success: true,
      user: req.user,
      company,
    });
  } catch (error) {
    console.error("Profile fetch error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
    });
  }
});


router.get("/owner", verifyUser, authorize("OWNER"), (req, res) => {
  res.json({
    success: true,
    message: "Welcome Owner!",
    user: req.user,
  });
});

module.exports = router;
