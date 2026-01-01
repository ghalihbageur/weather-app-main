# Frontend Mentor - Weather app solution

[Visit this site](https://ghalihbageur.github.io/weather-app-main/)

This is a solution to the [Weather app challenge on Frontend Mentor](https://www.frontendmentor.io/challenges/weather-app-K1FhddVm49). Frontend Mentor challenges help you improve your coding skills by building realistic projects. 

## Table of contents

- [Overview](#overview)
  - [The challenge](#the-challenge)
  - [Screenshot](#screenshot)
  - [Links](#links)
- [My process](#my-process)
  - [Built with](#built-with)
  - [What I learned](#what-i-learned)
  - [Continued development](#continued-development)
  - [Useful resources](#useful-resources)
- [Author](#author)

## Overview

### The challenge

Users should be able to:

- Search for weather information by entering a location in the search bar
- View current weather conditions including temperature, weather icon, and location details
- See additional weather metrics like "feels like" temperature, humidity percentage, wind speed, and precipitation amounts
- Browse a 7-day weather forecast with daily high/low temperatures and weather icons
- View an hourly forecast showing temperature changes throughout the day
- Switch between different days of the week using the day selector in the hourly forecast section
- Toggle between Imperial and Metric measurement units via the units dropdown 
- Switch between specific temperature units (Celsius and Fahrenheit) and measurement units for wind speed (km/h and mph) and precipitation (millimeters) via the units dropdown
- View the optimal layout for the interface depending on their device's screen size
- See hover and focus states for all interactive elements on the page

### Screenshot

![](./preview.png)

### Links

- Solution URL: [Github Code](https://github.com/ghalihbageur/weather-app-main)
- Live Site URL: [Weather App](https://ghalihbageur.github.io/weather-app-main/)

## My process

### Built with

- Semantic HTML5 markup
- Tailwind CSS
- Vanila Javascript

### What I learned

I learn how to fetch API via link from open-meteo.com and adjust link with the data that user want to. This is enough challanging because there are a fiture search suggestion that show realtimely all location. I finish this challange with Debounce method, that fetch API if user in half second don't type with setTimeout() and clearTimeout(), so don't waste limit API.

```js
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
```

<!-- Indonesia:
Saya belajar mengambil API melalui link open-meteo.com dan mengubah linknya sesuai data yang diinginkan user. Ini cukup menantang karena terdapat fitur search suggestion yang menampilkan semua lokasi secara realtime. Saya menyelesaikannya dengan teknik Debounce, yaitu mengambil API jika user selama setengah detik tidak mengetik menggunakan setTimeout() dan clearTimeout(), sehingga tidak menghamburkan batas pengambilan API. -->

This is first time I use Tailwind CSS. I learn the fundamental like make @theme and @compenent. I also use dataset for name, value, and state of dropdown item. So, I make a dropdown that can be used again.

<!-- Indonesia:
Ini juga adalah pertama kalinya saya menggunakan Tailwind CSS. Saya mempelajari dasar-dasarnya seperti pembuatan @theme dan @compenent. Saya juga menggunakan dataset untuk nama, nilai, dan status item dropdown, misalnya secara berurutan temperature, celcius, dan aktif, sehingga menciptakan dropdown yang bisa digunakan kembali. -->



### Continued development

<!-- Selanjutnya saya akan mempelajari Aria untuk Aksesibilitas dan React. Sejujurnya, Aksesibilitas adalah salah satu unsur yang sulit untuk diterapkan karena saya tidak melihatnya langsung.
Situs ini bisa ditingkatkan lebih lanjut dengan mengecek secara otomatis lokasi pengguna.  -->
Next, I will learn ARIA for accessibilty and React. Actually, Accessibility is one of thing that hard to implement because I don't see directly.
This site can be developed further by checking automatically user location

### Useful resources

- [Open Meteo](https://open-meteo.com) - This give me full documentation and help me know weather-icon code to be converted to img.
<!-- Ini memberikan dokumentasi lengkap dan membantuku mengetahui arti kode weather-icon untuk diubah ke img. -->
- [Tailwindcss](https://tailwindcss.com/) - This help me understand fundamental Tailwind like how Tailwind work and how to start.
<!-- Ini membantuku memahami dasar-dasar Tailwind dan memulainya. -->
- [Gemini](https://gemini.google.com/) - This help me understand new concept and repair many bug.
<!-- Ini membantuku memahami konsep baru dan memperbaiki bug. -->

## Author

- Github - [@ghalihbageur](https://github.com/ghalihbageur/)
- Linkedin - [Mohammad Wenning Ghalih](https://www.linkedin.com/in/ghalihbageur/)
- Frontend Mentor - [@ghalihbageur](https://www.frontendmentor.io/profile/yourusername)
