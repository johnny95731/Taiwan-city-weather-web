import React from "react";
import {useState, useMemo, useCallback} from "react";
import styled from "@emotion/styled";
import {ThemeProvider} from "@emotion/react";

import {getMoment} from "./utils/helpers";
import WeatherCard from "./views/WeatherCard.jsx";
import Header from "./views/Header.jsx";


// Constants
const theme = {
  light: {
    backgroundColor: "#ededed",
    headerColor: "#aaaaaa",
    foregroundColor: "#f9f9f9",
    menuHoverColor: "#eaeaea",
    optionMenuColor: "#d0d0d0",
    optionMenuShadow: "0px 0px 15px #606060",
    boxShadow: "0 1px 3px 0 #999999",
    titleColor: "#212121",
    temperatureColor: "#333",
    textColor: "#060606",
  },
  dark: {
    backgroundColor: "#1F2022",
    headerColor: "#333333",
    foregroundColor: "#121416",
    menuHoverColor: "#353535",
    optionMenuColor: "#5e5e5e",
    optionMenuShadow: "0px 0px 15px #707070",
    boxShadow:
      "0 1px 4px 0 rgba(12, 12, 13, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.15)",
    titleColor: "#f9f9fa",
    temperatureColor: "#fff",
    textColor: "#eee",
  },
};

// Components
const Container = styled.article`
  display: flex;
  flex-wrap: wrap;
  padding-top: 100px; /**Height of header */
  align-content: start;
  justify-content: center;
  background-color: ${({theme}) => theme.backgroundColor};
  width: 100%;
  min-height: 200%;
  height: auto;
  overflow-y: auto;
`;


const App = () => {
  // Get the city is day or night.
  const moment = useMemo(() => getMoment("臺北市"), []);

  // Web theme: {light, dark}
  const [currentTheme, setCurrentTheme] = useState(() => {
    const themeMode = localStorage.getItem("theme") || "light";
    document.body.style.backgroundColor = theme[themeMode].backgroundColor;
    return themeMode;
  });

  const changeThemeMode = useCallback(() => {
    const themeMode = currentTheme === "light" ? "dark" : "light";
    localStorage.setItem("theme", themeMode);
    setCurrentTheme(themeMode);
    document.body.style.backgroundColor = theme[themeMode].backgroundColor;
  }, [currentTheme]);

  // Card number
  const [cards, setCards] = useState(() => []);

  const cardsRearrange = useCallback((idx) => {
    // Rearrange after delete a card.
    // for (let i = idx; i < cards.length - 1; i += 1) {
    //   localStorage.setItem(`city${i}`, localStorage.getItem(`city${i+1}`) )
    //   localStorage.setItem(`town${i}`, localStorage.getItem(`town${i+1}`) )
    // }
    setCards((prevState) => {
      const newCards = [...prevState];
      const target = newCards.findIndex((cards, i) => cards.key === idx);
      newCards.splice(target, 1); // 移除指定的卡
      return newCards;
    });
  }, []);

  const addCardEvent = useCallback(() => {
    if (!cards.length) {
      setCards([
        <WeatherCard
          key={0}
          cardNum={0}
          moment={moment}
          cardsRearrange={cardsRearrange}
        />,
      ]);
      return;
    }
    const allKeys = cards.map((card) => parseInt(card.key));
    const newCards = cards.map((card, i) => {
      // 重新連接cardsRearrange
      return <WeatherCard
        key={card.key}
        cardNum={card.key}
        moment={moment}
        cardsRearrange={cardsRearrange}
      />;
    });
    let idx;
    if (Math.max(...allKeys) === allKeys.length-1) {
      // No card exists or cards be deleted from the middle.
      // If the card always be deleted from last, the if-else statement will
      // enter this part.
      idx = cards.length;
    } else {// If some cards be deleted Last key is not matching length.
      // Find the missing key (card be deleted).
      allKeys.sort((a, b) => a-b);
      idx = allKeys.slice(0, -1).find((key, i) => allKeys[i+1]-key > 1) + 1;
    }
    newCards.push(
        <WeatherCard
          key={idx}
          cardNum={idx}
          moment={moment}
          cardsRearrange={cardsRearrange}
        />,
    );
    setCards(newCards);
  }, [cards, moment]);

  useMemo(() => addCardEvent(), []);
  return (
    <ThemeProvider theme={theme[currentTheme]}>
      <Header
        currentTheme={currentTheme}
        changeThemeMode={changeThemeMode}
        addCard={addCardEvent}
      />
      <Container>
        {cards}
      </Container>
    </ThemeProvider>
  );
};

export default App;
