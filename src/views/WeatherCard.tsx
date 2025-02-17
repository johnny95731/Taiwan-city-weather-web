import React, {useState, useMemo, useRef, useCallback} from 'react';
import styled from '@emotion/styled';
import dayjs from 'dayjs';

import WeatherIcon from '../components/WeatherIcon';
import Tooltip from '../components/Tooltip';
import useWeatherAPI from '../hooks/useWeatherAPI';
import DangerIcon_ from 'images/danger.svg?react';
import AirFlowIcon from 'images/airFlow.svg?react';
import LoadingIcon from 'images/loading.svg?react';
import RainIcon from 'images/rain.svg?react';
import RefreshIcon from 'images/refresh.svg?react';
import DashCircleIcon from 'images/dash-circle.svg?react';
import {
  getStationID, cities, getTowns, hex2gray
} from '../utils/helpers';
import type {Moment} from '../components/WeatherIcon';
import type {City} from '../utils/helpers';

// Components
const WeatherCardWrapper = styled.div`
  display: block;
  position: relative;
  width: 350px;
  box-shadow: ${({theme}) => theme.boxShadow};
  background-color: ${({theme}) => theme.foregroundColor};
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
  color: ${({theme}) => theme.titleColor};
  cursor: pointer;
  border: none;
  &:hover {
    background: ${({theme}) => theme.menuHoverColor};
 }
`;

const LocationOption = styled.option`
  background-color:  ${({theme}) => theme.foregroundColor};
  font-size: 16px;
  color: ${({theme}) => theme.titleColor};
`;

const TownMenu = styled.select`
  display: inline;
  width: 90px;
  background: transparent;
  font-size: 18px;
  font-weight: 550;
  color: ${({theme}) => theme.titleColor};
  cursor: pointer;
  margin-left: 10px;
  border: none;
  &:hover {
    background: ${({theme}) => theme.menuHoverColor};
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
  ({theme}) => hex2gray(theme.foregroundColor)! > 127 ?
    '' :
    '-webkit-filter: invert(100%); filter: invert(100%);'
}
  @media (max-width: 500px), (max-height: 600px) {
    width: 16px;
 }
`;

const Description = styled.div`
  width: fit-content;
  padding-left: 5px;
  margin-top: 5px;
  margin-bottom: 10px;
  font-size: 16px;
  color: ${({theme}) => theme.textColor};
`;

