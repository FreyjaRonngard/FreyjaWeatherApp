

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



let formattedDayTime = formatDayTime(dateNow); // this might be obsolete
function formatDayTime(date) {
    let days = [
        "Sun",
        "Mon",
        "Tue",
        "Wed",
        "Thu",
        "Fri",
        "Sat"
    ];

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

//function listenForClicks() {
 //   document.addEventListener("click")} // not finished yet need to check

let units = "metric"; // default to Celsius
let celsiusLink = document.querySelector("#celcius-link");
let fahrenheitLink = document.querySelector("#fahrenheit-link");

function changeUnits(event) {
    event.preventDefault();
    let unitLink = event.target;
    let linkID = unitLink.getAttribute ('id')
      if (linkID === 'celcius-link') {
    units = "metric";
  } else if (linkID === 'fahrenheit-link') {
    units = "imperial";
  }
  
}
 

console.log(celsiusLink); // will print out the element with id="celcius-link"
celsiusLink.addEventListener("click", changeUnits);


console.log(fahrenheitLink); // will print out the element with id="fahrenheit-link"
fahrenheitLink.addEventListener("click", changeUnits);


let apiKey = "5f472b7acba333cd8a035ea85a0d4d4c";

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
//let alert = document.getElementById("alertButton");


function searchCity(event) {
    event.preventDefault();
    let city = locationInput.value; // was wanting to use`${response.data.name}`; for the display city name // match up entered city to look up cities to find the API. 
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`;
    axios.get(apiUrl).then(showTemperature);
    h2.innerHTML = city;
    console.log(apiUrl);
}  

searchWeather.addEventListener("submit", searchCity);
    
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

function showTemperature (response) {
    let temperature = Math.round(response.data.main.temp);
    temper.innerHTML = `${temperature}`;
    h2.innerHTML = `${response.data.name}`;
    maxTemp.innerHTML = `${Math.round(response.data.main.temp_max)}°C`;
    minTemp.innerHTML = `${Math.round(response.data.main.temp_min)}°C`;
    
    date.innerHTML = formatDate(new Date(response.data.dt * 1000));
    dayTime.innerHTML = formatDayTime(new Date(response.data.dt * 1000));
   
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

