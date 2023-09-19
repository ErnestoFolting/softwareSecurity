const express = require("express");
const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs");

const port = 3000;

const app = express();
app.use(express.json());

const TOKEN_SECRET = "token-secret";

app.get("/", verifyToken, (req, res) => {
  
});

function verifyToken(req, res, next) {
  const token = req.headers["authorization"];
  console.log("token2", token);
  if (!token) {
    res.sendFile(path.join(__dirname + "/index.html"));
  }

  jwt.verify(token, TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).sendFile(path.join(__dirname + "/index.html"));
    }
    req.user = decoded;
  });
  next();
}
app.get("/logout", (req, res) => {
  res.redirect("/");
});

app.post("/api/login", (req, res) => {
  const { login, password } = req.body;

  const user = users.find(
    (user) => user.login == login && user.password == password
  );

  if (user) {
    const token = jwt.sign({ login }, TOKEN_SECRET, { expiresIn: "1h" });
    res.json({ token });
  } else {
    res.status(401).json({ message: "Authentication failed" });
  }
});

const users = [
  {
    login: "Login",
    password: "Password",
    username: "Username",
  },
];

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
