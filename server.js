var express = require('express');
var bodyparser = require('body-parser');
var app = express();
//setup mongodb
var mongo = require('mongodb');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
var options =  { useNewUrlParser: true , useUnifiedTopology: true } ;
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
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


app.post('/editdeatilteam', function (req, res) {
  var socc = req.body.socid;  
  var ids = req.body.ID;
  var name= req.body.Name;
  var loc = req.body.Location;
  var sta = req.body.Stadium;
  
   MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("SoccerTeams");
    var query = {id : socc }
    var myobj = {  
      Team : [{ id : ids,
        Name :name,
        Location:loc,
        Stadium :sta
      }]
     };
     dbo.collection("soccer").updateOne(query , myobj, function (err, result) {
      if (err) throw err;
      console.log("1 document updated");
      db.close();
      res.redirect("/soccerview/".socc);
    });
  });

});


app.get("/adddetail/:id", function(req, res){
  var socc = req.params.id;  
    // Get the calss detail from mongodb
    MongoClient.connect(url, options,function(err, db) {
        if (err) throw err;
        var dbo = db.db("SoccerTeams");
        var query = {id : socc};
                  dbo.collection("soccer").findOne(query,function(err, result) {
          if (err) throw err;
          console.log(result);res.render('pages/adddetail',{soc:result});
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

app.get("/socceredit/:id", function(req, res){
  var socc = req.params.id;  
  MongoClient.connect(url, options,function(err, db) {
    if (err) throw err;
    var dbo = db.db("SoccerTeams");
    var query = {id : socc};
              dbo.collection("soccer").findOne(query,function(err, result) {
      if (err) throw err;
      console.log(result);res.render('pages/edit',{soc:result});
      db.close();
    });
  });
});

app.get("/soccerdelete/:ID", function (req, res) {
  var ids = req.params.ID;
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("SoccerTeams");
    var myquery = { id:ids};
    dbo.collection("soccer").deleteOne(myquery, function(err, obj) {
      if (err) throw err;
      console.log("1 document deleted");
      db.close();
      res.redirect("/soccer");
    });
  });
});


app.post('/editLeague', function (req, res) {
  var ids = req.body.ID;
  var leagues= req.body.League;
  var seasons = req.body.Season;
  MongoClient.connect(url, options, function (err, db) {
    if (err) throw err;
    var dbo = db.db("SoccerTeams");
    var myquery = { id : ids  };
    var newvalues = {
      $set: {
        id : ids,
        League: leagues,
        Season: seasons,
        Team : []
      }
    };
    dbo.collection("soccer").updateOne(myquery, newvalues, function (err, result) {
      if (err) throw err;
      console.log("1 document updated");
      db.close();
      res.redirect("/soccer");
    });
  });
});

app.get("/socceradd", function(req, res){
  res.render('pages/add');
});


app.post('/addleague', function (req, res) {
  var ids = req.body.ID;
  var leagues= req.body.League;
  var seasons = req.body.Season;
   MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("SoccerTeams");
    var myobj = {  
        id : ids,
      League: leagues,
      Season: seasons,
      Team : []
     };
    dbo.collection("soccer").insertOne(myobj, function(err, result) {
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
