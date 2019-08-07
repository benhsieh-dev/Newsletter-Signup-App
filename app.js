//jshint esversion: 6

const express    = require('express'),
      bodyParser = require('body-parser'),
      request    = require('request');

const app        = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

// app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", (req, res) => {
  let firstName = req.body.fName;
  let lastName = req.body.lName;
  let email = req.body.email;

  let data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  };

  let jsonData = JSON.stringify(data);

  let options = {
    url: "https://us3.api.mailchimp.com/3.0/lists/7f4145bd5a",
    method: "POST",
    headers: {
      "Authorization": "ben 9b170abbdc55f37b3d27363013aaa882-us3"
    },
    body: jsonData
  };

  request(options, (error, response, body)=> {
    if (error ) {
      res.sendFile(__dirname + "/failure.html");
    } else {
      if (response.statusCode === 200) {
        res.sendFile(__dirname + "/success.html");
      } else {
          res.sendFile(__dirname + "/failure.html");
      }
    }
  });
});

app.post("/failure", (req, res) => {
  res.redirect("/");
});

let port = 3000 || process.env.PORT;

app.listen(port, () => {
  console.log('Server is up and running');
});

// 9b170abbdc55f37b3d27363013aaa882-us3  API Key

// 7f4145bd5a  audience
