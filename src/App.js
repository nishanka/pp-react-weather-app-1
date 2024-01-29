import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
import './css/icons.css';
import BlockContainer from './components/UI/BlockContainer';

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
    city: '',
    country: '',
    temp: 0,
    icon: '',
    description: '',
    feelsLike: 0,
    humidity: 0,
    windSpeed: 0,
  });
  const [enteredCity, setEnteredCity] = useState('');
  const [error, setError] = useState('');

  const fetchData = (enteredCity) => {
    if (enteredCity !== '') {
      const url = `${API.BASE}/data/2.5/weather?q=${enteredCity}&units=${API.SETTINGS.TEMP_UNITS}&APPID=${API.KEY}`;
      axios
        .get(url)
        .then((response) => {
          setData({
            // ...data,
            city: response.data.name,
            country: response.data.sys.country,
            temp: response.data.main.temp.toFixed(),
            icon: response.data.weather[0].icon,
            // description: response.data.weather[0].description,
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
  if (data.city !== '' && data.city !== undefined) {
    containerClass = 'container';
  } else {
    containerClass = 'container initial';
  }

  let ICON_URL = '';
  if (data.icon !== undefined) {
    ICON_URL = `${API.ICONS}/${data.icon}@2x.png`;
  }

  const handleChange = (event) => {
    setEnteredCity(event.target.value);
    setError('');
  };

  const handleClick = () => {
    fetchData(enteredCity);
    setEnteredCity('');
  };

  const handleKeydown = (event) => {
    if (event.key === 'Enter') {
      fetchData(enteredCity);
      setEnteredCity('');
    }
  };

  return (
    <div className='app'>
      <div className={containerClass}>
        <BlockContainer className='top'>
          <div className='search'>
            <input
              value={enteredCity}
              onChange={handleChange}
              onKeyDown={handleKeydown}
              placeholder='Enter Location'
              type='text'
            />
            <button onClick={handleClick}></button>
          </div>
          {error && (
            <div className='error'>
              <p>{error}</p>
            </div>
          )}
        </BlockContainer>

        {data.city !== undefined && data.city !== '' && (
          <>
            <BlockContainer className='middle'>
              <div className='location'>
                <h3>
                  {data.city}, {data.country}
                </h3>
              </div>
              <div className='image'>
                <img src={ICON_URL} alt={data.description} />
              </div>
              <div className='temp'>
                {data.temp ? (
                  <h1>
                    {data.temp}
                    {API.SETTINGS.TEMP_SYMBOL}
                  </h1>
                ) : null}
              </div>
              <div className='description'>
                {data.description ? <p>{data.description}</p> : null}
              </div>
            </BlockContainer>

            {data.city !== undefined && data.city !== '' && (
              <BlockContainer className='bottom'>
                <div className='feels'>
                  {data.feelsLike ? (
                    <p>
                      {data.feelsLike}
                      {API.SETTINGS.TEMP_SYMBOL}
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
              </BlockContainer>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default App;
