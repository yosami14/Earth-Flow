const endpoints = {
  weather: {
    baseUrl: 'https://api.openweathermap.org/data/2.5/forecast',
    apiKey: '4f944c0231428c0ac6ebf79e36eba04d'
  },
};


  

let countryChoice = 'Addis Ababa';
fetchWeatherData(countryChoice);

$('.searchIcon').click(function() {
  const userChoice = $('.search-input').val();
  if (userChoice !== '') {
    console.log('search Success')
    countryChoice = userChoice;
    fetchWeatherData(countryChoice);
  }
});


function fetchWeatherData(city) {
    const weatherURL = `${endpoints.weather.baseUrl}?q=${city}&appid=${endpoints.weather.apiKey}&units=metric`;
  fetch(weatherURL)
    .then((response) => response.json())
    .then((data) => {
      weatherData(data);
    })
    .catch((error) => {
      console.log("Error:", error);
    });
}

const weatherData = (data) => {

  const listOfWeatherData = data.list;
  const startDate = fixDateInterval(data.list[0].dt_txt);
  const humidityArray = [];
  const tempArray = [];
  const tempMaxArray = [];
  const tempMinArray = [];
  const windArray = [];
  const iconArray = [];
  const xAxis=data.city.coord.lat;
  const yAxis=data.city.coord.lon;
  for (const item of listOfWeatherData) {
      const temp = item.main.temp;
      const humidity = item.main.humidity;
      const wind = item.wind.speed;
      const icons = item.weather[0].icon;
      const maxTemp = item.main.temp_max;
      const minTemp = item.main.temp_min;
      

      humidityArray.push(humidity);
      tempArray.push(temp);
      tempMaxArray.push(maxTemp);
      tempMinArray.push(minTemp);
      windArray.push(wind);
      iconArray.push(icons);
  }

  createMap(xAxis,yAxis)
  createWeatherList(iconArray,tempArray,humidityArray,windArray,startDate,data)
  createHumidityChart(humidityArray, startDate);
  createPressureChart(tempArray, startDate);
  // createTempChart(tempArray, tempMaxArray,tempMinArray,startDate);
};



const createHumidityChart = (allDataValues,date) => {
  chartCreator("humidity", "spline", "Average Weekly Humidity", " ", "datetime", "Wind speed (m/s)", "%", 3, date, "humidity", allDataValues);
};

const createPressureChart = (allDataValues,date) => {
  chartCreator("temprature", "column", "Average Weekly Temprature", " ", "datetime", "Temprature °C", "°C", 3, date, "temp", allDataValues, '#A01E5F');
};

// const createTempChart = (tempArray, tempMaxArray,tempMinArray,startDate) => {
//   chartCreator("temprature", "column", "Average Weekly Temprature", " ", "datetime", "Temprature °C", "°C", 3, date, "temp", allDataValues, '#A01E5F');
// };

let mymap; 
const createMap = (xAxis, yAxis) => {
  // Check if map instance exists
  if (mymap) {
    mymap.remove(); // Remove the existing map instance
  }

  // Create a new map instance
  mymap = L.map($('.weatherMap')[0]).setView([xAxis, yAxis], 10);
  
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
  }).addTo(mymap);
}





const createWeatherList = (iconArray, tempArray, humidityArray, windArray, startDate, data) => {
  const listOfWeatherData = data.list;
  $('.countryName').text(data.city.country);
  $('.cityName').text(data.city.name);
  $('.temp').text(tempArray[0]);
  $('.Humidity').text(humidityArray[0] + "%");
  $('.windSpeed').text(windArray[0].toFixed(1) + " Km/h");
  let WeatherDailyList = $('.WeatherDailyList');
  
  for (let i = 0; i < listOfWeatherData.length; i++) {
    let lists = listOfWeatherData[i];
    let weatherList = $('<div>').addClass('weatherList');
    let date = lists.dt_txt;
    date = date.split(" ")[1].split(":")[0];

    let dateSpan = $('<span>').addClass("dateSpan").text(date);
    let weatherIcon = $('<span>').html(`<img src="https://openweathermap.org/img/wn/${iconArray[i]}@2x.png" alt='${iconArray[i]}'>`)
      .addClass('weatherIcon');

    weatherList.append(dateSpan, weatherIcon);
    WeatherDailyList.append(weatherList);
  }
}





const chartCreator = (where, type, titleText, subtitleText, xType, Ytitle, tooltip, pointInterval, pointIntervalStart, seriesName, seriesData, color) => {
  Highcharts.chart(where, {
    chart: {
      type: type,
      scrollablePlotArea: {
        minWidth: 600,
        scrollPositionX: 1
      },
      backgroundColor: '#0d121c',
      borderRadius: 15
    },
    title: {
      text: titleText,
      align: 'left',
              style: {
          color: '#FFFFFF' 
        }
      
    },
    subtitle: {
      text: subtitleText,
      align: 'left',
              style: {
          color: '#FFFFFF' 
        }
    },
    xAxis: {
      type: xType,
      labels: {
        overflow: 'justify',
        style: {
          color: '#FFFFFF' 
        }
      }
    },
    yAxis: {
      title: {
        text: Ytitle,
      },
      labels: {
        style: {
          color: '#FFFFFF' 
        }
      },
      minorGridLineWidth: 0,
      gridLineWidth: 0,
      alternateGridColor: null,
      plotBands: []
    },
    tooltip: {
      valueSuffix: tooltip,
    },
    plotOptions: {
      series: {
        lineWidth: 5,
        states: {
          hover: {
            lineWidth: 5
          }
        },
        marker: {
          enabled: false
        },
        pointInterval: pointInterval * 3600000,
        pointStart: pointIntervalStart
      }
    },
    series: [{
      name: seriesName,
      data: seriesData,
      color: color
    }],
    navigation: {
      menuItemStyle: {
        fontSize: '10px',
                style: {
          background: '#0d121c',
          color: '#FFFFFF' 
        }
      }
    }
  });
};



const fixDateInterval = (date) => {
  const [datePart, timePart] = date.split(' ');
  const [year, month, day] = datePart.split('-');
  const [hour, min, sec] = timePart.split(':');
  const newDateTime = Date.UTC(year, month - 1, day, hour, min, sec);
  return newDateTime;
};


