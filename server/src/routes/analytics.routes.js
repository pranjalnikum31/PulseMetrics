const express = require('express');
const { verifyUser } = require("../middleware/auth.middleware");
const authorize = require("../middleware/role.middleware");
const { getOverview,getTopEvents,getRecentEvents,getEventsByDay } = require("../controllers/analytics.controller");


const router = express.Router();

router.get('/overview', verifyUser,authorize("OWNER", "ADMIN"), getOverview);
router.get('/top-events', verifyUser,authorize("OWNER", "ADMIN"), getTopEvents);
router.get('/recent-events', verifyUser,authorize("OWNER", "ADMIN"), getRecentEvents);
router.get("/events-by-day",verifyUser,authorize("OWNER", "ADMIN"),getEventsByDay);


module.exports = router;
