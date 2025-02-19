import {useLayoutEffect} from 'react';
import {useState, useMemo, useCallback} from 'react';
import styled from '@emotion/styled';
import {ThemeProvider} from '@emotion/react';

import {getMoment} from './utils/helpers';
import WeatherCard from './views/WeatherCard';
import Header from './views/Header';
import {THEME} from './utils/constants';


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
  const moment = useMemo(() => getMoment(), []);

  // Web theme: {light, dark}
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>(() => {
    let themeMode = localStorage.getItem('theme') ?? 'light';
    if (!themeMode || !(themeMode in THEME)) themeMode = 'light';
    document.body.style.backgroundColor =
      THEME[themeMode as 'light' | 'dark'].backgroundColor;
    return themeMode as 'light' | 'dark';
  });

  const changeThemeMode = useCallback(() => {
    setCurrentTheme((prevTheme) => {
      const newTheme = prevTheme === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', newTheme);
      document.body.style.backgroundColor = THEME[newTheme].backgroundColor;
      return newTheme;
    });
  }, []);

  // Card number
  const [cards, setCards] = useState<React.JSX.Element[]>(() => []);

  const delCard = useCallback((cardIdx: number) => {
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
    }
    const allKeys = cards.map((card) => +card.key!);
    const newCards = cards.map((card) => {
      // 重新連接cardsRearrange
      return <WeatherCard
        key={card.key}
        cardIdx={+card.key!}
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
    <ThemeProvider theme={THEME[currentTheme]}>
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
