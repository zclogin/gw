const express=require("express");
var router=express.Router();
router.post("/login",function(req,res){
	res.send("登录成功");
});
module.exports=router;