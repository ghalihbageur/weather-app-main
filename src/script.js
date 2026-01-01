const errorEl = document.getElementById('errorAPI');
const headerEl = document.getElementsByTagName('header');
const sectionEl = document.querySelectorAll('section');
const itemDropdown = document.querySelectorAll('.item-dropdown');
const dateNowEl = document.getElementById('date-now');
const temperatureEl = document.getElementById('temperature');
const feelsEl = document.getElementById('feels');
const humadityEl = document.getElementById('humadity');
const windEl = document.getElementById('wind');
const precipitationEl = document.getElementById('precipitation');
const dailyEl = document.getElementById('daily');
const hourlyEl = document.getElementById('hourly');
const hourlySetDay = document.getElementById('hourly-set-day');
const searchInput = document.getElementById('search-input');
const searchSuggestion = document.getElementById('search-suggestion');
const locationEl = document.getElementById('location');
const nameDay = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const fullnameDay = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const optionTime = {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
}
const loadingContent = document.querySelectorAll('.loading-content');
const dashboardContent = document.querySelectorAll('.dashboard-content');

let now = new Date();
let timer;
let data;
let suggestion;
let setting;


if(!localStorage.getItem('setting')){
    setting = {
        day: now.getDay(),
        temperature: 'celsius',
        windspeed: 'kmh',
        precipitation: 'mm',
        lati: 52.52,
        longi: 13.41,
        name: 'Berlin',
        country: 'Germany'
    };
    localStorage.setItem('setting', JSON.stringify(setting));
} else {
    setting = JSON.parse(localStorage.getItem('setting'));
}

loadingState(true);
fetchWeather(setting.lati, setting.longi, setting.name, setting.country);

window.addEventListener('beforeunload', () => {
    localStorage.setItem('setting', JSON.stringify(setting));
})

