# WeatherMap

A simple weather dashboard application that provides current weather and forecast data using the OpenWeatherMap API. It features a Node.js/Express backend that serves the data and a basic caching mechanism to reduce API calls.

## Features

-   Fetches current weather data.
-   Fetches 5-day weather forecast.
-   In-memory caching to limit API requests.
-   Dockerized for easy deployment.

## Prerequisites

-   [Node.js](https://nodejs.org/) (v18 or later)
-   [Docker](https://www.docker.com/) (optional, for containerized deployment)
-   An API key from [OpenWeatherMap](https://openweathermap.org/api)

## Setup and Running Locally

1.  **Clone the repository:**
    `git clone <repository-url>`
2.  **Install dependencies:**
    `npm install`
3.  **Create a `.env` file** in the root directory and add your API key:
    `OPENWEATHER_API_KEY=your_api_key_here`
4.  **Start the server:**
    `npm start`

The server will be running at `http://localhost:8080`.