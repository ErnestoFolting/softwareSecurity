const express = require("express");
const jwt = require("jsonwebtoken");
const path = require("path");
const axios = require("axios");
const jwksClient = require("jwks-rsa");

const port = 3000;

const app = express();
app.use(express.json());

const auth0TokenUrl = "https://dev-vs5mll4nqah4fkw0.us.auth0.com/oauth/token";
const jwksUri =
  "https://dev-vs5mll4nqah4fkw0.us.auth0.com/.well-known/jwks.json";
const jwksClientInstance = jwksClient({
  jwksUri,
  cache: true,
});

app.get("/", (req, res) => {
  const token = req.headers["authorization"];

  if (token) {
    const decodedHeader = jwt.decode(token, { complete: true }).header;
    jwksClientInstance.getSigningKey(decodedHeader.kid, (err, key) => {
      if (err) {
        console.log("error");
      }
      const signingKey = key.publicKey || key.rsaPublicKey;
      jwt.verify(token, signingKey, (err, decoded) => {
        if (err) {
          return res.status(401).sendFile(indexPath);
        }
        return res.status(200).json({ login: decoded.sub });
      });
    });
  } else {
    res.sendFile(path.join(indexPath));
  }
});

const indexPath = path.join(__dirname + "/index.html");

app.get("/logout", (req, res) => {
  res.redirect("/");
});

app.post("/api/login", (req, res) => {
  const { login, password } = req.body;

  const requestBody = {
    audience: "https://dev-vs5mll4nqah4fkw0.us.auth0.com/api/v2/",
    grant_type: "password",
    client_id: "BSvD7ZWDj24bhu5SfGyPIjTAczIk5qsI",
    client_secret:
      "YZW9whGXIW-UYd8oSw0q8Q6BWmafY_svTxDE8bAX3bWcHayoXvbuK562HcgzRXzQ",
    username: login,
    password: password
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

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
