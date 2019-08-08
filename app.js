//jshint esversion: 6

const express    = require('express'),
      bodyParser = require('body-parser'),
      request    = require('request');

const app        = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

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

  const MAILCHIMP_API = process.env.MAILCHIMP_API;

  let options = {
    url: "https://us3.api.mailchimp.com/3.0/lists/7f4145bd5a",
    method: "POST",
    headers: {
      "Authorization": "ben " + MAILCHIMP_API
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

app.listen(process.env.PORT || 3000, () => {
  console.log('Server is up and running');
});
