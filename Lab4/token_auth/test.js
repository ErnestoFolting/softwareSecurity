const jwt = require("jsonwebtoken");
const axios = require("axios");
const jwksClient = require("jwks-rsa");

let secret1 =
  "MIIDHTCCAgWgAwIBAgIJerfF4cbg2TpyMA0GCSqGSIb3DQEBCwUAMCwxKjAoBgNVBAMTIWRldi12czVtbGw0bnFhaDRma3cwLnVzLmF1dGgwLmNvbTAeFw0yMzA5MjYxMTQ1MTNaFw0zNzA2MDQxMTQ1MTNaMCwxKjAoBgNVBAMTIWRldi12czVtbGw0bnFhaDRma3cwLnVzLmF1dGgwLmNvbTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAKlmmCxYnb4E+guJHPL+82eOA6vfF7nkh7ZmkLPZtyStYFX91zHiI93SEgGfAKfBvmSMxGjOjkXWPOViaefGUHBhLiYddfRsvtRtDeYxOQWvBW8qo1et4uomaiUfjEWwne8Qgv86TK/NXegY6oeSxY3PH2qfAM3kdA47QeZ8z9x4qYXZBd0jhAhk+Q9fM0jgHqXfIHjswFBcnK48ZLJby7sGQ3qdoIUg62XcCYg2kQ2G6wuIDqB3uYKEHyvQaTrQFjEYBbAWuozdybNV6+Y8kirVOO61lRvIm7OElvCkzncxW2I0MPv+h47AoiscYW/RiSPKooAIRFgqtkgekEh9tI0CAwEAAaNCMEAwDwYDVR0TAQH/BAUwAwEB/zAd";
let secret2 =
  "BgNVHQ4EFgQUvyA5ucIkT/QM4Ua51Xv0EsaabrowDgYDVR0PAQH/BAQDAgKEMA0GCSqGSIb3DQEBCwUAA4IBAQAaTLhQeqdjU/dJfdkygt20dL38bd5bztgnXB2AxYsVA4f0UdFujtKrj0R88pgQ46BTrZmbk6N12FRTwhIVNxMfjaKZmzqCMSRG1buwydiCEZCismGjRBWPCLX+iepN+xm8UGZ8bgCIaNPIZ+qPE8NiqysnSjerZkM8FhEd51C8gGL2FbidwNTMRE5pMzb5u+L4I1MPefWyurdSGx1pLwKR6Ov6kgpSnAKhZ9awJt97u3xEXuYhnkUfLIjKkHL5025a7y5Kyvo8BQT9GLptJ7FjHytCV+3W7r9/ITFMWiOQ4Wm3majiylpw4wDZg8R2gH1/wh+wdxCPHasxzuSZf+zk";

const secret = secret1 + secret2;

const token1 = `eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Il96V2ViUW1LdUQwaUNjTEpSdGpUVCJ9.eyJpc3MiOiJodHRwczovL2Rldi12czVtbGw0bnFhaDRma3cwLnVzLmF1dGgwLmNvbS8iLCJzdWIiOiJhdXRoMHxzdHJpbmciLCJhdWQiOiJodHRwczovL2Rldi12czVtbGw0bnFhaDRma3cwLnVzLmF1dGgwLmNvbS9hcGkvdjIvIiwiaWF0IjoxNjk2ODQ4MTgzLCJleHAiOjE2OTY5MzQ1ODMsImF6cCI6IkJTdkQ3WldEajI0Ymh1NVNmR3lQSWpUQWN6SWs1cXNJIiwic2NvcGUiOiJyZWFkOmN1cnJlbnRfdXNlciB1cGRhdGU6Y3VycmVudF91c2VyX21ldGFkYXRhIGRlbGV0ZTpjdXJyZW50X3VzZXJfbWV0YWRhdGEgY3JlYXRlOmN1cnJlbnRfdXNlcl9tZXRhZGF0YSBjcmVhdGU6Y3VycmVudF91c2VyX2RldmljZV9jcmVkZW50aWFscyBkZWxldGU6Y3VycmVudF91c2VyX2R`;
const token2 = `ldmljZV9jcmVkZW50aWFscyB1cGRhdGU6Y3VycmVudF91c2VyX2lkZW50aXRpZXMiLCJndHkiOiJwYXNzd29yZCJ9.W6ICWCoYLLABx8NUOYbOzS2ZfGerEP1w_iAVrFfmHujnAdU24Jxxyh_yGiBWDZ1auvBeIkOmL-1WtqXv0ORBZdv0Xak1yN_IuENah5MV9wHgag_E0duYdQD-T_iI2DnU2C8ZbbYpt12vpElDkJCS3M18qKRjMG1CBx3lWby5o8XgzMHWgeQbFll1gPNrnXXaBMmmf4YSSLJoH28aJDH7D5TWiuV46B4b-LIRu7J9tLGtyX42bxSFpCPN8leyChtP_DsrZmEuoOkh_qF0ixt5-yoWTAj4ZGCgLzJaX4Iyzc0cWyOrtPerIlKRS-P_kp_kRtifgJ7W0xCMByHmo-mBMw`;
// const token = token1 + token2;
const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2dpbiI6IkxvZ2luIiwiaWF0IjoxNjk2ODYwNDU0LCJleHAiOjE2OTY4NjQwNTR9.B5E6XlRrvqUEQZSBQ51j1eZZ8Vgjbgl17TCbFGy7Psw";

const decodedHeader = jwt.decode(token, { complete: true }).header;

console.log("header", decodedHeader);

// const jwksUrl =
//   "https://dev-vs5mll4nqah4fkw0.us.auth0.com/.well-known/jwks.json";

// let jwks = "";
// let getJWKS = () => {
//   axios
//     .get(jwksUrl)
//     .then((response) => {
//       jwks = response.data;
//       const selectedKey = jwks.keys.find(
//         (key) => key.kid === decodedHeader.kid
//       );
//       const publicKey = {
//         n: selectedKey.n,
//         e: selectedKey.e,
//       };

//       jwt.verify(token, publicKey, (err, decoded) => {
//         if (err) {
//           console.error("JWT verification failed:", err);
//         } else {
//           console.log("Decoded JWT:", decoded);
//         }
//       });
//     })
//     .catch((error) => {
//       console.error("Error fetching JWKS:", error);
//     });
// };

const jwksUri =
  "https://dev-vs5mll4nqah4fkw0.us.auth0.com/.well-known/jwks.json";

const jwksClientInstance = jwksClient({
  jwksUri,
  cache: true, // Enable caching to reduce the number of requests
});

jwksClientInstance.getSigningKey(decodedHeader.kid, (err, key) => {
  if (err) {
    console.log("error");
  }
  const signingKey = key.publicKey || key.rsaPublicKey;
  jwt.verify(token, signingKey, (err, decoded) => {
    if (err) {
      console.log("err");
    }
    console.log(JSON.stringify(decoded));
  });
});