searchInput.addEventListener('input', (e) => {
    const event = e.currentTarget;
    clearTimeout(timer);
    timer = setTimeout(async () => {
        if(event.value.length > 2){
            try {
                const respond = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${event.value}&count=10&language=en&format=json`);
                suggestion = await respond.json();
                displaySuggestion();
            } catch(error) {
                errorHandle(error);
            }
        } else {
            searchSuggestion.classList.add('hidden');
        }
        }, 500)
})

function displaySuggestion() {
    searchSuggestion.classList.remove('hidden');
    searchSuggestion.innerHTML = '';
    for(let i in suggestion.results){
        const result = suggestion.results[i];
        const li = document.createElement('li');
        li.classList = "hover:bg-neutral-6 hover:outline-4 hover:rounded-xs hover:outline-neutral-6 cursor-pointer";
        li.innerHTML = `<b>${result.name}</b>, ${result.admin4 ? result.admin4 + ', ' : ''}${result.admin3 ? result.admin3 + ', ' : ''}${result.admin2 ? result.admin2 + ', ' : ''}${result.admin1 ? result.admin1 + ', ' : ''}${result.country}`;
        li.addEventListener('click', () => {
            setting.lati = result.latitude;
            setting.longi = result.longitude;
            setting.name = result.name;
            setting.country = result.country;
            fetchWeather(setting.lati, setting.longi, setting.name, setting.country); 
            searchInput.value = '';
        })
        searchSuggestion.appendChild(li);
        // searchSuggestion.innerHTML += `<li onclick="fetchWeather(${result.latitude}, ${result.longitude}, '${result.name}', '${result.country}'); searchInput.value = '';"  class="hover:bg-neutral-6 hover:outline-4 hover:rounded-xs hover:outline-neutral-6"><b>${result.name}</b>, ${result.admin4 ? result.admin4 + ', ' : ''}${result.admin3 ? result.admin3 + ', ' : ''}${result.admin2 ? result.admin2 + ', ' : ''}${result.admin1 ? result.admin1 + ', ' : ''}${result.country}</li>`;
    }
}

async function fetchWeather(lati = 52.52, longi = 13.41, name = 'Berlin', country = 'Germany') {
    try {
        const respond = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lati}&longitude=${longi}&daily=temperature_2m_max,temperature_2m_min,weather_code&hourly=temperature_2m,weather_code&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&timezone=auto&wind_speed_unit=${setting.windspeed}&temperature_unit=${setting.temperature}&precipitation_unit=${setting.precipitation}`);
        data = await respond.json();
        console.log(data);
        showWeather(name, country);
        showDailyForecast();
        changeDay();
        loadingState(false);
    } catch(error) {
        errorHandle(error);
    }
}

function errorHandle(error) {
    console.log('gagal mengambil data', error);
        headerEl[0].classList.add('hidden');
        errorEl.classList.replace('hidden', 'flex');
        dashboardContent.forEach(dash => {
            dash.classList.add('hidden');
        })
        loadingContent.forEach(dash => {
            dash.classList.add('hidden');
        })
}

function showWeather(name, country) {
    now = new Date(data.current.time);
    temperatureEl.innerHTML = data.current.temperature_2m + '°';
    feelsEl.innerHTML = data.current.apparent_temperature;
    humadityEl.innerHTML = data.current.relative_humidity_2m + '%';
    windEl.innerHTML = data.current.wind_speed_10m + ((setting.windspeed == 'kmh') ? ' km/h' : ' mph');
    precipitationEl.innerHTML = data.current.precipitation + ((setting.precipitation == 'mm') ? ' mm' : ' inch');
    locationEl.innerHTML = name+', '+country;
    dateNowEl.innerHTML = now.toLocaleDateString('en-US', optionTime);
}

function showDailyForecast() {
    dailyEl.innerHTML = '';
    hourlySetDay.innerHTML = '';
    data.daily.time.forEach((date, idx) => {
        const d = new Date(date);
        dailyEl.innerHTML += 
        `<div class="bg-neutral-8 border-neutral-6 border py-3 px-2 rounded-lg flex flex-col text-center gap-2">
            <p class="text-sm">${nameDay[d.getDay()]}</p>
            <img src="${createIconWeather(data.daily.weather_code[idx])}" class="w-11 m-auto" alt="">
            <div class="flex text-xs justify-between">
            <p>${data.daily.temperature_2m_max[idx]}°</p>
            <p>${data.daily.temperature_2m_min[idx]}°</p>
            </div>
        </div>`;
        hourlySetDay.innerHTML += 
        `<li class="item-dropdown group" data-active="${(setting.day === d.getDay())}" data-value="${d.getDay()}" data-name="day">${fullnameDay[d.getDay()]}</li>`;
    })
}

function changeDay() {
    hourlyEl.innerHTML = '';
    data.hourly.time.forEach((hour, idx) => {
        const h = new Date(hour);
        if(setting.day == h.getDay()) {
            hourlyEl.innerHTML += 
            `<div class="p-2 bg-neutral-7 border border-neutral-6 rounded-md flex items-center gap-2">
                <img src="${createIconWeather(data.hourly.weather_code[idx])}" class="w-7" alt="">
                <h4 class="text-sm flex-auto">${setTo12Hour(h.getHours())}</h4>
                <p class="text-xs">${data.hourly.temperature_2m[idx]}°</p>
            </div>`;
        }
    })
    document.getElementById('dayButton').innerHTML = fullnameDay[setting.day] + '<img src="assets/images/icon-dropdown.svg" alt="" class="w-2">';
}

function setTo12Hour(hour) {
    if(hour < 12) {
        return hour + ' AM';
    } else {
        return (hour-12) + ' PM';
    }
}

window.addEventListener('click', (e) => {
    const dropdownMenu = document.querySelectorAll('.dropdown-menu');
    const dropdownButton = e.target.closest('.dropdown-button');
    const isCurrDropdownMenu = e.target.closest('.dropdown-menu');
    const currItemDropdown = e.target.closest('.item-dropdown')

    if(currItemDropdown) {
        const dataNameItem = currItemDropdown.dataset.name;
        const itemDropdown = document.querySelectorAll(`.item-dropdown[data-name=${dataNameItem}]`);

        itemDropdown.forEach(item => {
            item.dataset.active = 'false';
            currItemDropdown.dataset.active = 'true';
        })
        
        if(setting[currItemDropdown.dataset.name] !== currItemDropdown.dataset.value){
            setting[currItemDropdown.dataset.name] = currItemDropdown.dataset.value;
            console.log(setting[currItemDropdown.dataset.name])
            if(currItemDropdown.dataset.name === 'day') {
                changeDay();
            } else {
                fetchWeather(setting.lati, setting.longi, setting.name, setting.country);
            }
        }
    }

    if(dropdownButton) {
        const currMenu = dropdownButton.nextElementSibling;
        currMenu.classList.toggle('hidden');

        dropdownMenu.forEach(dd => {
            if(currMenu != dd) dd.classList.add('hidden');
        })
    } else if(!isCurrDropdownMenu){
        dropdownMenu.forEach(dd => {
            dd.classList.add('hidden');
        })
        searchSuggestion.classList.add('hidden');
    }
})

function createIconWeather(x) {
    switch (x) {
        case 51:
        case 53:
        case 55:
            return "assets/images/icon-drizzle.webp"
        case 45:
        case 48:
            return "assets/images/icon-fog.webp"
        case 0:
            return "assets/images/icon-sunny.webp"
        case 1:
        case 2:
        case 3:
            return "assets/images/icon-partly-cloudy.webp"
        case 61:
        case 63:
        case 65:
        case 80:
        case 81:
        case 82:
            return "assets/images/icon-rain.webp"
        case 71:
        case 73:
        case 75:
        case 77:
        case 56:
        case 57:
        case 66:
        case 67:
        case 85:
        case 86:
            return "assets/images/icon-snow.webp"
        case 95:
        case 96:
        case 99:
            return "assets/images/icon-storm.webp"
    }
}

itemDropdown.forEach(item => {
    if (item.dataset.name === 'temperature'){
        (item.dataset.value === setting.temperature) ? item.dataset.active = true : item.dataset.active = false;
    }
    if (item.dataset.name === 'windspeed'){
        (item.dataset.value === setting.windspeed) ? item.dataset.active = true : item.dataset.active = false;
    }
    if (item.dataset.name === 'precipitation'){
        (item.dataset.value === setting.precipitation) ? item.dataset.active = true : item.dataset.active = false;
    }
    if (item.dataset.name === 'day'){
        (item.dataset.value === setting.day) ? item.dataset.active = true : item.dataset.active = false;
    }
})

function loadingState(isLoading){
    if(isLoading) {
        dashboardContent.forEach(dash => {
            dash.classList.add('hidden');
        })
        loadingContent.forEach(dash => {
            dash.classList.remove('hidden');
        })
    } else {
        dashboardContent.forEach(dash => {
            dash.classList.remove('hidden');
        })
        loadingContent.forEach(dash => {
            dash.classList.add('hidden');
        })
    }
}