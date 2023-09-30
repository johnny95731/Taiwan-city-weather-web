import styled from "@emotion/styled";
import { useCallback, useState, useMemo } from "react";
import dayjs from "dayjs";

import WeatherIcon from "./../components/WeatherIcon.jsx";
import Tooltip from "./../components/Tooltip.jsx";
import useWeatherAPI from "./../hooks/useWeatherAPI.jsx";
import { ReactComponent as DangerIcon_ } from "./../images/danger.svg";
import { ReactComponent as AirFlowIcon } from "./../images/airFlow.svg";
import { ReactComponent as LoadingIcon } from "./../images/loading.svg";
import { ReactComponent as RainIcon } from "./../images/rain.svg";
import { ReactComponent as RefreshIcon } from "./../images/refresh.svg";
import { ReactComponent as DashCircleIcon } from "./../images/dash-circle.svg";
import { getLocation, getCities, getTowns, hex2Decimal } from "./../utils/helpers";

// Constants
const AUTHORIZATION_KEY = "CWB-3F426C61-2685-412E-8A11-F0CC475190D5";

// Components
const WeatherCardWrapper = styled.div`
  display: block;
  position: relative;
  top: ${({ cardPos }) => cardPos.y};
  left: ${({ cardPos }) => cardPos.x};
  width: 350px;
  box-shadow: ${({ theme }) => theme.boxShadow};
  background-color: ${({ theme }) => theme.foregroundColor};
  box-sizing: border-box;
  padding: 15px 15px 30px 15px;
  margin: 20px 30px;

  @media screen and (max-height: 640px) {
    width: 400px;
  }
`;

const CityMenu = styled.select`
  display: inline;
  width: 95px;
  background: transparent;
  font-size: 21px;
  font-weight: 600;
  color: ${({ theme }) => theme.titleColor};
  cursor: pointer;
  border: none;
  &:hover {
    background: ${({ theme }) => theme.menuHoverColor};
  }
`;

const LocationOption = styled.option`
  background-color:  ${({ theme }) => theme.foregroundColor};
  font-size: 16px;
  color: ${({ theme }) => theme.titleColor};
`;

const TownMenu = styled.select`
  display: inline;
  width: 90px;
  background: transparent;
  font-size: 18px;
  font-weight: 550;
  color: ${({ theme }) => theme.titleColor};
  cursor: pointer;
  margin-left: 10px;
  border: none;
  &:hover {
    background: ${({ theme }) => theme.menuHoverColor};
  }
`;

const CloseButton = styled(DashCircleIcon)`
  text-align: center;
  float: right;
  width: 20px;
  height: 28px;
  cursor: pointer;
  ${
    // 原圖檔為黑色。
    // 背景亮度高則維持黑色，亮度低則反轉為白色。
    ({ theme }) => hex2Decimal(theme.foregroundColor) > 127 ?
    "" : 
    "-webkit-filter: invert(100%); filter: invert(100%);"
  }
  @media (max-width: 500px), (max-height: 600px) {
    width: 16px;
  }
`;

const Description = styled.div`
  display: block;
  font-size: 16px;
  color: ${({ theme }) => theme.textColor};
  padding-left: 5px;
  margin-top: 5px;
  margin-bottom: 10px;
`;

const CurrentWeather = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  height: min-content;
  justify-items: start;
  align-items: flex-end;
  margin-bottom: 10px;
  svg{
    height: 80px;
    width: 80px;
    flex-shrink: 0;
    margin-left: 5px;
    pointer-events: none;
  }
`;

const TempNDanger = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-content: space-between;
  width: min-content;
  height: max-content;
`;

const Temperature = styled.div`
  display: flex;
  color: ${({ theme }) => theme.temperatureColor};
  font-size: 40px;
  font-weight: 300;
  margin-left: 20px;
`;

const Celsius = styled.div`
  font-weight: 400;
  font-size: 16px;
`;

const DangerIndex = styled.div`
  display: inline-flex;
  white-space: nowrap;
  align-items: center;
  color: ${({ theme }) => theme.temperatureColor};
  font-size: 16px;
  font-weight: 400;
  margin-left: 17px;
`;

const DangerIcon = styled(DangerIcon_)`
  max-width: 18px;
  max-height: 18px;
  margin-right: 10px;
  ${
    // 原圖檔為黑色。
    // 背景亮度高則維持黑色，亮度低則反轉為白色。
    ({ theme }) => hex2Decimal(theme.foregroundColor) > 127 ?
    "" : 
    "-webkit-filter: invert(100%); filter: invert(100%);"
  }
`;

const Info = styled.div`
  display: flex;
  align-self: flex-end;
  align-content: flex-end;
  width: min-content;
  font-size: 16px;
  font-weight: 400;
  white-space: nowrap;
  color: ${({ theme }) => theme.textColor};
  margin-left: 8px;
  margin-top: 12px;
`;

const AirFlow = styled.div`
  display: flex;
  align-content: center;
  svg {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
    margin-right: 10px;
    pointer-events: none;
  }
`;

const Rain = styled.div`
  display: flex;
  align-content: center;
  margin-left: 20px;
  svg {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
    margin-right: 10px;
    pointer-events: none;
  }
`;

