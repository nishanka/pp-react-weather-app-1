import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
import './css/icons.css';

const API = {
  KEY: 'f1bbbfa5b0acebe0bc420772e7b0e7fb',
  BASE: 'https://api.openweathermap.org',
  ICONS: 'https://openweathermap.org/img/wn/',
  SETTINGS: {
    TEMP_UNITS: 'metric', //Fahrenheit - units=imperial, Celsius - units=metric, Kelvin - 3default
    TEMP_SYMBOL: '°C', //Fahrenheit - °F
  },
};

function App() {
  const [data, setData] = useState({
    location: 'London',
    temp: 10,
    icon: '04d',
    description: 'Clouds',
    feelsLike: 8,
    humidity: 10,
    windSpeed: 2,
  });
  const [locationName, setLocationName] = useState('');
  const [error, setError] = useState('');

  const fetchData = (locationName) => {
    if (locationName !== '') {
      const url = `${API.BASE}/data/2.5/weather?q=${locationName}&units=${API.SETTINGS.TEMP_UNITS}&APPID=${API.KEY}`;
      axios
        .get(url)
        .then((response) => {
          setData({
            // ...data,
            location: response.data.name,
            temp: response.data.main.temp.toFixed(),
            icon: response.data.weather[0].icon,
            description: response.data.weather[0].main,
            feelsLike: response.data.main.feels_like.toFixed(),
            humidity: response.data.main.humidity,
            windSpeed: response.data.wind.speed.toFixed(),
          });
          setError('');
        })
        .catch((err) => {
          if (err.response.status === 404) {
            setError('Invalid City Name');
          } else {
            setError('Something went wrong');
          }
        });
    } else {
      setError('Location is empty!');
    }
  };

  let containerClass;
  if (data.location !== undefined) {
    containerClass = 'container';
  } else {
    containerClass = 'container initial';
  }

  let ICON_URL = '';
  if (data.icon !== undefined) {
    ICON_URL = `${API.ICONS}/${data.icon}@2x.png`;
  }

  const handleChange = (event) => {
    setLocationName(event.target.value);
    setError('');
  };

  const handleClick = () => {
    fetchData(locationName);
  };

  const handleKeydown = (event) => {
    if (event.key === 'Enter') {
      fetchData(locationName);
    }
  };

  return (
    <div className='app'>
      <div className={containerClass}>
        <div className='top'>
          <div className='search'>
            <input
              value={locationName}
              onChange={handleChange}
              onKeyDown={handleKeydown}
              placeholder='Enter Location'
              type='text'
            />
            <button onClick={handleClick}>
              <span className='material-symbols-outlined'>search</span>
            </button>
          </div>
          {error && (
            <div className='error'>
              <p>{error}</p>
            </div>
          )}
        </div>
        {data.location !== undefined && (
          <>
            <div className='middle'>
              <div className='location'>
                <h3>{data.location}</h3>
              </div>
              <div className='image'>
                <img src={ICON_URL} alt={data.description} />
              </div>
              <div className='temp'>
                {data.temp ? (
                  <h1>
                    {data.temp}
                    {API.TEMP_SYMBOL}
                  </h1>
                ) : null}
              </div>
              <div className='description'>
                {data.description ? <p>{data.description}</p> : null}
              </div>
            </div>
            <div className='bottom'>
              <div className='feels'>
                {data.feelsLike ? (
                  <p>
                    {data.feelsLike}
                    {API.TEMP_SYMBOL}
                  </p>
                ) : null}
                <p>Feels Like</p>
              </div>
              <div className='humidity'>
                {data.humidity ? <p>{data.humidity}%</p> : null}
                <p>Humidity</p>
              </div>
              <div className='wind'>
                {data.windSpeed ? <p>{data.windSpeed} MPH</p> : null}
                <p>Wind Speed</p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
