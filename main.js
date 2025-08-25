document.addEventListener('DOMContentLoaded', () => {
    const timeElement = document.getElementById('time');

    function updateTime() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        let displayHours = hours % 12;
        displayHours = displayHours ? displayHours : 12; // the hour '0' should be '12'
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        timeElement.innerHTML = `${displayHours}:${minutes}:${seconds} <span class="am-pm">${ampm}</span>`;
    }

    // Update time initially and then every second
    updateTime();
    setInterval(updateTime, 1000);

    const weatherIconElement = document.getElementById('weather-icon');
    const weatherTempElement = document.getElementById('weather-temp');

    function getWeatherIcon(wmoCode) {
        const icons = {
            '0': '☀️', // Clear sky
            '1': '🌤️', // Mainly clear
            '2': '⛅️', // Partly cloudy
            '3': '☁️', // Overcast
            '45': '🌫️', // Fog
            '48': '🌫️', // Depositing rime fog
            '51': '💧', // Drizzle, light
            '53': '💧', // Drizzle, moderate
            '55': '💧', // Drizzle, dense
            '61': '🌧️', // Rain, slight
            '63': '🌧️', // Rain, moderate
            '65': '🌧️', // Rain, heavy
            '80': '🌦️', // Rain showers, slight
            '81': '🌦️', // Rain showers, moderate
            '82': '🌦️', // Rain showers, violent
            '95': '⛈️', // Thunderstorm, slight or moderate
            '96': '⛈️', // Thunderstorm with slight hail
            '99': '⛈️', // Thunderstorm with heavy hail
        };
        return icons[wmoCode] || '❓';
    }

    async function updateWeather() {
        try {
            // Fetch location data
            const geoResponse = await fetch('http://ip-api.com/json/');
            const geoData = await geoResponse.json();
            const { lat, lon } = geoData;

            // Fetch weather data
            const weatherResponse = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
            const weatherData = await weatherResponse.json();
            const { temperature, weathercode } = weatherData.current_weather;

            // Update the DOM
            weatherIconElement.innerHTML = getWeatherIcon(weathercode);
            weatherTempElement.innerHTML = `${Math.round(temperature)}°C`;
        } catch (error) {
            console.error('Failed to fetch weather:', error);
            weatherIconElement.innerHTML = '❓';
            weatherTempElement.innerHTML = 'N/A';
        }
    }

    // Update weather initially
    updateWeather();

    async function updateBackground() {
        try {
            const response = await fetch(`https://api.unsplash.com/photos/random?client_id=bGwbpOMPktYIGDod1fzJf2drp5PdF8nSQvH5Am987HM`);
            const photo = await response.json();
            document.body.style.backgroundImage = `url(${photo.urls.regular})`;
            document.body.style.backgroundSize = 'cover';
            document.body.style.backgroundPosition = 'center';
        } catch (error) {
            console.error('Failed to fetch background image:', error);
        }
    }

    updateBackground();
    setInterval(updateBackground, 10000);
});