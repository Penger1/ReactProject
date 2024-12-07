const express = require('express');
const fetch = require('node-fetch');

const app = express();

// Endpoint for Mojang API
app.get('/mojang/:username', async (req, res) => {
  const { username } = req.params;
  try {
    const response = await fetch(`https://api.mojang.com/users/profiles/minecraft/${username}`);
    if (!response.ok) throw new Error('Failed to fetch Mojang data');
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint for Manacube API
app.get('/manacube/:server/:uuid', async (req, res) => {
  const { server, uuid } = req.params;
  try {
    const response = await fetch(`https://api.manacube.com/api/svas/${server}/${uuid}`);
    if (!response.ok) throw new Error('Failed to fetch Manacube data');
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
