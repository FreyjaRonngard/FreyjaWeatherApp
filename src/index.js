
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

let apiKey = "5f472b7acba333cd8a035ea85a0d4d4c";
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
let iconForecast = document.querySelector ("#icon-forecast")
let units = "metric"; // default to Celsius
let tempC = null;
let tempCMax = null;
let tempCMin = null;
let weatherForecast = document.querySelector("#weather-forecasts");
let forecastHtml = "";
let forecastMax = document.querySelector("#forecast-max");
let forecastMin = document.querySelector("#forecast-min");
let tempForecastCMin = null;
let tempForecastCMax = null;


// will try to fix the farenheight and celsius conversion with the imperial metric later....

function formatDay(timestamp) {
    let date = new Date(timestamp * 1000);
    let dayIndex = date.getDay(); // Get day index (0-7) of timestamp
    return days[dayIndex];
}

function showForecast(response) {
    let dailyForecast = response.data.daily;
    forecastHtml = ""; // clear previous forecast cards
    
    dailyForecast.forEach (function (daysForecast, index) {
    if ( index > 0 && index < 7 ) {  // only show next 6 days (starting from tomorrow)
        tempForecastCMin = Math.round(daysForecast.temp.min);
        tempForecastCMax = Math.round(daysForecast.temp.max);
        forecastHtml = forecastHtml + `
     <div class="col-2">
        <div class="card-group">
            <div class="card card-weather card-body ">
                <h5 class="card-title ">
                    <img src= "https://openweathermap.org/img/wn/${daysForecast.weather[0].icon}@2x.png" alt="" class="forecast-icon" id= "icon-forecast">
                </h5>
                <h5 class="forecast-day">
                    ${formatDay(daysForecast.dt)}
                </h5>
                    <p class="card-text forecast-temps">
                        <strong class="bold-temperature forecast-max" id= "forecast-max"> 
                            ${tempForecastCMax}° 
                        </strong>
                        <span class="forecast-min" id= "forecast-min">
                            | ${tempForecastCMin}° 
                        </span>
                    </p>
            </div>
        </div>
    </div>`;}
    });
    weatherForecast.innerHTML = forecastHtml ; // set the HTML of the forecast container

}

function showTemperature(response) {
    tempC = Math.round(response.data.main.temp);
    temperature.innerHTML = tempC;
    h2.innerHTML = response.data.name;
    tempCMax = Math.round(response.data.main.temp_max);
    maxTemp.innerHTML = `${tempCMax}°C`; // need to apply to change unit of measurement from C to F 
    tempCMin = Math.round(response.data.main.temp_min);
    minTemp.innerHTML = `${tempCMin}°C`;
    
    date.innerHTML = formatDate(new Date(response.data.dt * 1000));
    dayTime.innerHTML = formatDayTime(new Date(response.data.dt * 1000));
   
    description.innerHTML = response.data.weather[0].description;
    let visibilityData = response.data.visibility / 1000;
    let visibilityKm = visibilityData.toFixed(2); // show visibility in 2 decimal places
    visibility.innerHTML = `${visibilityKm} km`;
    humidity.innerHTML = `${response.data.main.humidity} %`;
    windSpeed.innerHTML = `${response.data.wind.speed} km/h`;
    icon.setAttribute("src", `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`); //  working!!! but would like to update the icons soon
    icon.setAttribute("alt", response.data.weather[0].description);
    getWeatherForecast(response.data.coord);

}


function search(city) {
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`;
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
    let apiKey = `cd173a006b0e51dac58c6d8064c94178`;
    let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=${units}`;
    axios.get(apiUrl).then(showForecast);
}

function findPosition(position) {
    navigator.geolocation.getCurrentPosition(function (position) {
        let latitude = position.coords.latitude;
        let longitude = position.coords.longitude;
        let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${units}`;
        axios.get(apiUrl).then(showTemperature);
        console.log(apiUrl);
    });
}
nearMeButton.addEventListener("click", findPosition);

search("Melbourne");
