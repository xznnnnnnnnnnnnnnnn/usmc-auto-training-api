
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

const config = require('./config');
const whitelist = require('./whitelist');
const verifyGroup = require('./middleware/verifyGroup');

app.use(express.json());

app.get('/', (req, res) => {
  res.send('USMC Auto Training API Operational 🫡');
});

app.post('/check-user', verifyGroup, (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ error: 'Missing username' });
  }

  const isWhitelisted = whitelist.includes(username.toLowerCase());

  if (isWhitelisted) {
    return res.status(200).json({
      message: `✅ ${username} is cleared for auto-character setup.`,
      autoSetup: true,
    });
  } else {
    return res.status(403).json({
      message: `⚠️ ${username} is not on the whitelist. Manual approval required.`,
      autoSetup: false,
      fallback: config.fallbackMessage,
    });
  }
});

app.listen(port, () => {
  console.log(`USMC Auto Training API running on port ${port}`);
});
