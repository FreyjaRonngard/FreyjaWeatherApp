

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
let units = "metric"; // default to Celsius
let tempC = null;
let tempCMax = null;
let tempCMin = null;
let weatherForecast = document.querySelector("#weather-forecasts");
let forecastHtml = "";

function showForecast(response) {
    console.log(response.data);
    days.forEach (function (day) {
        forecastHtml = forecastHtml + `
     <div class="col-2">
        <div class="card-group">
            <div class="card card-weather card-body ">
                <h5 class="card-title ">
                    <img src="media/cloudysun-icon.png" alt="" class="forecast-icon">
                </h5>
                <h5 class="forecast-day">
                    ${day}
                </h5>
                    <p class="card-text forecast-temps">
                        <strong class="bold-temperature forecast-max"> 
                            17° 
                        </strong>
                        <span class="forecast-min">
                            | 9° 
                        </span>
                    </p>
            </div>
        </div>
    </div>`;
    });
    weatherForecast.innerHTML = forecastHtml ;

}

function showTemperature(response) {
    console.log(response.data);
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
    let apiKey = `83d754d0e41cf2t0a70abc3ofd8492c8`;
    let apiUrl = `https://api.shecodes.io/weather/v1/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&key=${apiKey}&units=${units}`// this is the open weather one`https://api.openweathermap.org/data/3.0/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=${units}`;
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


//was going to try and put in an alert popup with the weather conditions but might do it later.
//function alertPopup(response) {
//    let conditions = response.data.weather[0].main;
//    window.alert(`It is ${conditions}`);
//}
//alert.addEventListener("click", function() {
//    axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city.value}&appid=${apiKey}&units=${units}`)
//    .then(alertPopup)
//});



