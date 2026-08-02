const express = require('express');
const { verifyUser } = require("../middleware/auth.middleware");
const authorize = require("../middleware/role.middleware");
const { getOverview,getTopEvents } = require("../controllers/analytics.controller");


const router = express.Router();

router.get('/overview', verifyUser,authorize("OWNER", "ADMIN"), getOverview);
router.get('/top-events', verifyUser,authorize("OWNER", "ADMIN"), getTopEvents);


module.exports = router;
