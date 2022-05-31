//1 - npm init -y --> generate init file (List of Packages)
//2 - use express framework --> npm install express
const dotenv = require("dotenv");
dotenv.config();
let express = require("express");
const { MongoClient } = require("mongodb");
//variable can be made up but argument has to match package
let sanitizeHTML = require("sanitize-html");

let app = express();

//Create database
let db;
const client = new MongoClient(process.env.CONNECTIONSTRING);
//Make dynamic for heroku
let port = process.env.PORT;
if (port == null || port == "") {
  port = 5000;
}

//To make the public folder available
app.use(express.static("public"));

async function start() {
  await client.connect();
  //module.exports = client;
  db = client.db();
  app.listen(port);
}

start();
//Boiler-plate (express) to automatically access the asynchronous request. Json is a method here.
app.use(express.json());

//Boiler-plate (express) to automatically access the form data and added to the body that lives on the request
app.use(express.urlencoded({ extended: false }));

function passwordProtected(req, res, next) {
  //Test line
  //console.log("Custom function")
  res.set("WWW-Authenticate", 'Basic realm="Goals App"');
  console.log(req.headers.authorization);
  if (req.headers.authorization == "Basic amFjbWFuOmphdmFzY3JpcHQ=") {
    next();
  } else {
    res.status(401).send("Authentication required");
  }
}

app.use(passwordProtected);

app.get("/", function (req, res) {
  //find is the method to read from mongodb
  //and transform that to a JS array
  db.collection("items")
    .find()
    .toArray(function (err, items) {
      //To test if it logs to console
      //console.log(items)

      //Add res.send after the DB was read
      res.send(`<!DOCTYPE html>
        <html>
        <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Goals App</title>
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css" integrity="sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS" crossorigin="anonymous">
        </head>
        <body>
        <div class="container">
        <h1 class="display-4 text-center py-1">Goals App!</h1>
        
        <div class="jumbotron p-3 shadow-sm">
        <form id="create-form" action="/create-item" method="POST">
        <div class="d-flex align-items-center">
        <input id="create-field" name="item" autofocus autocomplete="off" class="form-control mr-3" type="text" style="flex: 1;">
        <button class="btn btn-primary">Add New Item</button>
        </div>
        </form>
        </div>
        
        <ul id="item-list" class="list-group pb-5">
        </ul>
        
        </div>
        
        <hr>
        <div style="padding: 20px 0px 30px;">
        <h6 style="text-align: center;" class="display-6 fst-italic">Developed by: <span style="color: teal">Joseph Castellon</span></h6>
        </div>
        
        <script>
        let items = ${JSON.stringify(items)}
        </script>
      
        <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
        <script src="/browser.js"></script>
        </body>
        </html>`);
    });
  //Previous HTML Document, was moved to app.get function
});

app.post("/create-item", function (req, res) {
  //To test add item
  //console.log(req.body.item)

  //sanitize HTML package
  let safeText = sanitizeHTML(req.body.text, {
    allowedTags: [],
    allowedAttributes: {},
  });

  //Method to select from DB
  //replace item with text to change for asynchronous
  db.collection("items").insertOne({ text: safeText }, function (err, info) {
    //To test submitting
    //res.send("thanks for submitting the form.")
    //res.redirect('/')
    //res.send("Success")
    res.json(info.ops[0]);
  });
});

app.post("/update-item", function (req, res) {
  //To test the name of the userInput from browser
  //console.log(req.body.text)
  //res.send("Success")

  //sanitize HTML package
  let safeText = sanitizeHTML(req.body.text, {
    allowedTags: [],
    allowedAttributes: {},
  });

  //using goals name instaed of Id (sample)
  db.collection("items").findOneAndUpdate(
    { _id: new mongodb.ObjectId(req.body.id) },
    { $set: { text: safeText } },
    function () {
      res.send("Success");
    }
  );
});

app.post("/delete-item", function (req, res) {
  db.collection("items").deleteOne(
    { _id: new mongodb.ObjectId(req.body.id) },
    function () {
      res.send("Success");
    }
  );
});
