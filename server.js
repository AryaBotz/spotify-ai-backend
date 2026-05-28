const express = require("express");
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

const spotify = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  redirectUri: process.env.REDIRECT_URI
});

app.get("/login", (req, res) => {
  const scopes = [
    "user-read-private",
    "user-top-read",
    "user-read-recently-played",
    "playlist-modify-public",
    "playlist-modify-private"
  ];

  const url = spotify.createAuthorizeURL(scopes);
  res.redirect(url);
});

app.get("/callback", async (req, res) => {
  const code = req.query.code;

  try {
    const data = await spotify.authorizationCodeGrant(code);

    spotify.setAccessToken(data.body.access_token);
    spotify.setRefreshToken(data.body.refresh_token);

    res.send("LOGIN SUCCESS ✔");

  } catch (err) {
    res.send("ERROR: " + err.message);
  }
});

app.listen(3000, () => {
  console.log("Server running");
});
