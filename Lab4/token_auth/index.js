const express = require("express");
const jwt = require("jsonwebtoken");
const path = require("path");

const port = 3000;

const app = express();
app.use(express.json());

const TOKEN_SECRET = "token-secret";

app.get("/", (req, res) => {
  const token = req.headers["authorization"];
  if(token){
    jwt.verify(token, TOKEN_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).sendFile(indexPath);
      }
      return res.status(200).json({login:decoded.login})
    });
  }else{
    res.sendFile(path.join(indexPath));
  }
});

const indexPath = path.join(__dirname + "/index.html");

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