const Refresh = styled.div`
  position: absolute;
  right: 15px;
  bottom: 15px;
  font-size: 12px;
  display: inline-flex;
  align-items: center;
  color: ${({ theme }) => theme.textColor};
  svg {
    margin-left: 10px;
    width: 15px;
    height: 15px;
    cursor: pointer;
    animation: rotate infinite 1.5s linear;
    animation-duration: ${({ isLoading }) => (isLoading ? "1.5s" : "0s")};
  }

  @keyframes rotate {
    from {
      transform: rotate(360deg);
    }
    to {
      transform: rotate(0deg);
    }
  }
`;


const WeatherCard = ({
  cardNum,
  moment,
  cardsRearrange
}) => {
  // Displayed city name and observation location name.
  const [currentCity, setCurrentCity] = useState(() =>
    localStorage.getItem(`city${cardNum}`) || "臺北市"
  );
  const [currentTown, setCurrentTown] = useState(() =>
    localStorage.getItem(`town${cardNum}`) || "---"
  );
  const currentStation = useMemo(() => getLocation(currentCity).repStationID,
   [currentCity]);

  // fetch weather info from API.
  const [weatherElement, fetchData] = useWeatherAPI({
    repStationID: currentStation,
    cityName: currentCity,
    townName: currentTown,
    authorizationKey: AUTHORIZATION_KEY,
  });

  const {
    observationTime,
    temperature,
    windSpeed,
    description,
    weatherCode,
    rainPossibility,
    comfortability,
    heatInjuryIndex,
    heatInjuryWarning,
    isLoading,
  } = weatherElement;

  const cityChanged = (e) => {
    const locationName = e.target.value;
    localStorage.setItem(`city${cardNum}`, locationName);
    setCurrentCity(locationName);
    localStorage.setItem(`town${cardNum}`, "---");
    setCurrentTown("---");
  };

  const townChanged = (e) => {
    const townName = e.target.value;
    localStorage.setItem(`town${cardNum}`, townName);
    setCurrentTown(townName);
  };

  // Drag event
  const [cardPos, setCardPos] = useState(() => {
    return {
      x: "0px",
      y: "0px",
    }
  });

  const [isDragging, SetIsDragging] = useState(() => false);
  
  const [start, setStart] = useState(() => {
    return {
      x: undefined,
      y: undefined,
    }
  });

  const mouseDown = useCallback((e) => {
    setStart({
      x: Number(cardPos.x.slice(0, -2)) - e.clientX,
      y: Number(cardPos.y.slice(0, -2)) - e.clientY,
    });
    SetIsDragging(true);
  }, []);

  const mouseMove = useCallback((e) => {
    if (isDragging) {
      const xBias = start.x + e.clientX;
      const yBias = start.y + e.clientY;
      setCardPos({
        x: `${xBias}px`,
        y: `${yBias}px`,
      });
    }
  }, [isDragging])

  const MouseUp = useCallback(() => {
    SetIsDragging(false);
  }, []);

  // Delete event
  const deleteEvent = useCallback(() =>{
    cardsRearrange(cardNum);
  }, [cardNum]);

  return (
    <WeatherCardWrapper 
      cardPos={cardPos} 
      onMouseDown={mouseDown}
      onMouseMove={mouseMove}
      onMouseUp={MouseUp}
      onMouseLeave={MouseUp}
    >
      <CityMenu
        onChange={cityChanged}
        value={currentCity}
      >
        {getCities.map((cityName) => (
          <LocationOption value={cityName} key={cityName}>
            {cityName}
          </LocationOption>
        ))}
      </CityMenu>
      <TownMenu
        onChange={townChanged}
        value={currentTown}>
        <LocationOption value={"---"} key={"---"}>
          ---
        </LocationOption>
        {getTowns(currentCity).map((districtName) => (
          <LocationOption value={districtName} key={districtName}>
            {districtName}
          </LocationOption>
        ))}
      </TownMenu>
      <CloseButton onClick={deleteEvent}/>

      <Description>
        {description} {comfortability}
      </Description>
      
      <CurrentWeather>
        <WeatherIcon
          weatherCode={weatherCode}
          moment={moment}
        />
        <TempNDanger>
          <Temperature>
            {Math.round(temperature)} <Celsius>°C</Celsius>
          </Temperature>
          <DangerIndex id={"DangerIndex"}>
            <Tooltip
              id={"DangerIndex"}
              content={"熱傷害指數"}
            />
            <DangerIcon />
            {heatInjuryIndex} {heatInjuryWarning}
          </DangerIndex>
        </TempNDanger>
        <Info>
          <AirFlow id={"AirFlow"}>
            <Tooltip
              id={"AirFlow"}
              content={"風速"}
            />
            <AirFlowIcon /> {windSpeed} m/h
          </AirFlow>
          <Rain id={"Rain"}>
            <Tooltip
              id={"Rain"}
              content={"12小時內降雨機率"}
            />
            <RainIcon /> {rainPossibility}%
          </Rain>
        </Info>
      </CurrentWeather>
      <Refresh onClick={fetchData} isLoading={isLoading}>
        最後觀測時間：
        {new Intl.DateTimeFormat("zh-TW", {
          hour: "numeric",
          minute: "numeric",
        }).format(dayjs(observationTime))}{" "}
        {isLoading ? <LoadingIcon /> : <RefreshIcon />}
      </Refresh>
    </WeatherCardWrapper>
  );
};

export default WeatherCard;
