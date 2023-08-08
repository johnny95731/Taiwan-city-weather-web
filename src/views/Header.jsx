import React from 'react';
import { useState, useEffect } from 'react';
import styled from '@emotion/styled';

// Components
const HeaderWrapper = styled.nav`
  display: flex;
  position: fixed;
  left: 0px;
  top: ${({ isVisible }) => isVisible ? "0px" : "-60px"};
  z-index: 1;
  width: 100%;
  height: 60px;
  background-color: ${({ theme }) => theme.headerColor};
  padding: 10px 20px;
  margin: 0 auto;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  -webkit-transition: all 0.5s ease;
  -ms-transition: all 0.5s ease;
  -moz-transition: all 0.5s ease;
  -o-transition: all 0.5s ease;
  transition: all 0.5s ease;
`;

const Title = styled.div`
  font-size: 21px;
  font-weight: 600;
  color: ${({ theme }) => theme.textColor};
`;

const AddCardBtn = styled.button`
  background-color: ${({ theme }) => theme.foregroundColor};
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.textColor};
  border: 1px solid #bbbbbb;
  padding: 5px 10px;
	margin-left:auto;
`;

const DarkModeBtn = styled.button`
  background-color: ${({ theme }) => theme.foregroundColor};
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.textColor};
  border: 1px solid #bbbbbb;
  padding: 5px 10px;
	margin-left: 30px;
`;


const Header = ({ 
  currentTheme,
  updateTheme,
  addCard
}) => {
  // Hide Header when scrolling more than heightToHideFrom.
  const [isVisible, setIsVisible] = useState(true);

  const listenToScroll = () => {
    let heightToHideFrom = 700;
    const winScroll = document.body.scrollTop ||
        document.documentElement.scrollTop;
  
    if (winScroll > heightToHideFrom) {
       isVisible &&      // to limit setting state only the first time
         setIsVisible(false);
    } else {
         setIsVisible(true);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", listenToScroll);
    return () =>
       window.removeEventListener("scroll", listenToScroll);
  }, [])
  //
  
  return (
    <>
    <HeaderWrapper isVisible={isVisible}>
      <Title>縣市即時天氣資訊</Title>
        <AddCardBtn onClick={addCard}>新增天氣卡</AddCardBtn>
        <DarkModeBtn onClick={updateTheme}>
          { currentTheme === "light" ? "深" : "淺" }色模式
        </DarkModeBtn>
    </HeaderWrapper>
      </>
  )
};

export default Header;
