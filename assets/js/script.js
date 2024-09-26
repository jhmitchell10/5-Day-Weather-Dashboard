const API_KEY = '507bcf7b14de2bae0c8296d01b49f1fb'; 
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

document.getElementById('search-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const city = document.getElementById('city-input').value.trim();
    if (city) {
        fetchWeatherData(city);
        saveToHistory(city);
    }
});

function fetchWeatherData(city) {
    fetch(`${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric`)
        .then(response => response.json())
        .then(data => {
            const { lat, lon } = data.coord;
            return fetch(`${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`)
                .then(response => response.json())
                .then(data => displayWeatherData(data));
        })
        .catch(error => console.error('Error fetching weather data:', error));
}

function displayWeatherData(data) {
    const city = data.city.name;
    document.getElementById('city-name').textContent = city;
    document.getElementById('date').textContent = dayjs().format('MMMM D, YYYY');
    
    const weather = data.list[0].weather[0];
    document.getElementById('weather-icon').src = `https://openweathermap.org/img/wn/${weather.icon}.png`;
    document.getElementById('weather-icon').alt = weather.description;
    document.getElementById('temperature').textContent = `Temperature: ${data.list[0].main.temp} °C`;
    document.getElementById('humidity').textContent = `Humidity: ${data.list[0].main.humidity}%`;
    document.getElementById('wind-speed').textContent = `Wind Speed: ${data.list[0].wind.speed} m/s`;

    displayForecast(data);
}

function displayForecast(data) {
    const forecastContainer = document.getElementById('forecast-cards');
    forecastContainer.innerHTML = '';
    data.list.forEach((item, index) => {
        if (index % 8 === 0) { 
            const forecastCard = document.createElement('div');
            forecastCard.classList.add('forecast-card');
            
            const date = dayjs(item.dt_txt).format('MMMM D, YYYY');
            const weather = item.weather[0];
            
            forecastCard.innerHTML = `
                <h3>${date}</h3>
                <img src="https://openweathermap.org/img/wn/${weather.icon}.png" alt="${weather.description}">
                <p>Temp: ${item.main.temp} °C</p>
                <p>Wind: ${item.wind.speed} m/s</p>
                <p>Humidity: ${item.main.humidity}%</p>
            `;
            
            forecastContainer.appendChild(forecastCard);
        }
    });
}

function saveToHistory(city) {
    let history = JSON.parse(localStorage.getItem('searchHistory')) || [];
    if (!history.includes(city)) {
        history.push(city);
        localStorage.setItem('searchHistory', JSON.stringify(history));
        displaySearchHistory();
    }
}

function displaySearchHistory() {
    const historyList = document.getElementById('history-list');
    historyList.innerHTML = '';
    let history = JSON.parse(localStorage.getItem('searchHistory')) || [];
    history.forEach(city => {
        const listItem = document.createElement('li');
        listItem.textContent = city;
        listItem.addEventListener('click', () => fetchWeatherData(city));
        historyList.appendChild(listItem);
    });
}

// Initialize the search history on page load
displaySearchHistory();
