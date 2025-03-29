
const apiKey = import.meta.env.VITE_API_KEY_1;
const searchBtn = document.getElementById('search-btn');
const cityInput = document.getElementById('Cityinput');
const cityName = document.getElementById('city-name');
const temperature = document.getElementById('temperature');
const description = document.getElementById('descriptions');
const weatherIcon = document.getElementById('weather-icon');
const weatherInfoCard = document.getElementById('weather-info');
const errorMessage = document.getElementById('error-message');

// New Elements
const rainfall = document.getElementById('rainfall');
const humidity = document.getElementById('humidity');
const droughtRisk = document.getElementById('drought-risk');


searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) {
        getWeather(city);
    } else {
        showError('Please enter a city name.');
    }
});

async function getWeather(city) {
    try {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
        const response = await fetch(url);
        if (!response.ok) throw new Error('City not found');

        const data = await response.json();
        displayWeather(data);
        getAirQuality(data.coord.lat, data.coord.lon);
    } catch (error) {
        showError(error.message);
    }
}



function displayWeather(data) {
    cityName.textContent = `${data.name}, ${data.sys.country}`;
    temperature.textContent = `${Math.round(data.main.temp)}°C`;
    description.textContent = data.weather[0].description.toUpperCase();

    // 🌦️ Rainfall data
    if (data.rain) {
        rainfall.textContent = data.rain['1h'] ? `${data.rain['1h']} mm (in last 1 hour)` :
            data.rain['3h'] ? `${data.rain['3h']} mm (in last 3 hours)` : 'No rain recorded';
    } else {
        rainfall.textContent = 'No rain recorded';
    }

    // 💧 Humidity
    humidity.textContent = `${data.main.humidity}%`;

    // 🌵 Drought Risk (Custom Logic)
    if (!data.rain && data.main.temp > 30 && data.main.humidity < 30) {
        droughtRisk.textContent = 'High';
    } else if (data.main.temp > 25 && data.main.humidity < 40) {
        droughtRisk.textContent = 'Moderate';
    } else {
        droughtRisk.textContent = 'Low';
    }

    // 🌤️ Weather icon
    if (data.weather[0].icon) {
        weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
        weatherIcon.style.display = 'block';
    } else {
        weatherIcon.style.display = 'none';
    }

    weatherInfoCard.style.display = 'block';
    errorMessage.textContent = '';
}

// Function to convert wind degree to compass direction

// function showError(message) {
//     errorMessage.textContent = message;
//     weatherInfoCard.style.display = 'none';
// }
function showError(message) {
    const errorElement = document.getElementById('error-message'); 
    if (errorElement) {
        errorElement.textContent = message;
    } else {
        console.error("Error element not found");
    }
}



