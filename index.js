const express = require('express');
const bodyParser = require('body-parser');
const { TwitterApi } = require('twitter-api-v2');
require('dotenv').config();

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Initialize Twitter client
const client = new TwitterApi({
  appKey: process.env.TWITTER_API_KEY,
  appSecret: process.env.TWITTER_API_SECRET_KEY,
  accessToken: process.env.TWITTER_ACCESS_TOKEN,
  accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});

const bearer = new TwitterApi(process.env.BEARER_TOKEN);

const twitterClient = client.readWrite;
const twitterBearer = bearer.readOnly;

app.post('/tweet', async (req, res) => {
  const { username, score } = req.body;

  if (!username || !score) {
    return res.status(400).send('Username and score are required.');
  }

  const tweetText = `User @${username} scored ${score} points!`;

  try {
    const tweet = await twitterClient.v2.tweet(tweetText);
    res.status(200).send(`Tweet posted successfully: ${tweetText}`);
  } catch (error) {
    res.status(500).send(`Error posting tweet: ${error.message}`);
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