const CurrentWeather = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: fit-content;
  justify-items: start;
  align-items: flex-end;
  margin-bottom: 10px;
  > svg{
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
  color: ${({theme}) => theme.temperatureColor};
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
  color: ${({theme}) => theme.temperatureColor};
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
  ({theme}) => hex2gray(theme.foregroundColor)! > 127 ?
    '' :
    '-webkit-filter: invert(100%); filter: invert(100%);'
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
  color: ${({theme}) => theme.textColor};
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

const LastUpdated = styled.div`
  display: inline-flex;
  align-items: center;
  position: absolute;
  right: 15px;
  bottom: 15px;
  font-size: 12px;
  color: ${({theme}) => theme.textColor};
`;

const Refresh = styled.button<{isLoading: boolean}>`
  margin-left: 4px;
  border: none;
  padding: 0;
  font-size: 12px;
  background-color: inherit;
  color: ${({theme}) => theme.textColor};
  svg {
    width: 15px;
    height: 15px;
    animation: ${({isLoading}) => (
    isLoading ?
      'rotate infinite 0.8s linear;' :
      'rotate 1 0.8s linear;'
  )};
  }
  &:disabled svg {
    opacity: 0.5;
  }

  &:focus, &:hover {
    outline: none;
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

export type WeatherCardProps = {
  cardIdx: number,
  moment: Moment,
  delCard: (cardIdx: number) => void,
}
const WeatherCard = ({
  cardIdx,
  moment,
  delCard,
}: WeatherCardProps) => {
  // Displayed city name and observation location name.
  const [currentCity, setCurrentCity] = useState<City>(() =>
    localStorage.getItem(`city${cardIdx}`) as City || '臺北市',
  );
  const [currentTown, setCurrentTown] = useState(() =>
    localStorage.getItem(`town${cardIdx}`) || '---',
  );
  const currentStation = useMemo(() => getStationID(currentCity),
    [currentCity]);

  // fetch weather info from API.
  const [weatherElement, fetchData, isRefreshCD] = useWeatherAPI(
    currentStation,
    currentCity,
    currentTown,
  );

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

  const cityChanged = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const locationName = e.target.value as City;
    localStorage.setItem(`town${cardIdx}`, '---');
    setCurrentTown('---');
    localStorage.setItem(`city${cardIdx}`, locationName);
    setCurrentCity(locationName);
  };

  const townChanged = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const townName = e.target.value;
    localStorage.setItem(`town${cardIdx}`, townName);
    setCurrentTown(townName);
  };

  // Drag event
  const [cardPos, setCardPos] = useState<{
    x: number | string, y: number | string
  }>(() => {
    return {x: 0, y: 0};
  });

  const ref = useRef<HTMLDivElement>(null);
  const draggingEvent = useMemo(() => {
    let isDragging = false;
    const startPoint = {
      x: 0,
      y: 0,
    };
    function start(e: React.MouseEvent<HTMLDivElement>) {
      isDragging = true;
      const domStyle = ref.current!.style;
      // final pos = previous pos + variation
      // variation = mousemoveEvent.clientPos - mousedownEvent.clientPos
      // start = previous pos - mousedownEvent.clientPos.
      startPoint.x = +domStyle.left.replace('px', '') - e.clientX;
      startPoint.y = +domStyle.top.replace('px', '') - e.clientY;
      window.addEventListener('mousemove', move, true);
      window.addEventListener('mouseup', end, true);
    }
    function move(e: MouseEvent) {
      if (isDragging) {
        setCardPos({
          x: `${startPoint.x + e.clientX}px`,
          y: `${startPoint.y + e.clientY}px`,
        });
      }
      e.stopPropagation();
    }
    function end(e: MouseEvent) {
      isDragging = false;
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', end);
      e.stopPropagation();
    }
    return {
      start,
      move,
      end,
    };
  }, []);

  // Delete event
  const deleteEvent = useCallback(() =>{
    delCard(cardIdx);
  }, [cardIdx]);

  // useEffect(() => {
  //   // 檢驗資料抓取
  //   let idxCity = 0;
  //   let idxTown = 0;
  //   let currentCity = cities[idxCity];
  //   setCurrentCity(currentCity);
  //   let towns = ["---", ...getTowns(currentCity)];
  //   let currentTown = towns[idxTown];
  //   const intervalId = setInterval(() => {
  //     if (!currentCity) return;
  //     console.log(currentCity, currentTown);
  //     if (currentTown) {
  //       setCurrentTown(currentTown);
  //       idxTown += 1;
  //       currentTown = towns[idxTown];
  //     } else { // 切換城市
  //       idxCity += 1;
  //       currentCity = cities[idxCity];
  //       if (!currentCity) return;
  //       else {
  //         towns = ["---", ...getTowns(currentCity)];
  //         idxTown = 0;
  //         currentTown = towns[idxTown];
  //         setCurrentCity(currentCity);
  //         setCurrentTown(currentTown);
  //       }
  //     }
  //   }, 100);
  //   return () => clearInterval(intervalId);
  // }, []);

  return (
    <WeatherCardWrapper
      ref={ref}
      style={{
        top: cardPos.y,
        left: cardPos.x,
      }}
      onMouseDown={draggingEvent.start}
    >
      <CityMenu
        onChange={cityChanged}
        value={currentCity}
        aria-label="縣市"
        name="city"
      >
        {cities.map((cityName) => (
          <LocationOption value={cityName} key={cityName}>
            {cityName}
          </LocationOption>
        ))}
      </CityMenu>
      <TownMenu
        onChange={townChanged}
        value={currentTown}
        aria-label="鄉鎮市區"
        name="town"
      >
        <LocationOption value={'---'} key={'---'}>
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
          <DangerIndex id={'DangerIndex'}>
            <Tooltip
              id={'DangerIndex'}
              content={'熱傷害指數'}
            />
            <DangerIcon />
            {heatInjuryIndex} {heatInjuryWarning}
          </DangerIndex>
        </TempNDanger>
        <Info>
          <AirFlow id={'AirFlow'}>
            <Tooltip
              id={'AirFlow'}
              content={'風速'}
            />
            <AirFlowIcon /> {windSpeed} m/h
          </AirFlow>
          <Rain id={'Rain'}>
            <Tooltip
              id={'Rain'}
              content={'12小時內降雨機率'}
            />
            <RainIcon /> {rainPossibility}%
          </Rain>
        </Info>
      </CurrentWeather>
      <LastUpdated>
        最後觀測時間：
        {new Intl.DateTimeFormat('zh-TW', {
          hour: 'numeric',
          minute: 'numeric',
          // @ts-expect-error
        }).format(dayjs(observationTime))}{' '}
        <Refresh
          type="button"
          onClick={isLoading ? undefined : fetchData}
          isLoading={isLoading}
          disabled={isRefreshCD || isLoading}
        >
          {isLoading ? <LoadingIcon /> : <RefreshIcon />}
        </Refresh>
      </LastUpdated>
    </WeatherCardWrapper>
  );
};

export default WeatherCard;
