document.addEventListener('DOMContentLoaded', () => {
    // Check for city query parameter
    const urlParams = new URLSearchParams(window.location.search);
    const city = urlParams.get('city');
    if (city) {
        document.getElementById('cityInput').value = city;
        fetchWeatherData(city);
    }

    document.getElementById('searchBtn').addEventListener('click', () => {
        const city = document.getElementById('cityInput').value.trim();
        if (city) {
            fetchWeatherData(city);
        } else {
            showError('Please enter a city name.');
        }
    });
});

async function fetchWeatherData(city) {
    const errorDiv = document.getElementById('error');
    errorDiv.classList.add('hidden');
    try {
        const currentResponse = await fetch(`/api/weather/current?city=${encodeURIComponent(city)}`);
        if (!currentResponse.ok) throw new Error('City not found.');
        const currentData = await currentResponse.json();
        displayCurrentWeather(currentData);

        const forecastResponse = await fetch(`/api/weather/forecast?city=${encodeURIComponent(city)}`);
        if (!forecastResponse.ok) throw new Error('Forecast data unavailable.');
        const forecastData = await forecastResponse.json();
        displayForecast(forecastData);

        // Save city to local storage
        saveToHistory(city);
    } catch (error) {
        showError(error.message);
    }
}

function saveToHistory(city) {
    let history = JSON.parse(localStorage.getItem('weatherHistory')) || [];
    if (!history.includes(city)) {
        history.unshift(city);
        if (history.length > 10) history.pop(); // Limit to 10 cities
        localStorage.setItem('weatherHistory', JSON.stringify(history));
    }
}

function displayCurrentWeather(data) {
    document.getElementById('cityName').textContent = data.name;
    document.getElementById('currentTemp').textContent = data.main.temp;
    document.getElementById('currentHumidity').textContent = data.main.humidity;
    document.getElementById('currentWind').textContent = data.wind.speed;
    document.getElementById('currentCondition').textContent = data.weather[0].main;
    document.getElementById('currentWeather').classList.remove('hidden');
}

let forecastData = [];

function displayForecast(data) {
    forecastData = data.list.filter((item, index) => index % 8 === 0); // Daily data
    document.getElementById('forecast').classList.remove('hidden');
    applySortAndFilter();

    // Remove existing listeners to prevent duplicates
    const sortTemp = document.getElementById('sortTemp');
    const filterCondition = document.getElementById('filterCondition');
    sortTemp.replaceWith(sortTemp.cloneNode(true));
    filterCondition.replaceWith(filterCondition.cloneNode(true));

    document.getElementById('sortTemp').addEventListener('change', applySortAndFilter);
    document.getElementById('filterCondition').addEventListener('change', applySortAndFilter);
}

function applySortAndFilter() {
    const sortValue = document.getElementById('sortTemp').value;
    const filterValue = document.getElementById('filterCondition').value;
    let filteredData = [...forecastData];

    if (filterValue !== 'all') {
        filteredData = filteredData.filter(item => item.weather[0].main === filterValue);
    }

    if (sortValue === 'asc') {
        filteredData.sort((a, b) => a.main.temp - b.main.temp);
    } else if (sortValue === 'desc') {
        filteredData.sort((a, b) => b.main.temp - a.main.temp);
    }

    renderForecastCards(filteredData);
}

function renderForecastCards(data) {
    const forecastCards = document.getElementById('forecastCards');
    forecastCards.innerHTML = '';
    data.forEach(item => {
        const date = new Date(item.dt * 1000).toLocaleDateString();
        forecastCards.innerHTML += `
            <div class="bg-white p-4 rounded-md shadow-md">
                <p class="font-semibold">${date}</p>
                <p>Temp: ${item.main.temp} °C</p>
                <p>Condition: ${item.weather[0].main}</p>
            </div>
        `;
    });
}

function showError(message) {
    const errorDiv = document.getElementById('error');
    errorDiv.textContent = message;
    errorDiv.classList.remove('hidden');
    document.getElementById('currentWeather').classList.add('hidden');
    document.getElementById('forecast').classList.add('hidden');
}