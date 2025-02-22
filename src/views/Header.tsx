import {useCallback} from 'react';
import {useState, useEffect} from 'react';
import styled from '@emotion/styled';

// Components
const HeaderWrapper = styled.header<{isVisible: boolean}>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: fixed;
  left: 0px;
  top: ${({isVisible}) => isVisible ? '0px' : '-60px'};
  z-index: 1;

  width: 100%;
  height: 60px;
  box-sizing: border-box;
  padding: 10px 3% 10px 3%;
  box-shadow: ${({theme}) => theme.boxShadow};

  background-color: ${({theme}) => theme.bgColor1};
  transition: all 0.7s ease;

  @media (max-width: 500px), (max-height: 600px) {
    padding-right: 5%;
    height: 50px;
  }

`;

const Title = styled.h1`
  font-size: 21px;
  font-weight: 600;
  color: ${({theme}) => theme.textColor1};

  @media (max-width: 500px), (max-height: 600px) {
    font-size: 18px;
  }
`;

const OptionMenu = styled.div`
  position: relative;
  display: inline-block;

  @media (max-width: 500px){
    padding: 4px;
  }
`;

const OptionButton = styled.button`
  border-radius: 50%;
  padding: 6px;
  color: ${({theme}) => theme.textColor1};
  font-size: 16pt;
  &:hover {
    background-color: ${({theme}) => theme.menuHoverColor};
  }

  @media (max-width: 500px) {
    font-size: 12pt;
  }
`;

const OptionContent = styled.div`
  display: none;
  justify-items: stretch;
  position: absolute;
  left: auto;
  right: 0;
  width: 100px;
  background-color: #000000;
  box-shadow: ${({theme}) => theme.boxShadow};
  z-index: 1;
  button {
    width: 100%;
    background: ${({theme}) => theme.bgColor1};
    font-size: 14px;
    font-weight: 600;
    color: ${({theme}) => theme.textColor1};
    padding: 5px 10px;
    &:hover {
      text-decoration: underline;
    }
  }
`;


export type HeaderProps = {
  currentTheme: 'light' | 'dark',
  changeThemeMode: ()=> void,
  addCard: ()=> void,
}
const Header = ({
  currentTheme,
  changeThemeMode,
  addCard,
}: HeaderProps) => {
  // Hide Header when scrolling more than heightToHideFrom.
  const [isVisible, setIsVisible] = useState(true);

  const listenToScroll = useCallback(() => {
    const heightToHideFrom = 400;
    const winScroll = document.body.scrollTop ||
        document.documentElement.scrollTop;

    if (winScroll > heightToHideFrom) {
      // to limit setting state only the first time
      if (isVisible) setIsVisible(false);
    } else {
      setIsVisible(true);
    }
  }, [isVisible]);

  useEffect(() => {
    window.addEventListener('scroll', listenToScroll);
    return () =>
      window.removeEventListener('scroll', listenToScroll);
  }, [listenToScroll]);

  const clickOption = () => {
    const element = document.getElementById('OptionContents') as HTMLDivElement;
    if (element.style.display === 'none') {
      element.style.display = 'block';
    } else {
      element.style.display = 'none';
    }
  };

  return (
    <HeaderWrapper isVisible={isVisible}>
      <Title>縣市天氣即時資訊</Title>

      <OptionMenu
        onClick={clickOption}
        id="OptionMenu">
        {/* <button onClick={addCard}>新增天氣卡</button>
        <button onClick={changeThemeMode}>
          {currentTheme === "light" ? "深" : "淺" }色模式
        </button> */}
        <OptionButton
          id="OptionButton"
          type="button"
        >
          <i
            className="bi bi-list"
          />
        </OptionButton>
        <OptionContent id="OptionContents">
          <button onClick={addCard}>新增天氣卡</button>
          <button onClick={changeThemeMode}>
            {currentTheme === 'light' ? '深' : '淺' }色模式
          </button>
        </OptionContent>
      </OptionMenu>
    </HeaderWrapper>
  );
};

export default Header;
