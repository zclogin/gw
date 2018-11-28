const http=require("http");
const express=require("express");
var app=express();
app.listen(3000);
app.use(bodyParser.urlencoded({
	extended:false
}));