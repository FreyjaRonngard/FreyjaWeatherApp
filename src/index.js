

let dateNow = new Date();
let formattedDate = formatDate(dateNow); // this might be obsolete
function formatDate(date) {
  
    let months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ];

    let currentYear = date.getFullYear();
    let currentMonth = months[date.getMonth()];
    let currentDate = date.getDate();
   
    return `${currentDate} ${currentMonth}, ${currentYear}`;
}

let date = document.querySelector("#date");

let days = [
        "Sun",
        "Mon",
        "Tue",
        "Wed",
        "Thu",
        "Fri",
        "Sat"
    ];

let formattedDayTime = formatDayTime(dateNow); // this might be obsolete
function formatDayTime(date) {
    
    let currentDay = days[date.getDay()];
     let currentHour = date.getHours();
    if (currentHour < 10) {
        currentHour = `0${currentHour}`;
    }
    let currentMinutes = date.getMinutes();
    if (currentMinutes < 10) {
        currentMinutes = `0${currentMinutes}`;
    }
    return `${currentDay} at ${currentHour}:${currentMinutes}`;
}

let dayTime = document.querySelector("#day-time");

// Day and Time functions above ^^ API calls below 

let apiKey = `83d754d0e41cf2t0a70abc3ofd8492c8`; // removed old open weather app API key "5f472b7acba333cd8a035ea85a0d4d4c";
let cityInput = document.querySelector("#locationInput");
let h2 = document.querySelector("h2");
let temperature = document.querySelector("#temp");
let searchWeather = document.querySelector("#search-weather");
let description = document.querySelector("#weather-description");
let nearMeButton = document.querySelector("#buttonNearMe")
let visibility = document.querySelector("#current-visibility");
let humidity = document.querySelector("#current-humidity");
let windSpeed = document.querySelector("#current-windSpeed");
let maxTemp = document.querySelector("#maxTemp");
let minTemp = document.querySelector("#minTemp");
let icon = document.querySelector("#icon");
let units = "metric"; // default to Celsius
let tempC = null;
let tempCMax = null;
let tempCMin = null;
let weatherForecast = document.querySelector("#weather-forecasts");
let forecastHtml = "";

function formatDay(timestamp) {
    let dateIndex = new Date(timestamp * 1000);
    let dayIndex = dateIndex.getDay(); // Get day index (0-6) of timestamp
    return days[dayIndex];
}


function showForecast(response) {
    let dailyForecast = response.data.daily ;
    dailyForecast.forEach (function (daysForecast, index) {
    if ( index < 6 ) {  // only show next 6 days (starting from tomorrow)
        forecastHtml = forecastHtml + `
     <div class="col-2">
        <div class="card-group">
            <div class="card card-weather card-body ">
                <h5 class="card-title ">
                    <img src="${daysForecast.condition.icon_url}" alt="${daysForecast.condition.description}" class="forecast-icon">
                </h5>
                <h5 class="forecast-day">
                    ${formatDay(daysForecast.time)}
                </h5>
                    <p class="card-text forecast-temps">
                        <strong class="bold-temperature forecast-max"> 
                            ${Math.round(daysForecast.temperature.maximum)}° 
                        </strong>
                        <span class="forecast-min">
                            | ${Math.round(daysForecast.temperature.minimum)}° 
                        </span>
                    </p>
            </div>
        </div>
    </div>`; }
    });
    weatherForecast.innerHTML = forecastHtml ;

}

function showTemperature(response) {
    console.log(response.data);
    tempC = Math.round(response.data.temperature.current);
    temperature.innerHTML = tempC;
    h2.innerHTML = response.data.city;
    tempCMax = Math.round(response.data.temperature.maximum);
    maxTemp.innerHTML = `${tempCMax}°C`; // need to apply to change unit of measurement from C to F 
    tempCMin = Math.round(response.data.temperature.minimum);
    minTemp.innerHTML = `${tempCMin}°C`;
    
    date.innerHTML = formatDate(new Date(response.data.dt * 1000));
    dayTime.innerHTML = formatDayTime(new Date(response.data.dt * 1000));
   
    description.innerHTML = response.data.condition.description;
    let visibilityData = response.data.visibility / 1000;
    let visibilityKm = visibilityData.toFixed(2); // not available now in the she codes data
    visibility.innerHTML = `${visibilityKm} km`;
    humidity.innerHTML = `${response.data.temperature.humidity} %`;
    windSpeed.innerHTML = `${response.data.wind.speed} m/s`;
    icon.setAttribute("src", response.data.condition.icon_url); //  working!!! but would like to update the icons soon `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png
    icon.setAttribute("alt", response.data.condition.description);
    getWeatherForecast(response.data.coordinates);
}


function search(city) {
    let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=${units}`;  // removed old open weather apiurl `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`;
    axios.get(apiUrl).then(showTemperature);
    console.log(apiUrl);
}  
function formSubmit(event) {
    event.preventDefault();
    search(cityInput.value)
}
searchWeather.addEventListener("submit", formSubmit);
//come back here

function getWeatherForecast(coordinates) {
    console.log(coordinates)
    let apiKey = `83d754d0e41cf2t0a70abc3ofd8492c8`;
    let apiUrl = `https://api.shecodes.io/weather/v1/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&key=${apiKey}&units=${units}`;// this is the open weather one`https://api.openweathermap.org/data/3.0/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=${units}`;
    axios.get(apiUrl).then(showForecast);
}

function findPosition(position) {
    navigator.geolocation.getCurrentPosition(function (position) {
        let latitude = position.coordinates.latitude;
        let longitude = position.coordinates.longitude;
        let apiUrl = `https://api.shecodes.io/weather/v1/current?lon=${longitude}&lat=${latitude}&key=${apiKey}&units=${units}`;  // removed the open weather api`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${units}`;
        axios.get(apiUrl).then(showTemperature);
        console.log(apiUrl);
    });
}
nearMeButton.addEventListener("click", findPosition);


function showCelsius(event) {
    event.preventDefault();
    celsiusLink.classList.add("active");
    fahrenheitLink.classList.remove("active");
    temperature.innerHTML = tempC;
    maxTemp.innerHTML = `${tempCMax}°C`; // need to apply to change unit of measurement from C to F 
    minTemp.innerHTML = `${tempCMin}°C`;
}
function showFahrenheit(event) {
    event.preventDefault();
    celsiusLink.classList.remove("active");
    fahrenheitLink.classList.add("active")
    let tempF = Math.round((tempC*9)/5+32);
    temperature.innerHTML = tempF
    //need to find a way to revert it back again to c
    let tempFMax = Math.round((tempCMax*9)/5+32);
    maxTemp.innerHTML = `${tempFMax}°F`; // need to apply to change unit of measurement from C to F 
    let tempFMin = Math.round((tempCMin * 9) / 5 + 32);
    minTemp.innerHTML = `${tempFMin}°F`;
}


let celsiusLink = document.querySelector("#celcius-link");
celsiusLink.addEventListener("click", showCelsius);

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", showFahrenheit);
// will need to apply more to the rest of the temperature.

search("Melbourne");




