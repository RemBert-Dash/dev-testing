const citySelect = document.querySelector('#city-select');
const cityButton = document.querySelector('#city-button');
const cityName   = document.querySelector('#city-name');

function capitalizeCity(cityValue) {
  return cityValue.charAt(0).toUpperCase() + cityValue.slice(1);
}

async function updateCityName() {
  const selectedCity = citySelect.value;
  const weatherInfo = document.querySelector('#weather-info');
  
  if (selectedCity) {
    cityName.textContent = capitalizeCity(selectedCity);
    
    // Fetch weather data using Open-Meteo Geocoding API
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${selectedCity}&count=1&language=en&format=json`;
    const geoResponse = await fetch(geoUrl);
    const geoData = await geoResponse.json();
    
    console.log('GEO DATA:', geoData);
    console.log('GEO RESULTS:', geoData.results);
    console.log('FIRST RESULT:', geoData.results && geoData.results[0]);
    
    const firstResult = geoData.results && geoData.results[0];
    if (!firstResult) {
      console.log('No geo results found');
      return;
    }

    const { latitude, longitude } = firstResult;

    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;

    const weatherResponse = await fetch(weatherUrl);
    const weatherData = await weatherResponse.json();

    console.log('WEATHER DATA:', weatherData);

    const current = weatherData.current_weather;

    if (!current) {
      weatherInfo.textContent = 'No weather data available.';
      return;
    }

    const temperature = current.temperature;
    const windspeed = current.windspeed;

    let tempEmoji;
    if (temperature <= 0) {
      tempEmoji = '🥶';
    } else if (temperature < 15) {
      tempEmoji = '🧥';
    } else if (temperature < 25) {
      tempEmoji = '🙂';
    } else {
      tempEmoji = '🥵';
    }

    weatherInfo.textContent = `${tempEmoji} Temp: ${temperature} °C | Wind: ${windspeed} km/h`;
  } else {
    cityName.textContent = 'No City Selected';
    weatherInfo.textContent = '';
  }
}

cityButton.addEventListener('click', updateCityName);
