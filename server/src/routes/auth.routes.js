const express=require('express');
const { register,login } = require("../controllers/auth.controller");
const router=express.Router();
const {verifyUser} = require("../middleware/auth.middleware");

router.post("/register",register);
router.post("/login",login);
router.get("/profile",verifyUser,(req,res)=>{
    res.json({
        success: true,
        user:req.user
    });
});

module.exports=router;