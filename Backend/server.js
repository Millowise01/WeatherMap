const express = require('express');
const path = require('path');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8080;
const API_KEY = process.env.OPENWEATHER_API_KEY;
const cache = new Map();

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

function getCacheKey(endpoint, city) {
    return `${endpoint}:${city}`;
}

app.get('/api/weather/current', async (req, res) => {
    const { city } = req.query;
    if (!/^[a-zA-Z\s]+$/.test(city)) {
        return res.status(400).json({ error: 'Invalid city name' });
    }
    const cacheKey = getCacheKey('current', city);
    if (cache.has(cacheKey)) {
        return res.json(cache.get(cacheKey));
    }
    try {
        const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        );
        cache.set(cacheKey, response.data);
        setTimeout(() => cache.delete(cacheKey), 5 * 60 * 1000); // Cache for 5 minutes
        res.json(response.data);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

app.get('/api/weather/forecast', async (req, res) => {
    const { city } = req.query;
    if (!/^[a-zA-Z\s]+$/.test(city)) {
        return res.status(400).json({ error: 'Invalid city name' });
    }
    const cacheKey = getCacheKey('forecast', city);
    if (cache.has(cacheKey)) {
        return res.json(cache.get(cacheKey));
    }
    try {
        const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
        );
        cache.set(cacheKey, response.data);
        setTimeout(() => cache.delete(cacheKey), 5 * 60 * 1000); // Cache for 5 minutes
        res.json(response.data);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});