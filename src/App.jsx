import React, {useLayoutEffect} from "react";
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
    headerColor: "#ffffff",
    foregroundColor: "#f9f9f9",
    menuHoverColor: "#eaeaea",
    optionMenuColor: "#ffffff",
    optionMenuHoverColor: "#eee",
    optionMenuShadow: "0px 0px 15px #0003",
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
    setCurrentTheme((prevTheme) => {
      const newTheme = prevTheme === "light" ? "dark" : "light";
      localStorage.setItem("theme", newTheme);
      document.body.style.backgroundColor = theme[newTheme].backgroundColor;
      return newTheme;
    });
  }, []);

  // Card number
  const [cards, setCards] = useState(() => []);

  const delCard = useCallback((cardIdx) => {
    setCards((prevState) => {
      const newCards = [...prevState];
      newCards.splice(cardIdx, 1); // 移除指定的卡
      return newCards;
    });
  }, []);

  const addCard = useCallback(() => {
    if (!cards.length) {
      setCards([
        <WeatherCard
          key={0}
          cardIdx={0}
          moment={moment}
          delCard={delCard}
        />,
      ]);
      return;
    }
    const allKeys = cards.map((card) => parseInt(card.key));
    const newCards = cards.map((card, i) => {
      // 重新連接cardsRearrange
      return <WeatherCard
        key={card.key}
        cardIdx={card.key}
        moment={moment}
        delCard={delCard}
      />;
    });
    // 找空缺位置
    let newKey = cards.length;
    allKeys.sort((a, b) => a - b);
    for (let i = 0; i < allKeys.length + 1; i++) {
      if (i !== allKeys[i]) {
        newKey = i;
        break;
      }
    }
    newCards.push(
        <WeatherCard
          key={newKey}
          cardIdx={newKey}
          moment={moment}
          delCard={delCard}
        />,
    );
    setCards(newCards);
  }, [cards, moment]);

  useLayoutEffect(() => addCard(), []);
  return (
    <ThemeProvider theme={theme[currentTheme]}>
      <Header
        currentTheme={currentTheme}
        changeThemeMode={changeThemeMode}
        addCard={addCard}
      />
      <Container>
        {cards}
      </Container>
    </ThemeProvider>
  );
};

export default App;
