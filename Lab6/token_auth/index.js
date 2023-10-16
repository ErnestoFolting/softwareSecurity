const express = require("express");
const jwt = require("jsonwebtoken");
const path = require("path");
const axios = require("axios");
const jwksClient = require("jwks-rsa");
const { auth, requiresAuth } = require('express-openid-connect');

const config = {
  authRequired: true,
  auth0Logout: true,
  baseURL: 'http://localhost:3000',
  clientID: 'BSvD7ZWDj24bhu5SfGyPIjTAczIk5qsI',
  issuerBaseURL: 'https://dev-vs5mll4nqah4fkw0.us.auth0.com',
  secret: "vtr86oZ0ssreCXYEvFM7kaNPGAfGw0Kz4bwgLYNVtlzQa3jff-AgbDuKu8adw20o",
  logoutParams: {
    returnTo: 'http://localhost:3000/logout', // Specify your custom return URL after logout
  },
};

require("dotenv").config();

const port = 3000;

const app = express();

app.set('view engine', 'ejs');

console.log(process.env.CLIENT_SECRET);
app.use(express.json());
app.use(auth(config));

const auth0TokenUrl = "https://dev-vs5mll4nqah4fkw0.us.auth0.com/oauth/token";
const auth0url = "https://dev-vs5mll4nqah4fkw0.us.auth0.com";
const jwksUri =
  "https://dev-vs5mll4nqah4fkw0.us.auth0.com/.well-known/jwks.json";

const jwksClientInstance = jwksClient({
  jwksUri,
  cache: true,
});

// app.get("/", (req, res) => {

//   const token = req?.headers["authorization"];
//   if (token) {
//     const decodedToken = jwt.decode(token, { complete: true });
    
//     const decodedHeader = decodedToken?.header;

//     jwksClientInstance.getSigningKey(decodedHeader.kid, (err, key) => {
//       if (err) {
//         console.log("error");
//       }
//       const signingKey = key.publicKey || key.rsaPublicKey;
//       jwt.verify(token, signingKey, (err, decoded) => {
//         if (err) {
//           return res.status(401).sendFile(indexPath);
//         }
//         return res.status(200).json({ login: decoded.sub });
//       });
//     });
//   } else {
//     res.sendFile(path.join(indexPath));
//   }
// });s

const indexPath = path.join(__dirname + "/index.html");
const profilePath = path.join(__dirname + "/profile.html");

app.get("/", (req, res) => {

  if(req.oidc.isAuthenticated()){
    res.render('profile', { User: req.oidc.user.email });
  }else{
    res.sendFile(path.join(indexPath));
  }
});




app.post("/api/login", (req, res) => {
  console.log(req.oidc.isAuthenticated());
  const { login, password } = req.body;

  const requestBody = {
    audience: `${auth0url}/api/v2/`,
    grant_type: "password",
    client_id: "BSvD7ZWDj24bhu5SfGyPIjTAczIk5qsI",
    client_secret: process.env.CLIENT_SECRET,
    username: login,
    password: password,
  };

  axios
    .post(auth0TokenUrl, requestBody)
    .then((response) => {
      const token = response.data.access_token;
      res.json({ token });
    })
    .catch((error) => {
      console.log("error " + error);
      res.status(401).json("Not Authorized");
    });
});

app.post("/api/register", (req, res) => {

  //get access to add users
  axios
    .post(`${auth0url}/oauth/token`, {
      client_id: "BSvD7ZWDj24bhu5SfGyPIjTAczIk5qsI",
      client_secret: process.env.CLIENT_SECRET,
      audience: `${auth0url}/api/v2/`,
      grant_type: "client_credentials",
    })
    .then((response) => {
      const accessToken = response.data.access_token;

      const requestBody = {
        email: req.body.login,
        password: req.body.password,
        connection: "Username-Password-Authentication",
      };
      axios
        .post(`${auth0url}/api/v2/users`, requestBody, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((response) => {
          res.json(requestBody.email + " registered");
        })
        .catch((error) => {
          console.log("error " + error);
          res.status(401).json("Not registered: " + error?.message);
        });
    });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
