import React from 'react';
import { useState, useMemo, useCallback } from 'react';
import styled from '@emotion/styled';
import { ThemeProvider } from '@emotion/react';

import { getMoment } from "./utils/helpers"
import WeatherCard from './views/WeatherCard.jsx';
import Header from './views/Header.jsx';


// Constants
const theme = {
  light: {
    backgroundColor: '#ededed',
    headerColor: '#cccccc',
    foregroundColor: '#f9f9f9',
    menuHoverColor: '#eaeaea',
    boxShadow: '0 1px 3px 0 #999999',
    titleColor: '#212121',
    temperatureColor: '#333',
    textColor: '#060606',
  },
  dark: {
    backgroundColor: '#1F2022',
    headerColor: '#333333',
    foregroundColor: '#121416',
    menuHoverColor: '#353535',
    boxShadow:
      '0 1px 4px 0 rgba(12, 12, 13, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.15)',
    titleColor: '#f9f9fa',
    temperatureColor: '#fff',
    textColor: '#eee',
  },
};

// Components
const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  place-content: space-evenly space-evenly;
  background-color: ${({ theme }) => theme.backgroundColor};
  width: 100%;
  height: 100%;
  padding-top: 60px;
  padding-bottom: 20px;
  box-sizing: border-box;
  overflow-y: auto;
`;


const App = () => {
  // Get the city is day or night.
  const moment = useMemo(() => getMoment("臺北市"), []);

  // Web theme: { light, dark }
  const [currentTheme, setCurrentTheme] = useState(() => 
    localStorage.getItem("theme") || 'light'
  );

  const updateTheme = useCallback(() => {
    const theme = currentTheme === "light" ? "dark" : "light";
    localStorage.setItem("theme", theme);
    setCurrentTheme(theme);
  }, [currentTheme]);

  // Card number
  const [cards, setCards] = useState(() => 
    [<WeatherCard
      key={0}
      cardNum={0}
      moment={moment}
    />]
  )

  const addCard = useCallback(() => {
    setCards((prevState) => ([
      ...prevState,
      <WeatherCard
        key={cards.length}
        cardNum={cards.length}
        moment={moment}
      />
    ]));
  }, [cards, moment]);
  
  return (
    <ThemeProvider theme={theme[currentTheme]}>
      <Header
        currentTheme={currentTheme}
        updateTheme={updateTheme}
        addCard={addCard}
      />
      <Container>
        {cards}
      </Container>
    </ThemeProvider>
  );
};

export default App;
