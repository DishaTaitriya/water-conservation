const map = L.map('map').setView([20.5937, 78.9629], 5); // India center

// Add OpenStreetMap tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

const infoCard = document.getElementById('info-card');

const locationEl = document.getElementById('location');
const tempEl = document.getElementById('temperature');
const rainEl = document.getElementById('rainfall');
const scarcityEl = document.getElementById('water-scarcity');
const efficiencyEl = document.getElementById('efficiency-level');


const API_KEY = import.meta.env.VITE_API_KEY_2;
// Function to calculate water scarcity and efficiency level based on weather data
function calculateWaterStats(temp, rainfall) {
  let scarcity = '';
  let efficiency = '';

  if (rainfall < 20) {
    scarcity = 'High';
    efficiency = 'Low';
  } else if (rainfall >= 20 && rainfall < 50) {
    scarcity = 'Moderate';
    efficiency = 'Medium';
  } else {
    scarcity = 'Low';
    efficiency = 'High';
  }

  if (temp > 35) scarcity = 'Critical';

  return { scarcity, efficiency };
}

// Function to fetch weather data from OpenWeatherMap
async function fetchWeatherData(lat, lon) {
  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
    const response = await fetch(url);

    if (!response.ok) throw new Error(`Failed to load weather data`);

    const data = await response.json();

    const temp = data.main.temp;
    const rainfall = data.rain ? data.rain['1h'] || 0 : 0;

    const { scarcity, efficiency } = calculateWaterStats(temp, rainfall);

    return {
      location: data.name || `${lat.toFixed(2)}, ${lon.toFixed(2)}`,
      temp,
      rainfall,
      scarcity,
      efficiency
    };
  } catch (error) {
    console.error(`Error: ${error.message}`);
    return null;
  }
}

// Function to update info card
async function updateInfoCard(lat, lon) {
  const weatherData = await fetchWeatherData(lat, lon);

  if (weatherData) {
    locationEl.textContent = weatherData.location;
    tempEl.textContent = weatherData.temp;
    rainEl.textContent = weatherData.rainfall;
    scarcityEl.textContent = weatherData.scarcity;
    efficiencyEl.textContent = weatherData.efficiency;

    infoCard.classList.remove('hidden');
  }
}

// Event listener for map clicks
map.on('click', (e) => {
  const { lat, lng } = e.latlng;
  console.log(`Clicked at lat: ${lat}, lng: ${lng}`);
  
  updateInfoCard(lat, lng);
});
