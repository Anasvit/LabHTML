let weatherData = [];
let currentIndex = 0;

let weatherMeta = {
    name: "Москва"
};

const defaultCoords = {
    lat: 55.75396,
    lon: 37.62039
};

const weatherDisplay = document.getElementById("weather-display");
const locationDetailsElement = document.getElementById("location-details");

window.onload = function () {
    loadUserLocation();
};

// Получение местоположения пользователя
function loadUserLocation() {
    locationDetailsElement.innerHTML = "<strong>Определение местоположения...</strong>";

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function (position) {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;

                weatherMeta.name = "Моё местоположение";
                fetchWeather(latitude, longitude);
            },
            function () {
                useDefaultCity();
            }
        );
    } else {
        useDefaultCity();
    }
}

// Если геолокация запрещена — показываем Москву
function useDefaultCity() {
    weatherMeta.name = "Москва";
    fetchWeather(defaultCoords.lat, defaultCoords.lon);
}

// Запрос погоды
async function fetchWeather(lat, lon) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&timezone=auto&wind_speed_unit=ms&forecast_days=3`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        weatherMeta.latitude = data.latitude;
        weatherMeta.longitude = data.longitude;
        weatherMeta.timezone = data.timezone;
        weatherMeta.elevation = data.elevation;

        const times = data.hourly.time;
        const temps = data.hourly.temperature_2m;
        const humidity = data.hourly.relative_humidity_2m;
        const windSpeed = data.hourly.wind_speed_10m;
        const weatherCodes = data.hourly.weather_code;

        weatherData = [];

        for (let i = 0; i < times.length; i++) {
            weatherData.push({
                time: new Date(times[i]),
                temp: temps[i],
                humidity: humidity[i],
                windSpeed: windSpeed[i],
                code: weatherCodes[i]
            });
        }

        currentIndex = new Date().getHours();

        updateLocationDetails();
        updateWeatherCard();

    } catch (error) {
        weatherDisplay.innerHTML = "<p class='error'>Ошибка загрузки погоды</p>";
    }
}

// Вывод информации о месте
function updateLocationDetails() {
    const lat = weatherMeta.latitude.toFixed(4);
    const lon = weatherMeta.longitude.toFixed(4);

    locationDetailsElement.innerHTML = `
        <strong>${weatherMeta.name}</strong><br>
        Координаты: ${lat}, ${lon}<br>
        Часовой пояс: ${weatherMeta.timezone}<br>
        Высота: ${weatherMeta.elevation} м
    `;
}

// Отрисовка карточки погоды
function updateWeatherCard() {
    const item = weatherData[currentIndex];

    if (!item) {
        return;
    }

    const day = item.time.toLocaleDateString("ru-RU", {
        weekday: "long",
        day: "numeric",
        month: "long"
    });

    const time = item.time.toLocaleTimeString("ru-RU", {
        hour: "2-digit",
        minute: "2-digit"
    });

    weatherDisplay.innerHTML = `
        <h2>${day}</h2>
        <div class="weather-icon">${getWeatherIcon(item.code)}</div>
        <p><strong>Время:</strong> ${time}</p>
        <p><strong>Температура:</strong> ${item.temp} °C</p>
        <p><strong>Влажность:</strong> ${item.humidity}%</p>
        <p><strong>Скорость ветра:</strong> ${item.windSpeed} м/с</p>
    `;
}

// Значки погоды по коду Open-Meteo
function getWeatherIcon(code) {
    if (code === 0) {
        return "☀️";
    }

    if (code === 1 || code === 2) {
        return "🌤️";
    }

    if (code === 3) {
        return "☁️";
    }

    if (code === 45 || code === 48) {
        return "🌫️";
    }

    if (
        code === 51 || code === 53 || code === 55 ||
        code === 61 || code === 63 || code === 65 ||
        code === 80 || code === 81 || code === 82
    ) {
        return "🌧️";
    }

    if (
        code === 71 || code === 73 || code === 75 ||
        code === 77 || code === 85 || code === 86
    ) {
        return "❄️";
    }

    if (code === 95 || code === 96 || code === 99) {
        return "⛈️";
    }

    return "🌡️";
}

// Кнопка назад
function showPrev() {
    currentIndex--;

    if (currentIndex < 0) {
        currentIndex = weatherData.length - 1;
    }

    updateWeatherCard();
}

// Кнопка вперёд
function showNext() {
    currentIndex++;

    if (currentIndex >= weatherData.length) {
        currentIndex = 0;
    }

    updateWeatherCard();
}

// Поиск города
async function searchCity() {
    const city = document.getElementById("city-search").value.trim();

    if (city === "") {
        alert("Введите название города");
        return;
    }

    locationDetailsElement.innerHTML = `<strong>Ищем город: ${city}...</strong>`;

    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=ru`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.results && data.results.length > 0) {
            const result = data.results[0];

            weatherMeta.name = result.name;

            fetchWeather(result.latitude, result.longitude);
        } else {
            alert("Город не найден");
            locationDetailsElement.innerHTML = "Город не найден";
        }

    } catch (error) {
        alert("Ошибка поиска города");
        locationDetailsElement.innerHTML = "Ошибка поиска города";
    }
}