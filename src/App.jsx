import React from 'react';
import { useState, useEffect, useMemo } from 'react';
import styled from '@emotion/styled';
import { ThemeProvider } from '@emotion/react';

import { getMoment, findLocation } from "./utils/helpers"
import useWeatherAPI from './hooks/useWeatherAPI.jsx';
import WeatherCard from './views/WeatherCard.jsx';
import WeatherSetting from './views/WeatherSetting.jsx';


// Constants
const AUTHORIZATION_KEY = "CWB-3F426C61-2685-412E-8A11-F0CC475190D5";

const theme = {
  light: {
    backgroundColor: '#ededed',
    foregroundColor: '#f9f9f9',
    boxShadow: '0 1px 3px 0 #999999',
    titleColor: '#212121',
    temperatureColor: '#757575',
    textColor: '#101010',
  },
  dark: {
    backgroundColor: '#1F2022',
    foregroundColor: '#121416',
    boxShadow:
      '0 1px 4px 0 rgba(12, 12, 13, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.15)',
    titleColor: '#f9f9fa',
    temperatureColor: '#dddddd',
    textColor: '#cccccc',
  },
};

// Components
const Container = styled.div`
  background-color: ${({ theme }) => theme.backgroundColor};
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;;
`;


const App = () => {
  // Web theme: { light, dark }
  const [currentTheme, setCurrentTheme] = useState('light');

  // Displayed city name and observation location name.
  const [currentCity, setCurrentCity] = useState(() =>
    localStorage.getItem("cityName") || "臺北市"
  );
  const currentLocation = useMemo(() => findLocation(currentCity),
    [currentCity]);
  const { locationName, cityName } = currentLocation;

  const updateCityName = (cityName) => {
    setCurrentCity(cityName)
  };

  // Weather info fetched from API.
  const [weatherElement, fetchData] = useWeatherAPI({
    locationName: locationName,
    cityName: cityName,
    authorizationKey: AUTHORIZATION_KEY,
  });

  // Current page: { WeatherCard, WeatherSetting }
  const [currentPage, setCurrentPage] = useState('WeatherCard');

  const updateCurrentPage = (currentPage) => {
    setCurrentPage(currentPage);
  };

  // Get the city is day or night.
  const moment = useMemo(() => getMoment(cityName), []);

  useEffect(() => { // Decide theme by day/night.
    setCurrentTheme(moment === 'day' ? 'light' : 'dark');
  }, [moment]);

  
  return (
    <ThemeProvider theme={theme[currentTheme]}>
      <Container>
        {currentPage === 'WeatherCard' && (
          <WeatherCard
            weatherElement={weatherElement}
            currentCity={currentCity}
            moment={moment}
            fetchData={fetchData}
            updateCurrentPage={updateCurrentPage}
          />
        )}

        {currentPage === 'WeatherSetting' && (
          <WeatherSetting
            currentCity={currentCity}
            updateCurrentPage={updateCurrentPage}
            updateCityName={updateCityName}
          />
        )}
      </Container>
    </ThemeProvider>
  );
};

export default App;
