const cityNameElement = document.querySelector(".city-name");
const tempValueElement = document.querySelector(".temp-value");
const weatherDescriptionElement = document.querySelector(
  ".weather-description"
);
const humidityElement = document.querySelector(".humidity-value");
const windSpeedElement = document.querySelector(".wind-value");

async function fetchData() {
  try {
    const data = await loadConfiguration();
    const apiKey = data.apiKey;
    const city = data.city;
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=fr`;

    fetchWeatherData(apiUrl);

    // Update weather data every hour
    setInterval(() => fetchWeatherData(apiUrl), 3600000); // 3600000 ms = 1 hour
  } catch (error) {
    console.error(
      "An error occurred while fetching the configuration file.",
      error
    );
  }
}

function getWeatherIconURL(iconCode) {
  // Get the icon code from the API response and build the icon URL
  const iconURL = `https://openweathermap.org/img/wn/${iconCode}.png`;
  return iconURL;
}

async function fetchWeatherData(apiUrl) {
  try {
    const response = await fetch(apiUrl);
    const weatherData = await response.json();

    cityNameElement.textContent = weatherData.name;
    tempValueElement.textContent = weatherData.main.temp;
    weatherDescriptionElement.textContent = weatherData.weather[0].description;
    humidityElement.textContent = weatherData.main.humidity;

    const windSpeedMps = weatherData.wind.speed;
    windSpeedElement.textContent = `${convertToKmph(windSpeedMps)}`;

    const iconURL = getWeatherIconURL(weatherData.weather[0].icon);
    displayWeatherIcon(iconURL);
  } catch (error) {
    console.error(
      "Une erreur s'est produite lors de la récupération des données météo.",
      error
    );
  }
}

// Display the weather icon
function displayWeatherIcon(iconURL) {
  const iconElement = document.getElementById("weather-icon");
  iconElement.src = iconURL;
}

async function loadConfiguration() {
  const response = await fetch("conf.json");
  return await response.json();
}

function convertToKmph(metersPerSecond) {
  return (metersPerSecond * 3.6).toFixed(2);
}

fetchData();
