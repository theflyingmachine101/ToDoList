const express=require("express");
const bodyParser=require("body-parser");
const date=require(__dirname+"/date.js");
var request=require("request");
const app=express();
const ejs=require("ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine', 'ejs');
app.listen("3000",function()
{
  console.log(" Server started on port 3000");
});
var items=[],workItems=[];
app.get("/",function(req,res)
{

  res.render("list",{Title:date.getDate(),item:items,place:""});
});
app.get("/work",function(req,res)
{
  res.render("list",{Title:"Work",item:workItems,place:"work"});
});
app.post("/",function(req,res)
{
  if(req.body.button=="Work"){
    workItems.push(req.body.task);
    res.redirect("/work");
  }

  items.push(req.body.task);
  res.redirect("/");
});
app.post("/work",function(req,res)
{
  workItems.push(req.body.task);
  res.redirect("/work");
});
