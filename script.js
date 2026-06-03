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

// Если геолокация запрещена — Москва
function useDefaultCity() {
    weatherMeta.name = "Москва";
    fetchWeather(defaultCoords.lat, defaultCoords.lon);
}

// Запрос прогноза по дням
async function fetchWeather(lat, lon) {
    const url =
        "https://api.open-meteo.com/v1/forecast" +
        "?latitude=" + lat +
        "&longitude=" + lon +
        "&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,sunrise,sunset,daylight_duration,precipitation_sum,wind_speed_10m_max" +
        "&hourly=relative_humidity_2m,pressure_msl" +
        "&timezone=auto" +
        "&wind_speed_unit=ms" +
        "&forecast_days=7";

    try {
        const response = await fetch(url);
        const data = await response.json();

        weatherMeta.latitude = data.latitude;
        weatherMeta.longitude = data.longitude;
        weatherMeta.timezone = data.timezone;

        weatherData = [];

        for (let i = 0; i < data.daily.time.length; i++) {
            const date = data.daily.time[i];

            // Берём влажность и давление примерно на 12:00 этого дня
            const hourIndex = data.hourly.time.indexOf(date + "T12:00");

            let humidity = "—";
            let pressure = "—";

            if (hourIndex !== -1) {
                humidity = data.hourly.relative_humidity_2m[hourIndex];

                // Open-Meteo даёт давление в гПа, переводим примерно в мм рт. ст.
                pressure = Math.round(data.hourly.pressure_msl[hourIndex] * 0.75);
            }

            weatherData.push({
                date: date,
                code: data.daily.weather_code[i],
                tempMax: Math.round(data.daily.temperature_2m_max[i]),
                tempMin: Math.round(data.daily.temperature_2m_min[i]),
                feelsLike: Math.round(data.daily.apparent_temperature_max[i]),
                sunrise: data.daily.sunrise[i],
                sunset: data.daily.sunset[i],
                daylight: data.daily.daylight_duration[i],
                rain: data.daily.precipitation_sum[i],
                wind: data.daily.wind_speed_10m_max[i],
                humidity: humidity,
                pressure: pressure
            });
        }

        currentIndex = 0;

        updateLocationDetails();
        updateWeatherCard();

    } catch (error) {
        weatherDisplay.innerHTML = "<p>Ошибка загрузки погоды</p>";
    }
}

// Информация о месте
function updateLocationDetails() {
    locationDetailsElement.innerHTML = `
        <strong>${weatherMeta.name}</strong><br>
        Координаты: ${weatherMeta.latitude.toFixed(4)}, ${weatherMeta.longitude.toFixed(4)}<br>
        Часовой пояс: ${weatherMeta.timezone}
    `;
}

// Отрисовка карточки
function updateWeatherCard() {
    const item = weatherData[currentIndex];

    if (!item) {
        return;
    }

    const day = new Date(item.date).toLocaleDateString("ru-RU", {
        day: "numeric",
        month: "long",
        weekday: "long"
    });

    weatherDisplay.innerHTML = `
        <h2>${day}</h2>

        <div class="weather-icon">${getWeatherIcon(item.code)}</div>

        <p><strong>${getWeatherText(item.code)}</strong></p>
        <p><strong>Температура:</strong> ${item.tempMax}° / ${item.tempMin}°</p>
        <p><strong>Ощущается:</strong> ${item.feelsLike}°</p>
        <p><strong>Восход:</strong> ${getTime(item.sunrise)}</p>
        <p><strong>Закат:</strong> ${getTime(item.sunset)}</p>
        <p><strong>Долгота дня:</strong> ${formatDaylight(item.daylight)}</p>
        <p><strong>Осадки:</strong> ${item.rain} мм</p>
        <p><strong>Ветер:</strong> ${item.wind} м/с</p>
        <p><strong>Влажность:</strong> ${item.humidity}%</p>
        <p><strong>Давление:</strong> ${item.pressure} мм</p>
    `;
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

    locationDetailsElement.innerHTML = "<strong>Ищем город...</strong>";

    const url =
        "https://geocoding-api.open-meteo.com/v1/search?name=" +
        encodeURIComponent(city) +
        "&count=1&language=ru&format=json";

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

// Получить время из строки
function getTime(value) {
    return value.split("T")[1].slice(0, 5);
}

// Перевести секунды в часы и минуты
function formatDaylight(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.round((seconds % 3600) / 60);

    return hours + " ч " + minutes + " мин";
}

// Значок погоды
function getWeatherIcon(code) {
    if (code === 0) return "☀️";
    if (code === 1 || code === 2) return "🌤️";
    if (code === 3) return "☁️";
    if (code === 45 || code === 48) return "🌫️";

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

// Текст погоды
function getWeatherText(code) {
    if (code === 0) return "Ясно";
    if (code === 1 || code === 2) return "Переменная облачность";
    if (code === 3) return "Пасмурно";
    if (code === 45 || code === 48) return "Туман";

    if (
        code === 51 || code === 53 || code === 55 ||
        code === 61 || code === 63 || code === 65 ||
        code === 80 || code === 81 || code === 82
    ) {
        return "Дождь";
    }

    if (
        code === 71 || code === 73 || code === 75 ||
        code === 77 || code === 85 || code === 86
    ) {
        return "Снег";
    }

    if (code === 95 || code === 96 || code === 99) {
        return "Гроза";
    }

    return "Нет данных";
}
