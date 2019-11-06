var express = require('express');
var app = express();
//setup mongodb
var mongo = require('mongodb');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
var options =  { useNewUrlParser: true , useUnifiedTopology: true } ;

//set the view engine to ejs
app.set('view engine','ejs');

app.get("/", function(req, res){
    res.render('pages/index');
});
app.get("/soccerview/:id", function(req, res){
  var socc = req.params.id;  
    // Get the calss detail from mongodb
    MongoClient.connect(url, options,function(err, db) {
        if (err) throw err;
        var dbo = db.db("SoccerTeams");
        var query = {id : socc};
                  dbo.collection("soccer").findOne(query,function(err, result) {
          if (err) throw err;
          console.log(result);res.render('pages/products',{soc:result});
          db.close();
        });
      });
    
});
app.get("/soccer", function(req, res){
  //Get data from MongoDB
  
  MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      var dbo = db.db("SoccerTeams");
      var query = {};
      dbo.collection("soccer").find(query).toArray(function(err, result) {
        if (err) throw err;
        console.log(result);
        res.render('pages/productschouse',{soc :result});
        db.close();
      });
  });
});
app.get("/socceradd", function(req, res){
  res.render('pages/add');
});

app.post('/addLeagueadd', function (req, res) {
  var ids = req.body.id;
  var Leagues= req.body.League;
  var Seasons = req.body.Season;

  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("SoccerTeams");
    var sdsj = {  id : ids,
      League: Leagues,
      Season: Seasons,
      Team:[]
     };
    dbo.collection("soccer").insertOne(sdsj, function(err, result) {
      if (err) throw err;
      console.log("1 document inserted");
      db.close();
      res.redirect("/soccer");
    });
  });

});


app.get("/soccerdetail/:id,:sox", function (req, res) {
  var socc = req.params.id;  
  var sssa = req.params.sox; 
  MongoClient.connect(url, options,function(err, db) {
    if (err) throw err;
    var dbo = db.db("SoccerTeams");
    var query = {id : sssa};
              dbo.collection("soccer").findOne(query,function(err, result) {
      if (err) throw err;
      console.log(result);res.render('pages/productsdetail',{soc:result,key:socc-1});
      db.close();
    });
  });

});




app.listen(8080);
console.log('Express start at http://localhost:8080');
