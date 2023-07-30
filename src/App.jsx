import React from 'react';
import { useState, useMemo, useCallback } from 'react';
import styled from '@emotion/styled';
import { ThemeProvider } from '@emotion/react';

import { getMoment, findLocation } from "./utils/helpers"
import useWeatherAPI from './hooks/useWeatherAPI.jsx';
import WeatherCard from './views/WeatherCard.jsx';
import Header from './views/Header.jsx';


// Constants
const AUTHORIZATION_KEY = "CWB-3F426C61-2685-412E-8A11-F0CC475190D5";

const theme = {
  light: {
    backgroundColor: '#ededed',
    foregroundColor: '#f9f9f9',
    headerColor: '#cccccc',
    boxShadow: '0 1px 3px 0 #999999',
    titleColor: '#212121',
    temperatureColor: '#757575',
    textColor: '#101010',
  },
  dark: {
    backgroundColor: '#1F2022',
    foregroundColor: '#121416',
    headerColor: '#333333',
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
  // Displayed city name and observation location name.
  const [currentCity, setCurrentCity] = useState(() =>
    localStorage.getItem("cityName") || "臺北市"
  );
  const currentLocation = useMemo(() => findLocation(currentCity),
   [currentCity]);
  const { locationName, cityName } = currentLocation;

  // Get the city is day or night.
  const moment = useMemo(() => getMoment(cityName), [cityName]);

  // Web theme: { light, dark }
  const [currentTheme, setCurrentTheme] = useState(() => 
    localStorage.getItem("theme") || 'light'
  );

  const updateTheme = useCallback(() => {
    const theme = currentTheme === "light" ? "dark" : "light";
    localStorage.setItem("theme", theme);
    setCurrentTheme(theme);
  }, [currentTheme]);

  const updateCityName = (cityName) => {
    setCurrentCity(cityName);
  };

  // Weather info fetched from API.
  const [weatherElement, fetchData] = useWeatherAPI({
    locationName: locationName,
    cityName: cityName,
    authorizationKey: AUTHORIZATION_KEY,
  });

  
  return (
    <ThemeProvider theme={theme[currentTheme]}>
      <Container>
        <Header 
          currentTheme={currentTheme}
          updateTheme={updateTheme}
        />
        
        <WeatherCard
          weatherElement={weatherElement}
          currentCity={currentCity}
          moment={moment}
          fetchData={fetchData}
          updateCityName={updateCityName}
        />
      </Container>
    </ThemeProvider>
  );
};

export default App;
