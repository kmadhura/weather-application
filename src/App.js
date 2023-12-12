

  import './WeatherApp.css'
  import React, { useState, useEffect } from 'react';
  import 'bootstrap/dist/css/bootstrap.min.css'
import axios from 'axios';

const WeatherApp = () => {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [savedLocations, setSavedLocations] = useState(() => {
    const saved = localStorage.getItem('savedLocations');
    return saved ? JSON.parse(saved) : [];
  });

  const API_KEY = 'd8b8013dffe9261cbf49a988a93447ca'; 

 

  const fetchWeatherData = async (query) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${API_KEY}&units=metric`
      );
      setWeatherData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching weather data:', error);
      setLoading(false);
    }
  };
 

  const fetchForecastData = async (query) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${query}&appid=${API_KEY}&units=metric`
      );
      setForecastData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching forecast data:', error);
      setLoading(false);
    }
  };

  const fetchWeatherByCoords = async (latitude, longitude) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
      );
      setWeatherData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching weather data by coordinates:', error);
      setLoading(false);
    }
  };

  const fetchForecastByCoords = async (latitude, longitude) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
      );
      setForecastData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching forecast data by coordinates:', error);
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setCity(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchWeatherData(city);
    fetchForecastData(city);
  };

  const getLocationWeather = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        fetchWeatherByCoords(latitude, longitude);
        fetchForecastByCoords(latitude, longitude);
      }, 
      (error) => {
        console.error('Error getting user location:', error);
      });
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  };

  const addLocation = () => {
    if (savedLocations.includes(city)) {
      alert('Location already added');
      return;
    }
    setSavedLocations([...savedLocations, city]);
    setCity('');
  };

  const removeLocation = (location) => {
    const updatedLocations = savedLocations.filter((item) => item !== location);
    setSavedLocations(updatedLocations);
  };

  const saveLocationsToLocalStorage = (locations) => {
    localStorage.setItem('savedLocations', JSON.stringify(locations));
  };

  useEffect(() => {
    getLocationWeather();
    saveLocationsToLocalStorage(savedLocations);
   
  }, [savedLocations]);

  return (
    <div className="weather-app">
      <h1 className="mb-4">Weather Forecast App</h1>
      <hr></hr>

      <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter city"
          value={city}
          onChange={handleInputChange}
        />
        <button type="submit">Get Weather</button>
      </form>
      </div>


      {loading && <p>Loading...</p>}
      {weatherData && (
        <div className="current-weather">
          <h2>Current Weather in {weatherData.name}, {weatherData.sys.country}</h2>
          <p>Temperature: {weatherData.main.temp}°C</p>
          <p>Weather: {weatherData.weather[0].description}</p>
          <p>Humidity: {weatherData.main.humidity}%</p>
          <button onClick={addLocation}>Add Location</button>
        </div>
      )}

      <div>
      {savedLocations.length > 0 && (
        <div className="saved-locations">
          <h2>Saved Locations</h2>
          <ul>
            {savedLocations.map((location) => (
              <li key={location}>
                {location}
                <button onClick={() => removeLocation(location)}>Remove</button>
              </li>
            ))}
          </ul>
        </div>
      )}

</div>


<div></div>
      {forecastData && (
        <div className="forecast">
          <h2>5-Day Weather Forecast</h2>
          <div className="forecast-items">
            {forecastData.list.map((item) => (
              <div key={item.dt} className="forecast-item">
                <p>Date: {new Date(item.dt * 1000).toLocaleDateString()}</p>
                <p>Temperature: {item.main.temp}°C</p>
                <p>Weather: {item.weather[0].description}</p>
                <p>Humidity: {item.main.humidity}%</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherApp;
