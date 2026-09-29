const express=require("express");
const { createEvent,createServerEvent } = require("../controllers/event.controller");


const router=express.Router();

router.post("/", createEvent);
router.post("/server", createServerEvent);

module.exports=router;