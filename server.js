const express = require("express");
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

// =====================
// SPOTIFY CONFIG
// =====================
const spotify = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  redirectUri: process.env.REDIRECT_URI
});

// =====================
// ROOT (DEBUG)
// =====================
app.get("/", (req, res) => {
  res.send("Spotify AI Backend is running ✔");
});

// =====================
// LOGIN
// =====================
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

// =====================
// CALLBACK (FIXED - NO LOOP)
// =====================
app.get("/callback", async (req, res) => {
  const code = req.query.code;

  if (!code) {
    return res.status(400).send("NO CODE RECEIVED FROM SPOTIFY");
  }

  try {
    const data = await spotify.authorizationCodeGrant(code);

    const access_token = data.body.access_token;
    const refresh_token = data.body.refresh_token;

    spotify.setAccessToken(access_token);
    spotify.setRefreshToken(refresh_token);

    // STOP FLOW HERE (IMPORTANT)
    res.send(`
      <h2>LOGIN SUCCESS ✔</h2>
      <p>You can close this page</p>
    `);

    console.log("ACCESS TOKEN:", access_token);
    console.log("REFRESH TOKEN:", refresh_token);

  } catch (err) {
    console.log("CALLBACK ERROR:", err);
    res.status(500).send("AUTH ERROR: " + err.message);
  }
});

// =====================
// START SERVER (FIX FOR RAILWAY)
// =====================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
