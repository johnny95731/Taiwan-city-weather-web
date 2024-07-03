import React, {useCallback} from "react";
import {useState, useEffect} from "react";
import styled from "@emotion/styled";

import {ReactComponent as List} from "./../images/list.svg";
import {hex2Decimal} from "./../utils/helpers";

// Components
const HeaderWrapper = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: fixed;
  left: 0px;
  top: ${({isVisible}) => isVisible ? "0px" : "-60px"};
  z-index: 1;

  width: 100%;
  height: 60px;
  box-sizing: border-box;
  padding: 10px 3% 10px 3%;
  border-bottom: 2px solid #0007;

  background-color: ${({theme}) => theme.headerColor};
  -webkit-transition: all 0.5s ease;
  -ms-transition: all 0.5s ease;
  -moz-transition: all 0.5s ease;
  -o-transition: all 0.5s ease;
  transition: all 0.5s ease;

  @media (max-width: 500px), (max-height: 600px) {
    height: 40px;
    padding-right: 5%;
  }

`;

const Title = styled.h1`
  font-size: 21px;
  font-weight: 600;
  color: ${({theme}) => theme.textColor};

  @media (max-width: 500px), (max-height: 600px) {
    font-size: 18px;
  }
`;

const OptionMenu = styled.div`
  position: relative;
  display: inline-block;
  width: 35px;
  height: 35px;
  background-color: ${({theme}) => theme.optionMenuColor};

  @media (max-width: 500px), (max-height: 600px) {
    width: 25px;
    height: 25px;
  }

  &:hover {
    background-color: ${({theme}) => theme.optionMenuHoverColor};
    box-shadow: ${({theme}) => theme.optionMenuShadow};
  }
`;

const OptionButton = styled(List)`
  width: 35px;
  height: 35px;
  cursor: pointer;
  ${
  // 原圖檔為黑色。
  // 背景亮度高則維持黑色，亮度低則反轉為白色。
  ({theme}) => hex2Decimal(theme.foregroundColor) > 127 ?
    "" :
    "-webkit-filter: invert(100%); filter: invert(100%);"
}

  @media (max-width: 500px), (max-height: 600px) {
    width: 25px;
    height: 25px;
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
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  z-index: 1;
  button {
    width: 100%;
    background-color: ${({theme}) => theme.foregroundColor};
    font-size: 14px;
    font-weight: 600;
    color: ${({theme}) => theme.textColor};
    padding: 5px 10px;
    border-width: 1px 0;
    border-color: ${({theme}) => theme.foregroundColor};
    &:hover {
      text-decoration: underline;
    }
  }
`;


const Header = ({
  currentTheme,
  changeThemeMode,
  addCard,
}) => {
  // Hide Header when scrolling more than heightToHideFrom.
  const [isVisible, setIsVisible] = useState(true);

  const listenToScroll = useCallback(() => {
    const heightToHideFrom = 400;
    const winScroll = document.body.scrollTop ||
        document.documentElement.scrollTop;

    if (winScroll > heightToHideFrom) {
      isVisible && // to limit setting state only the first time
         setIsVisible(false);
    } else {
      setIsVisible(true);
    }
  }, [isVisible]);

  useEffect(() => {
    window.addEventListener("scroll", listenToScroll);
    return () =>
      window.removeEventListener("scroll", listenToScroll);
  }, [listenToScroll]);

  const clickOption = () => {
    const element = document.getElementById("OptionContents");
    if (element.style.display === "none") {
      element.style.display = "block";
    } else {
      element.style.display = "none";
    }
  };

  return (
    <HeaderWrapper isVisible={isVisible}>
      <Title>縣市天氣即時資訊</Title>

      <OptionMenu onClick={clickOption} id="OptionMenu">
        {/* <button onClick={addCard}>新增天氣卡</button>
        <button onClick={changeThemeMode}>
          {currentTheme === "light" ? "深" : "淺" }色模式
        </button> */}
        <OptionButton id="OptionButton"/>
        <OptionContent id="OptionContents">
          <button onClick={addCard}>新增天氣卡</button>
          <button onClick={changeThemeMode}>
            {currentTheme === "light" ? "深" : "淺" }色模式
          </button>
        </OptionContent>
      </OptionMenu>
    </HeaderWrapper>
  );
};

export default Header;
