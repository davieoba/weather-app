const inputElement = document.querySelector(".city-input");
const list = document.querySelector(".prediction");

const getCountries = async function () {
  const countries = await fetch("./countries.json");

  const data = await countries.json();

  return data;
};

// filter the elements in the array that matches the input value

const filter1 = async function (input) {
  const getCountry = await getCountries();

  // console.log(getCountry);
  const country = getCountry.filter((el) => {
    if (el.country.toLowerCase().startsWith(input)) {
      list.innerHTML = "";
      return el.country;
    } else {
      return;
    }
  });

  // console.log(country);
  const filterCountry = country.map((el) => {
    return `<p class="country">${el.country}</p>`;
  });
  // console.log(filterCountry);
  filterCountry.forEach((el) => {
    list.insertAdjacentHTML("beforeend", el);
  });
};

// get the input value
inputElement.addEventListener("input", function (e) {
  if (inputElement.value !== "") {
    const input = inputElement.value.toLowerCase().trim();
    list.style.display = "block";
    filter1(input);
  } else {
    list.style.display = "none";
  }
});

// const nav = document.querySelector(".nav");

// console.log(typeof nav.textContent);

list.addEventListener("click", (e) => {
  if (e.target.classList.contains("country")) {
    const input = e.target.textContent;
    console.log(input);
    inputElement.value = input;
    list.style.display = "none";
  }
});

//// the api weather prediction code
const form = document.querySelector("form");
const html = document.querySelector(".html");

// create an api key from accuweather and put it here
const apiKey = "";

const getCity = async function (city) {
  const citydets = await fetch(
    `http://dataservice.accuweather.com/locations/v1/cities/search?apikey=${apiKey}&q=${city}`
  );
  let data = await citydets.json();

  console.log(data[0]);
  return data[0];
};

getWeatherConditions = async function (citykey) {
  const weatherDets = await fetch(
    `http://dataservice.accuweather.com/currentconditions/v1/${citykey}?apikey=${apiKey}`
  );
  let data = await weatherDets.json();
  return data;
};

//// note: the form code
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const usercity = inputElement.value.toLowerCase().trim();
  form.reset();

  updateCity(usercity)
    .then((data) => {
      updateUI(data);
      // console.log("God is great");
    })
    .catch((err) => {
      console.log(err);
    });
});

const updateCity = async (city) => {
  const cityDets = await getCity(city);
  const weather = await getWeatherConditions(cityDets.Key);

  return {
    cityDets: cityDets,
    weather: weather,
  };
};

const updateUI = (data) => {
  console.log(data);
  html.innerHTML = `
  <div class="degree"><h1>${data.weather[0].Temperature.Metric.Value} <span>${data.weather[0].Temperature.Metric.Unit} </span></h1></div>
  <div class="img"><img src="cloud.jpg" alt="weather image" /></div>
  <div class="date"><h2>${data.weather[0].WeatherText}</h2></div>
  <div class="city"><h3>${data.cityDets.EnglishName}</h3></div>
  `;
};
