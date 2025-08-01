const express = require('express');
const path = require('path');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8080;
const API_KEY = process.env.OPENWEATHER_API_KEY;
const cache = new Map();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Health check endpoint for monitoring
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

function getCacheKey(endpoint, city) {
    return `${endpoint}:${city}`;
}

async function handleWeatherRequest(req, res, apiEndpoint, cacheKeyName) {
    const { city } = req.query;
    // A more permissive regex for city names, allowing hyphens and apostrophes.
    if (!city || !/^[a-zA-Z\s'-]+$/.test(city)) {
        return res.status(400).json({ error: 'Invalid or missing city name' });
    }

    const cacheKey = getCacheKey(cacheKeyName, city);
    if (cache.has(cacheKey)) {
        return res.json(cache.get(cacheKey));
    }

    try {
        const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/${apiEndpoint}?q=${city}&appid=${API_KEY}&units=metric`
        );
        cache.set(cacheKey, response.data);
        setTimeout(() => cache.delete(cacheKey), CACHE_TTL_MS);
        res.json(response.data);
    } catch (error) {
        console.error(`Error fetching data for ${city} from ${apiEndpoint}:`, error.message);
        const status = error.response ? error.response.status : 500;
        const message = error.response?.data?.message || 'An error occurred while fetching weather data.';
        res.status(status).json({ error: message });
    }
}

// The OpenWeatherMap API endpoint for current weather is 'weather'
app.get('/api/weather/current', (req, res) => handleWeatherRequest(req, res, 'weather', 'current'));

// The OpenWeatherMap API endpoint for forecast is 'forecast'
app.get('/api/weather/forecast', (req, res) => handleWeatherRequest(req, res, 'forecast', 'forecast'));

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});