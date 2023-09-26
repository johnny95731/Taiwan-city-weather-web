import React from "react";
import { useState, useMemo, useCallback } from "react";
import styled from "@emotion/styled";
import { ThemeProvider } from "@emotion/react";

import { getMoment } from "./utils/helpers"
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
  padding-top: 60px; /**Height of header */
  place-content: space-evenly space-evenly;
  background-color: ${({ theme }) => theme.backgroundColor};
  width: 100%;
  min-height: 100%;
  height: auto;
  box-sizing: border-box;
  overflow-y: auto;
`;


// const ScreenSize = () => {
//   const body = document.getElementsByTagName('body')[0];
//   const [size, setSize] = useState({
//     screen: [window.screen.width, window.screen.height],
//     window: [window.innerWidth, window.innerHeight],
//     doc: [document.documentElement.clientWidth, document.documentElement.clientHeight],
//     body: [body.clientWidth, body.clientHeight],
//   });

//   const resize = () => {
//     setSize({
//       screen: [window.screen.width, window.screen.height],
//       window: [window.innerWidth, window.innerHeight],
//       doc: [document.documentElement.clientWidth, document.documentElement.clientHeight],
//       body: [body.clientWidth, body.clientHeight],
//     })
//   };
  
//   useEffect(() => {
//     window.addEventListener("resize", resize);
//     return () =>
//        window.removeEventListener("resize", resize);
//   }, [])

//   return (
//     <div style={{
//         position: "fixed",
//         top: "60px",
//         left: "50px",
//         zIndex: "2",
//         color: `${({ theme }) => theme.textColor}`,
//       }}>
//       window.screen: {size.screen[0]} / {size.screen[1]} <br />
//       window.inner: {size.window[0]} / {size.window[1]} <br />
//       documentElement: {size.doc[0]} / {size.doc[1]} <br />
//       body: {size.body[0]} / {size.body[1]}
//     </div>
//   )
// }


const App = () => {
  // Get the city is day or night.
  const moment = useMemo(() => getMoment("臺北市"), []);

  // Web theme: { light, dark }
  const [currentTheme, setCurrentTheme] = useState(() => {
    const themeMode = localStorage.getItem("theme") || "light";
    document.body.style.backgroundColor = theme[themeMode].backgroundColor;
    return themeMode
  });

  const changeThemeMode = useCallback(() => {
    const themeMode = currentTheme === "light" ? "dark" : "light";
    localStorage.setItem("theme", themeMode);
    setCurrentTheme(themeMode);
    document.body.style.backgroundColor = theme[themeMode].backgroundColor;
  }, [currentTheme]);

  // Card number
  const [cards, setCards] = useState(() => [])

  const cardsRearrange = (idx) => {
    // Rearrange after delete a card.
    setCards((prevState) => {
      const newCards = [...prevState];
      newCards.splice(idx, 1);
      return newCards
    });
  };

  const addCardEvent = useCallback(() => {
    if (!cards.length){
      setCards((prevState) => ([
        ...prevState,
        <WeatherCard
          key={cards.length}
          cardNum={cards.length}
          moment={moment}
          cardsRearrange={cardsRearrange}
        />
      ]));
      return
    };
    const allKeys = cards.map((card) => parseInt(card.key));
    allKeys.sort((a, b) => a-b);
    if (allKeys[allKeys.length-1] === allKeys.length-1){
      // No card exists or cards be deleted from the middle.
      // If the card always be deleted from last, the if-else statement will
      // enter this part.
      setCards((prevState) => ([
        ...prevState,
        <WeatherCard
          key={cards.length}
          cardNum={cards.length}
          moment={moment}
          cardsRearrange={cardsRearrange}
        />
      ]));
    } else { // If some cards be deleted Last key is not matching length.
      // Find the missing key (card be deleted).
      const idx = allKeys.slice(0,-1).find((key, i) => allKeys[i+1]-key > 1)+1;
      setCards((prevState) => ([
        ...prevState,
        <WeatherCard
          key={idx}
          cardNum={idx}
          moment={moment}
          cardsRearrange={cardsRearrange}
        />
      ]));
    };
  }, [cards, moment]);

  useMemo(() => addCardEvent(), []);
  return (
    <ThemeProvider theme={theme[currentTheme]}>
      {/* <ScreenSize /> */}
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
