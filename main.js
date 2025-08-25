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

    const backgroundSliders = document.querySelectorAll('.background-slider');
    let currentSlider = 0;
    let isTransitioning = false;

    async function updateBackground(isInitial = false) {
        if (isTransitioning) return;
        isTransitioning = true;

        try {
            const response = await fetch(`https://api.unsplash.com/photos/random?client_id=bGwbpOMPktYIGDod1fzJf2drp5PdF8nSQvH5Am987HM`);
            const photo = await response.json();
            const imageUrl = photo.urls.regular;

            if (isInitial) {
                backgroundSliders[currentSlider].style.backgroundImage = `url(${imageUrl})`;
                backgroundSliders[currentSlider].style.transform = 'translate(0, 0)';
                isTransitioning = false;
                return;
            }

            const nextSlider = (currentSlider + 1) % 2;

            backgroundSliders[nextSlider].style.backgroundImage = `url(${imageUrl})`;
            backgroundSliders[nextSlider].classList.add('no-transition');

            const directions = [
                { transform: 'translateX(-100%)' }, // from left
                { transform: 'translateX(100%)' },  // from right
                { transform: 'translateY(-100%)' }, // from top
                { transform: 'translateY(100%)' }   // from bottom
            ];
            const randomDirection = directions[Math.floor(Math.random() * directions.length)];

            backgroundSliders[nextSlider].style.transform = randomDirection.transform;

            // Force reflow to apply the initial off-screen position before the transition
            backgroundSliders[nextSlider].offsetHeight;

            backgroundSliders[nextSlider].classList.remove('no-transition');

            backgroundSliders[nextSlider].style.transform = 'translate(0, 0)';
            backgroundSliders[currentSlider].style.transform = `translate(${parseInt(randomDirection.transform.split('(')[1]) * -1}%)`;

            backgroundSliders[nextSlider].addEventListener('transitionend', () => {
                backgroundSliders[currentSlider].style.backgroundImage = 'none';
                currentSlider = nextSlider;
                isTransitioning = false;
            }, { once: true });

        } catch (error) {
            console.error('Failed to fetch background image:', error);
            isTransitioning = false;
        }
    }

    updateBackground(true); // Initial background
    setInterval(updateBackground, 120000);

    const photoColumn = document.querySelector('.photo-column');

    async function updateNews() {
        // TODO: Replace with your real API key from https://newsapi.org/
        const apiKey = 'YOUR_API_KEY';
        const url = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${apiKey}`;

        try {
            const response = await fetch(url);
            const newsData = await response.json();
            const articles = newsData.articles.slice(0, 3); // Get the first 3 articles

            photoColumn.innerHTML = ''; // Clear existing content

            articles.forEach(article => {
                if (!article.urlToImage || !article.title || !article.url) {
                    return; // Skip articles with missing data
                }

                const newsItemLink = document.createElement('a');
                newsItemLink.href = article.url;
                newsItemLink.target = '_blank'; // Open in a new tab
                newsItemLink.rel = 'noopener noreferrer';
                newsItemLink.classList.add('news-item');

                const img = document.createElement('img');
                img.src = article.urlToImage;
                img.alt = article.title;

                const caption = document.createElement('div');
                caption.classList.add('caption');
                caption.textContent = article.title;

                newsItemLink.appendChild(img);
                newsItemLink.appendChild(caption);
                photoColumn.appendChild(newsItemLink);
            });
        } catch (error) {
            console.error('Failed to fetch news:', error);
            photoColumn.innerHTML = '<p style="color: white; text-align: center;">Could not load news.</p>';
        }
    }

    // Update news initially
    updateNews();
});