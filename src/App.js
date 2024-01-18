import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [data, setData] = useState({});
  const [location, setLocation] = useState('');

  const API_KEY = 'f1bbbfa5b0acebe0bc420772e7b0e7fb';
  const TEMP_UNITS = 'metric'; //Fahrenheit - units=imperial, Celsius - units=metric, Kelvin - default
  const TEMP_SYMBOL = '°C'; //Fahrenheit - °F

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=${TEMP_UNITS}&APPID=${API_KEY}`;

  const searchLocation = (event) => {
    if (event.key === 'Enter') {
      axios.get(url).then((response) => {
        setData(response.data);
      });
      setLocation('');
    }
  };

  let containerClass;
  if (data.name !== undefined) {
    containerClass = 'container';
  } else {
    containerClass = 'container initial';
  }

  return (
    <div className='app'>
      <div className={containerClass}>
        <div className='top'>
          <div className='search'>
            <input
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              onKeyDown={searchLocation}
              placeholder='Enter Location'
              type='text'
            />
          </div>
        </div>
        {data.name !== undefined && (
          <>
            <div className='middle'>
              <div className='location'>
                <h3>{data.name}</h3>
              </div>
              <div className='temp'>
                {data.main ? (
                  <h1>
                    {data.main.temp.toFixed()}
                    {TEMP_SYMBOL}
                  </h1>
                ) : null}
              </div>
              <div className='description'>
                {data.weather ? <p>{data.weather[0].main}</p> : null}
              </div>
            </div>
            <div className='bottom'>
              <div className='feels'>
                {data.main ? (
                  <p>
                    {data.main.feels_like.toFixed()}
                    {TEMP_SYMBOL}
                  </p>
                ) : null}
                <p>Feels Like</p>
              </div>
              <div className='humidity'>
                {data.main ? <p>{data.main.humidity}%</p> : null}
                <p>Humidity</p>
              </div>
              <div className='wind'>
                {data.wind ? <p>{data.wind.speed.toFixed()} MPH</p> : null}
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
