import {useCallback} from 'react';
import {useState, useEffect} from 'react';
import styled from '@emotion/styled';

// Components
const HeaderWrapper = styled.header<{isVisible: boolean}>`
  position: fixed;
  left: 0px;
  top: ${({isVisible}) => isVisible ? '0px' : '-60px'};
  z-index: 1;

  display: flex;
  align-items: center;
  gap: 20px;
  width: 100%;
  height: 60px;
  padding: 10px 3% 10px 3%;
  box-shadow: ${({theme}) => theme.boxShadow};

  background-color: ${({theme}) => theme.bgColor};
  color: ${({theme}) => theme.textColor1};
  transition: all 0.7s ease;

  @media (max-width: 500px) {
    padding-right: 5%;
    height: 50px;
  }
`;

const Title = styled.h1`
  flex: 0 0 auto;
  font-size: 21px;
  font-weight: 600;

  @media (max-width: 500px) {
    font-size: 18px;
  }
`;

const Toolbar = styled.div`
  flex: 1 1 0;
  display: flex;
  gap: 12px;
`;

const ActionBtn = styled.button`
  padding: 8px;
  border-radius: 8px;
  font-size: 12pt;
  font-weight: 600;
  &:hover {
    background-color: ${({theme}) => theme.hoverBgColor};
  }
`;
const ActionLink = ActionBtn.withComponent('a');


export type HeaderProps = {
  currentTheme: 'light' | 'dark',
  changeThemeMode: ()=> void,
  addCard: ()=> void,
}
const Header = ({
  changeThemeMode,
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


  return (
    <HeaderWrapper isVisible={isVisible}>
      <Title>縣市天氣即時資訊</Title>
      <Toolbar>
        <div className='spacer' />
        <ActionBtn
          type="button"
          onClick={changeThemeMode}
          aria-label="背景主體"
        >
          <i className='bi bi-circle-half' />
        </ActionBtn>
        <ActionLink
          href="https://github.com/johnny95731/Taiwan-city-weather-web"
          aria-label="GitHub專案連結"
        >
          <i className='bi bi-github' />
        </ActionLink>
      </Toolbar>
    </HeaderWrapper>
  );
};

export default Header;
