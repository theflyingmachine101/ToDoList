//requirements
const express = require("express");
const bodyParser = require("body-parser");
var request = require("request");
const app = express();
const ejs = require("ejs");
const mongoose = require("mongoose");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.set('view engine', 'ejs');

//connection
mongoose.connect("mongodb://localhost/ToDoListDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify:false
});

//General Schema
var generalSchema = new mongoose.Schema({
  task: {
    type: String,
    required: [true, "Enter a task"]
  }
});
var generalModel = mongoose.model("GTask", generalSchema);


//specialized Schema
var specialSchema = new mongoose.Schema({
  name: String,
  task: [generalSchema]
});
var specialModel = mongoose.model("STask", specialSchema);

//Listening Port
app.listen("3000", function() {
  console.log(" Server started on port 3000");
});



//Get requests
app.get("/", function(req, res) {
  generalModel.find({}, function(err, items) {
    res.render("list", {
      Title: "Today",
      item: items
    });
  });
});


app.get("/:type", function(req, res) {
  specialModel.findOne({name: req.params.type}, function(err, items) {
    if (!err) {
      if (!items) {
        var sm = new specialModel({name: req.params.type,task: []});
        sm.save();
        res.render("list", {Title: req.params.type,item:[]});
      }
      else{
      res.render("list", {Title: req.params.type,item: items.task});
    }
    }
  });

});

//Post requests  for adding item
app.post("/", function(req, res) {
  var task = new generalModel({
    task: req.body.task
  });
  task.save();
  if (req.body.button == "Today") {
    res.redirect("/");
  }
  else
  {
    specialModel.findOne({name: req.body.button}, function(error, item) {
      item.task.push(task);
      item.save();
      res.redirect("/"+req.body.button);
    });
  }
});

//Post requests  for deleting item
app.post("/delete", function(req, res) {
  if(req.body.title=="Today")
  {
    generalModel.deleteOne({
      _id: req.body.checkbox
    }, function(err, result) {
      res.redirect("/");
    });
  }
  else
  {

     specialModel.findOneAndUpdate({name:req.body.title},{$pull:{task:{_id:req.body.checkbox}}},function(error,item){
       res.redirect("/"+req.body.title);
     });
  }

});
