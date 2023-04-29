

let dateNow = new Date();
let formattedDate = formatDate(dateNow);
function formatDate(date) {
 let days = [
   "Sun",
   "Mon",
   "Tue",
   "Wed",
   "Thu",
   "Fri",
   "Sat"
 ];

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
    let currentDay = days[date.getDay()];
    let currentMonth = months[date.getMonth()];
    let currentDate = date.getDate();
    let currentHour = date.getHours();
    if (currentHour < 10) {
        currentHour = `0${currentHour}`;
    }
    let currentMinutes = date.getMinutes();
    if (currentMinutes < 10) {
        currentMinutes = `0${currentMinutes}`;
    }

    return {
        currentDate,
        currentMonth,
        currentYear,
        currentDay,
        currentHour,
        currentMinutes
    };
}

let date = document.querySelector("#date");
let dayTime = document.querySelector("#day-time");

date.innerHTML = `${formattedDate.currentDate} ${formattedDate.currentMonth}, ${formattedDate.currentYear}`;
dayTime.innerHTML = `${formattedDate.currentDay} at ${formattedDate.currentHour}:${formattedDate.currentMinutes}`;





function changeCelcius (event) {
    event.preventDefault();
    let tempC = document.querySelector("#temp");
    tempC.innerHTML = 25 ;
}

function changeFahrenheight(event) {
    event.preventDefault();
    let tempF = document.querySelector("#temp");
    let testCelciusTemp = 25; 
    tempF.innerHTML = Math.round((testCelciusTemp * 9)/5+32);
}


let celciusTemp = document.querySelector("#celcius-link");
celciusTemp.addEventListener("click", changeCelcius);
let testCelciusTemp = 25; 


let fahrenheightTemp = document.querySelector("#fahrenheit-link");
fahrenheightTemp.addEventListener("click", changeFahrenheight);

//Challenge API wk 5

let apiKey = "5f472b7acba333cd8a035ea85a0d4d4c";
let units = "metric";
let locationInput = document.querySelector("#locationInput");
let h2 = document.querySelector("h2");
let temper = document.querySelector("#temp");
let searchWeather = document.querySelector("#search-weather");
let nearMeButton = document.querySelector("#buttonNearMe")
let visibility = document.querySelector("#current-visibility");
let humidity = document.querySelector("#current-humidity");
let windSpeed = document.querySelector("#current-windSpeed");
let maxTemp = document.querySelector("#maxTemp");
let minTemp = document.querySelector("#minTemp");
let alert = document.getElementById("alertButton");


function searchCity(event) {
    event.preventDefault();
    let city = locationInput.value; // was wanting to use`${response.data.name}`; for the display city name // match up entered city to look up cities to find the API. 
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`;
    axios.get(apiUrl).then(showTemperature);
    h2.innerHTML = city;
}  

searchWeather.addEventListener("submit", searchCity);
    
function findPosition(position) {
    navigator.geolocation.getCurrentPosition(function (position) {
    
        let latitude = position.coords.latitude;
        let longitude = position.coords.longitude;
        let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${units}`;
        axios.get(apiUrl).then(showTemperature);

    });
}

nearMeButton.addEventListener("click", findPosition);

function showTemperature (response) {
 let temperature = Math.round(response.data.main.temp);
    temper.innerHTML = `${temperature}`;
    h2.innerHTML = `${response.data.name}`;
    maxTemp.innerHTML = `${Math.round(response.data.main.temp_max)}°C`;
    minTemp.innerHTML = `${Math.round(response.data.main.temp_min)}°C`;
    let visibilityData = response.data.visibility / 1000;
    let visibilityKm = visibilityData.toFixed(2); // show visibility in 2 decimal places
    visibility.innerHTML = `${visibilityKm} km`;
    humidity.innerHTML = `${response.data.main.humidity} %`;
    windSpeed.innerHTML = `${response.data.wind.speed} km/h`;
}
//was going to try and put in an alert popup with the weather conditions but might do it later. 
//function alertPopup(response) {
//    let conditions = response.data.weather[0].main;
//    window.alert(`It is ${conditions}`);
//}
//alert.addEventListener("click", function() { 
//    axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${locationInput.value}&appid=${apiKey}&units=${units}`)
//    .then(alertPopup)
//});

