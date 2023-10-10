const express = require("express");
const jwt = require("jsonwebtoken");
const path = require("path");
const axios = require("axios");
const jwksClient = require("jwks-rsa");
const url = require("url");

require("dotenv").config();

const port = 3000;

const app = express();
app.use(express.json());

const auth0TokenUrl = "https://dev-vs5mll4nqah4fkw0.us.auth0.com/oauth/token";
const auth0url = "https://dev-vs5mll4nqah4fkw0.us.auth0.com";
const getDeviceCodeUrl =
  "https://dev-vs5mll4nqah4fkw0.us.auth0.com/authorize?response_type=code&client_id=BSvD7ZWDj24bhu5SfGyPIjTAczIk5qsI&redirect_uri=http://localhost:3000&scope=offline_access";
const jwksUri =
  "https://dev-vs5mll4nqah4fkw0.us.auth0.com/.well-known/jwks.json";

const jwksClientInstance = jwksClient({
  jwksUri,
  cache: true,
});

app.get("/", (req, res) => {
  const token = req?.headers["authorization"];
  if (token) {
    const decodedToken = jwt.decode(token, { complete: true });
    
    const decodedHeader = decodedToken?.header;
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const timeExp = decodedToken.payload.exp;

    jwksClientInstance.getSigningKey(decodedHeader.kid, (err, key) => {
      if (err) {
        console.log("error");
      }
      const signingKey = key.publicKey || key.rsaPublicKey;
      jwt.verify(token, signingKey, (err, decoded) => {
        if (err) {
          return res.status(401).sendFile(indexPath);
        }
        if (timeExp - currentTimestamp <= 86000) {
          console.log("should refresh");
          // const requestBody = {
          //   audience: `${auth0url}/api/v2/`,
          //   grant_type: "refresh_token",
          //   client_id: "BSvD7ZWDj24bhu5SfGyPIjTAczIk5qsI",
          //   client_secret: process.env.CLIENT_SECRET,
          //   refresh_token: refresh_token_own,
          // };

          // axios
          //   .post(auth0TokenUrl, requestBody)
          //   .then((response) => {
          //     const newToken = response.data.access_token;
          //     console.log("refreshed");
          //     return res
          //       .status(200)
          //       .json({ login: decoded.sub, token: newToken });
          //   })
          //   .catch((error) => {
          //     console.log("error " + error);
          //   });
        }else{
          return res.status(200).json({ login: decoded.sub });
        }
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
